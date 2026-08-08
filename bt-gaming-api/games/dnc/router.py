from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from games.dnc.manager import manager
from games.dnc.models import (
    DNCAddActivity,
    DNCAddShopItem,
    DNCAddTeam,
    DNCGameData,
    DNCGameUpdate,
    DNCJoinGame,
    DNCNewGame,
    DNCPauseGame,
    DNCRestartGame,
    DNCUpdateGameSettings,
    DNCTeamState,
    DNCActivity,
    DNCShopItem,
)
from games.dnc.service import game_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


# --- Reusable Dependency ---
async def get_game_or_404(game_id: str) -> DNCGameData:
    game = game_service.get_game(game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game


async def broadcast_game_update(game_id: str, game: DNCGameData) -> None:
    """Helper to broadcast game state safely with proper JSON serialization."""
    await manager.broadcast_to_group(
        game_id, {"type": "Update", "game": game.model_dump(mode="json")}
    )


# --- Read-Only WebSocket Stream ---
@router.websocket("/ws/{game_id}")
async def dnc_websocket_endpoint(websocket: WebSocket, game_id: str) -> None:
    await manager.connect(websocket, game_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# --- REST Endpoints ---


@router.post("/create", response_model=DNCGameData)
async def create_game(data: DNCNewGame) -> DNCGameData:
    logger.info("r")
    logger.debug("d")
    return game_service.create_game(data)


@router.post("/join")
async def join_game(data: DNCJoinGame) -> DNCGameData:
    game = game_service.find_by_code(data.gameCode)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game.model_dump()
    # return {"status": "success", "gameID": game.id}


@router.put("/{game_id}/settings", response_model=DNCGameData)
async def update_settings(
    data: DNCUpdateGameSettings, game: DNCGameData = Depends(get_game_or_404)
) -> DNCGameData:
    game.dayLength = data.dayLength
    game.days = data.days
    game.specialDay = data.specialDay

    await broadcast_game_update(game.id, game)
    return game.model_dump()


@router.post("/{game_id}/restart", response_model=DNCGameData)
async def restart_game(game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    game.currentDay = 0
    game.currentSecond = 0
    game.startedOn = None
    game.isDay = False
    for team in game.teams:
        team.scoringFactor = 1
        team.score = 0

    await broadcast_game_update(game.id, game)
    return game.model_dump()


@router.post("/{game_id}/teams", response_model=DNCGameData)
async def add_team(data: DNCAddTeam, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    if not any(t.teamName == data.teamName for t in game.teams):
        new_team = DNCTeamState(
            teamName=data.teamName, score=0, scoringFactor=1, color=data.color
        )
        game.teams.append(new_team)
        await broadcast_game_update(game.id, game)

    return game.model_dump()


@router.delete("/{game_id}/teams/{team_name}", response_model=DNCGameData)
async def remove_team(team_name: str, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    game.teams = [t for t in game.teams if t.teamName != team_name]
    await broadcast_game_update(game.id, game)
    return game.model_dump()


@router.post("/{game_id}/activities", response_model=DNCGameData)
async def add_activity(data: DNCAddActivity, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    if not any(a.activityName == data.activityName for a in game.activities):
        game.activities.append(
            DNCActivity(
                activityName=data.activityName,
                description=data.description,
                points=data.points,
            )
        )
        await broadcast_game_update(game.id, game)

    return game.model_dump()


@router.delete("/{game_id}/activities/{activity_name}", response_model=DNCGameData)
async def remove_activity(activity_name: str, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    game.activities = [
        a for a in game.activities if a.activityName != activity_name
    ]
    await broadcast_game_update(game.id, game)
    return game.model_dump()


@router.post("/{game_id}/shop", response_model=DNCGameData)
async def add_shop_item(data: DNCAddShopItem, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    if not any(s.itemName == data.itemName for s in game.shopItems):
        game.shopItems.append(
            DNCShopItem(
                itemName=data.itemName,
                description=data.description,
                cost=data.cost,
            )
        )
        await broadcast_game_update(game.id, game)

    return game.model_dump()


@router.delete("/{game_id}/shop/{item_name}", response_model=DNCGameData)
async def remove_shop_item(item_name: str, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    game.shopItems = [s for s in game.shopItems if s.itemName != item_name]
    await broadcast_game_update(game.id, game)
    return game.model_dump()


@router.post("/{game_id}/start", response_model=DNCGameData)
async def start_game(game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    if not game.startedOn:
        game.startedOn = datetime.now(timezone.utc)
        await broadcast_game_update(game.id, game)

    return game.model_dump()


@router.post("/{game_id}/pause", response_model=DNCGameData)
async def pause_game(data: DNCPauseGame, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    if game.startedOn:
        game.startedOn = None
        game.currentDay = data.currentDay
        game.currentSecond = data.currentSecond
        game.isDay = data.isDay
        await broadcast_game_update(game.id, game)

    return game.model_dump()


@router.patch("/{game_id}/score", response_model=DNCGameData)
async def update_score(data: DNCGameUpdate, game: DNCGameData = Depends(get_game_or_404)) -> DNCGameData:
    team = next((t for t in game.teams if t.teamName == data.teamName), None)
    if team:
        team.score += data.scoreAdjustment
        if data.color:
            team.color = data.color
        await broadcast_game_update(game.id, game)

    return game.model_dump()