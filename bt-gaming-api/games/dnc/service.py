from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
import uuid
from .models import DNCGameData, DNCNewGame

# Assuming your models are imported from wherever they are defined, e.g.:
# from .models import DNCGameData, DNCNewGame


class DNCGameService:

  def __init__(self) -> None:
    # Storing data as DNCGameData objects instead of raw dictionaries
    self.games_db: Dict[str, DNCGameData] = {}

  def clean_old_games(self) -> None:
    old_date = datetime.now(timezone.utc) - timedelta(days=7)
    to_delete = []

    for gid, game in self.games_db.items():
      # Ensure createdOn has timezone info for safe comparison
      created_on = game.createdOn
      if created_on:
        if created_on.tzinfo is None:
          created_on = created_on.replace(tzinfo=timezone.utc)
        if created_on < old_date:
          to_delete.append(gid)

    for gid in to_delete:
      del self.games_db[gid]

  def create_game(self, data: DNCNewGame) -> DNCGameData:
    # self.clean_old_games()
    new_game_id = str(uuid.uuid4())

    # Generate game code from UUID
    game_code = str(abs(hash(new_game_id)) % 10000).zfill(4)

    # Instantiate the full DNCGameData model using input payload data
    game = DNCGameData(
        id=new_game_id,
        gameCode=game_code,
        days=data.days,
        dayLength=data.dayLength,
        specialDay=data.specialDay,
        activities=data.activities,
        teams=[],
        shopItems=[],
        currentDay=0,
        currentSecond=0,
        isDay=False,
        startedOn=None,
        createdOn=datetime.now(timezone.utc),
    )

    self.games_db[new_game_id] = game
    return game

  def get_game(self, game_id: str) -> Optional[DNCGameData]:
    return self.games_db.get(game_id)

  def find_by_code(self, game_code: str) -> Optional[DNCGameData]:
    return next((g for g in self.games_db.values() if g.gameCode == game_code), None)


game_service = DNCGameService()