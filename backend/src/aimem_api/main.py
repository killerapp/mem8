"""Main FastAPI application for AI-Mem backend API."""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response

from .config import get_settings
from .database import init_db, close_db
from .routers import thoughts, search, sync, teams, health
# from .websocket import websocket_endpoint

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager."""
    settings = get_settings()
    
    # Initialize database (disabled for demo)
    logger.info("Database initialization disabled for demo")
    # await init_db()
    
    logger.info(f"AI-Mem API starting on {settings.host}:{settings.port}")
    yield
    
    # Cleanup (disabled for demo)
    logger.info("Shutting down AI-Mem API...")
    # await close_db()


# Create FastAPI app
app = FastAPI(
    title="AI-Mem API",
    description="Backend API for AI Memory Management and team collaboration",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Get settings
settings = get_settings()

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts,
)

# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(
    thoughts.router,
    prefix="/api/v1",
    tags=["thoughts"]
)
app.include_router(
    search.router,
    prefix="/api/v1", 
    tags=["search"]
)
app.include_router(
    sync.router,
    prefix="/api/v1",
    tags=["sync"]
)
app.include_router(
    teams.router,
    prefix="/api/v1",
    tags=["teams"]
)

# WebSocket endpoint (temporarily disabled)
# app.add_websocket_route("/ws/{team_id}", websocket_endpoint)


@app.get("/metrics")
async def metrics() -> Response:
    """Prometheus metrics endpoint."""
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {
        "message": "AI-Mem API",
        "version": "0.1.0",
        "docs": "/docs"
    }