from datetime import datetime, timedelta, timezone
from pathlib import Path
import json
import os
from typing import Dict, List, Optional
import uuid
from .models import DNCGameData, DNCCreateGame, DNCActivity, DNCShopItem

# Read data directory from environment variable, default to current dir for local dev
DATA_DIR = Path(os.getenv("DATA_DIR", "."))
DATA_DIR.mkdir(parents=True, exist_ok=True)

GAMES_DB_FILE = DATA_DIR / "games_db.json"
ACTIVITIES_DB_FILE = DATA_DIR / "activities_db.json"
SHOP_ITEMS_DB_FILE = DATA_DIR / "shop_items_db.json"

class DNCGameService:

    def __init__(self) -> None:
        self.games_db: Dict[str, DNCGameData] = {}
        self.activities_db: Dict[str, DNCActivity] = {}
        self.shop_items_db: Dict[str, DNCShopItem] = {}
        self._load_from_disk()

    def _load_from_disk(self) -> None:
        """Loads games and activities from local JSON files if they exist."""
        if GAMES_DB_FILE.exists():
            try:
                data = json.loads(GAMES_DB_FILE.read_text())
                self.games_db = {
                    gid: DNCGameData(**gdata) for gid, gdata in data.items()
                }
            except Exception as e:
                print(f"Error loading games DB: {e}")

        if ACTIVITIES_DB_FILE.exists():
            try:
                data = json.loads(ACTIVITIES_DB_FILE.read_text())
                self.activities_db = {
                    aid: DNCActivity(**adata) for aid, adata in data.items()
                }
            except Exception as e:
                print(f"Error loading activities DB: {e}")

        if SHOP_ITEMS_DB_FILE.exists():
            try:
                data = json.loads(SHOP_ITEMS_DB_FILE.read_text())
                self.shop_items_db = {
                    sid: DNCShopItem(**sdata) for sid, sdata in data.items()
                }
            except Exception as e:
                print(f"Error loading shop items DB: {e}")

    def _save_games_to_disk(self) -> None:
        try:
            data = {
                gid: game.model_dump(mode="json")
                for gid, game in self.games_db.items()
            }
            GAMES_DB_FILE.write_text(json.dumps(data, indent=4))
        except Exception as e:
            print(f"Error saving games DB: {e}")

    def _save_activities_to_disk(self) -> None:
        try:
            data = {
                aid: activity.model_dump(mode="json")
                for aid, activity in self.activities_db.items()
            }
            ACTIVITIES_DB_FILE.write_text(json.dumps(data, indent=4))
        except Exception as e:
            print(f"Error saving activities DB: {e}")

    def _save_shop_items_to_disk(self) -> None:
        try:
            data = {
                sid: activity.model_dump(mode="json")
                for sid, activity in self.shop_items_db.items()
            }
            SHOP_ITEMS_DB_FILE.write_text(json.dumps(data, indent=4))
        except Exception as e:
            print(f"Error saving shop items DB: {e}")

    def clean_old_games(self) -> None:
        old_date = datetime.now(timezone.utc) - timedelta(days=7)
        to_delete = []

        for gid, game in self.games_db.items():
            created_on = game.createdOn
            if created_on:
                if created_on.tzinfo is None:
                    created_on = created_on.replace(tzinfo=timezone.utc)
                if created_on < old_date:
                    to_delete.append(gid)

        if to_delete:
            for gid in to_delete:
                del self.games_db[gid]
            self._save_games_to_disk()

    def create_game(self, data: DNCCreateGame) -> DNCGameData:
        self.clean_old_games()
        new_game_id = str(uuid.uuid4())

        game_code = str(abs(hash(new_game_id)) % 10000).zfill(4)

        game = DNCGameData(
            id=new_game_id,
            gameCode=game_code,
            days=data.days,
            dayLength=data.dayLength,
            specialDay=data.specialDay,
            activities=data.activities,
            teams=[],
            shopItems=data.shopItems,
            currentDay=0,
            currentSecond=0,
            isDay=False,
            startedOn=None,
            createdOn=datetime.now(timezone.utc),
        )

        self.games_db[new_game_id] = game
        self._save_games_to_disk()
        return game

    def get_game(self, game_id: str) -> Optional[DNCGameData]:
        return self.games_db.get(game_id)

    def find_by_code(self, game_code: str) -> Optional[DNCGameData]:
        return next((g for g in self.games_db.values() if g.gameCode == game_code), None)

    def save_game(self, game: DNCGameData) -> None:
        self.games_db[game.id] = game
        self._save_games_to_disk()

    # --- Activities Table Operations ---
    def get_all_activities(self) -> List[DNCActivity]:
        return list(self.activities_db.values())

    def add_activity(self, activity: DNCActivity) -> DNCActivity:
        # Using activityName as key (or you can use a UUID if preferred)
        activity.id = str(uuid.uuid4())
        self.activities_db[activity.id] = activity
        self._save_activities_to_disk()
        return activity

    def remove_activity(self, activity_id: str) -> bool:
        if activity_id in self.activities_db:
            del self.activities_db[activity_id]
            self._save_activities_to_disk()
            return True
        return False

        # --- Shop Item Table Operations ---
    def get_all_shop_items(self) -> List[DNCShopItem]:
        return list(self.shop_items_db.values())

    def add_shop_item(self, s: DNCShopItem) -> DNCShopItem:
        # Using activityName as key (or you can use a UUID if preferred)
        s.id = str(uuid.uuid4())
        self.shop_items_db[s.id] = s
        self._save_shop_items_to_disk()
        return s

    def remove_shop_item(self, shop_item_id: str) -> bool:
        if shop_item_id in self.shop_items_db:
            del self.shop_items_db[shop_item_id]
            self._save_shop_items_to_disk()
            return True
        return False


game_service = DNCGameService()