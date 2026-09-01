from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
import uuid

class DNCShopItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    itemName: Optional[str] = None
    description: Optional[str] = None
    cost: Optional[int] = None

class DNCActivity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    activityName: Optional[str] = None
    description: Optional[str] = None
    points: Optional[int] = None
    # shopItems: List[DNCShopItem] = []

class DNCTeamState(BaseModel):
    teamName: Optional[str] = None
    score: int = 0
    scoringFactor: int = 1  # Note: matched C# int type instead of float
    color: Optional[str] = None

class DNCGameData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    gameCode: Optional[str] = None
    days: int
    dayLength: int
    specialDay: Optional[int] = 0  # C# uses int for SpecialDay here
    startedOn: Optional[datetime] = None
    currentDay: int = 0
    currentSecond: int = 0
    isDay: bool = False
    createdOn: Optional[datetime] = Field(default_factory=datetime.utcnow)
    teams: List[DNCTeamState] = []
    activities: List[DNCActivity] = []
    shopItems: List[DNCShopItem] = []

class DNCCreateGame(BaseModel):
    days: int
    dayLength: int
    specialDay: int = 0
    activities: List[DNCActivity] = []
    shopItems: List[DNCShopItem] = []
    teams: List[DNCTeamState] = []

class DNCJoinGame(BaseModel):
    gameCode: Optional[str] = None

class DNCPauseGame(BaseModel):
    id: Optional[str] = None
    currentDay: int
    currentSecond: int
    isDay: bool = False

# class DNCRestartGame(BaseModel):
#     id: Optional[str] = None


class DNCUpdateGameSettings(BaseModel):
    id: Optional[str] = None
    days: int
    dayLength: int
    specialDay: int = 0
    activities: List[DNCActivity] = []
    shopItems: List[DNCShopItem] = []
    teams: List[DNCTeamState] = []

class DNCUpdateGameScore(BaseModel):
    id: Optional[str] = None
    teamName: Optional[str] = None
    scoreAdjustment: int

# class DNCAddTeam(BaseModel):
#     gameID: Optional[str] = None
#     teamName: Optional[str] = None
#     color: Optional[str] = None

# class DNCRemoveTeam(BaseModel):
#     gameID: Optional[str] = None
#     teamName: Optional[str] = None

# class DNCAddActivity(DNCActivity):
#     gameID: Optional[str] = None

# class DNCAddShopItem(DNCShopItem):
#     gameID: Optional[str] = None
