from typing import Dict, List
from fastapi import WebSocket

class DNCConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}
        self.client_rooms: Dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, game_id: str):
        await websocket.accept()
        if game_id not in self.rooms:
            self.rooms[game_id] = []
        self.rooms[game_id].append(websocket)
        self.client_rooms[websocket] = game_id

    def disconnect(self, websocket: WebSocket):
        game_id = self.client_rooms.pop(websocket, None)
        if game_id and game_id in self.rooms:
            if websocket in self.rooms[game_id]:
                self.rooms[game_id].remove(websocket)
            if not self.rooms[game_id]:
                del self.rooms[game_id]

    async def broadcast_to_group(self, game_id: str, message: dict):
        if game_id in self.rooms:
            for connection in self.rooms[game_id]:
                await connection.send_json(message)

manager = DNCConnectionManager()