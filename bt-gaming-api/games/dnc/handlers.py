from datetime import datetime, timezone
import uuid
from games.dnc.service import game_service
from games.dnc.manager import manager

async def handle_create_game(websocket, data, current_game_id):
    req = data # already validated or parsed
    game = game_service.create_game(req)
    gid = game["id"]
    manager.switch_room(websocket, current_game_id, gid)
    await manager.broadcast_to_group(gid, {"type": "Update", "game": game})

async def handle_join_game(websocket, data, current_game_id):
    game = game_service.find_by_code(data.gameCode)
    if game:
        gid = game["id"]
        manager.switch_room(websocket, current_game_id, gid)
        await manager.send_to_client(websocket, {"type": "Update", "game": game})

async def handle_update_settings(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        game["dayLength"] = data.dayLength
        game["days"] = data.days
        game["specialDay"] = data.specialDay
        await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_restart_game(game_id):
    game = game_service.get_game(game_id)
    if game:
        game["currentDay"] = 0
        game["currentSecond"] = 0
        game["startedOn"] = None
        game["isDay"] = False
        for team in game.get("teams", []):
            team["scoringFactor"] = 1
            team["score"] = 0
        await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_add_team(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        if not any(t["teamName"] == data.teamName for t in game["teams"]):
            new_team = {"teamName": data.teamName, "score": 0, "scoringFactor": 1, "color": data.color}
            game["teams"].append(new_team)
            await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_remove_team(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        game["teams"] = [t for t in game["teams"] if t["teamName"] != data.teamName]
        await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_add_activity(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        if not any(a["activityName"] == data.activityName for a in game["activities"]):
            game["activities"].append({"activityName": data.activityName})
            await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_remove_activity(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        game["activities"] = [a for a in game["activities"] if a["activityName"] != data.activityName]
        await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_add_shop_item(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        if not any(s["itemName"] == data.itemName for s in game["shopItems"]):
            game["shopItems"].append({"itemName": data.itemName})
            await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_remove_shop_item(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        game["shopItems"] = [s for s in game["shopItems"] if s["itemName"] != data.itemName]
        await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_start_game(game_id):
    game = game_service.get_game(game_id)
    if game and not game["startedOn"]:
        game["startedOn"] = datetime.now(timezone.utc).isoformat()
        await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_pause_game(game_id, data):
    game = game_service.get_game(game_id)
    if game and game["startedOn"]:
        game["startedOn"] = None
        game["currentDay"] = data.currentDay
        game["currentSecond"] = data.currentSecond
        game["isDay"] = data.isDay
        await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})

async def handle_update_score(game_id, data):
    game = game_service.get_game(game_id)
    if game:
        team = next((t for t in game["teams"] if t["teamName"] == data.teamName), None)
        if team:
            team["score"] += data.scoreAdjustment
            if data.color:
                team["color"] = data.color
            await manager.broadcast_to_group(game_id, {"type": "Update", "game": game})