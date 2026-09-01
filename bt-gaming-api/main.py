from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from games.dnc.router import router as dnc_router

app = FastAPI(title="BTGaming Platform API", version="1.0")


# Define allowed frontend origins
origins = [
    "https://gaming.blitzitweb.com.au",
    "https://gaming.blitzitweb.com.au/",
    "http://localhost:5173",  # For local Vite development
    "http://localhost:3000",  # Alternative local port
]

# Configure CORS so your Vue frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # For local development, allow all origins (or specify ["http://localhost:5173"])
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PATCH, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Mount your DNC game routes
app.include_router(dnc_router, prefix="/api/dnc", tags=["Night/Day Countdown"])

@app.get("/")
async def root():
    return {"status": "BTGaming server platform is online"}