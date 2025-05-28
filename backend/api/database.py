import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

# --- Configuration ---
# Replace with your actual PostgreSQL connection string
# Format: "postgresql+asyncpg://username:password@host:port/database_name"

DATABASE_URL = f"postgresql+asyncpg://{os.getenv('postgis_user')}:{os.getenv("postgis_pass")}@{os.getenv('db_host')}:{os.getenv('db_port')}/postgres"
# It's often better to load this from environment variables or a config file in real projects.

# Create the SQLAlchemy asynchronous engine
async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production for less verbose logging
    # future=True # Included by default in SQLAlchemy 2.0
)

# Create a base class for declarative class definitions
Base = declarative_base()

# Create an asynchronous session factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,  # Good default for FastAPI usage
    class_=AsyncSession       # Use AsyncSession for the session class
)

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides an asynchronous database session per request.
    Ensures the session is properly closed after the request.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            # For a "read" operation, commit might not be necessary.
            # For "write" operations, if the endpoint logic itself doesn't commit,
            # this commit here might be too broad.
            # Typically, explicit commits are done in the endpoint/service layer
            # right after successful write operations.
            # For simplicity in the original example, a commit was placed here.
            # Consider if you want a commit here or in the endpoint logic.
            # If you handle transactions per endpoint, you might not need commit() here.
            # await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def create_db_and_tables():
    """
    Asynchronously creates all database tables defined by Base.metadata.
    This is typically called once on application startup.
    For production, consider using Alembic for migrations.
    """
    async with async_engine.begin() as conn:
        # This will create the "burn_class_enum_type" ENUM type in PostgreSQL
        # (if defined in your models and not already existing)
        # and then the tables.
        # await conn.run_sync(Base.metadata.drop_all) # Uncomment to drop all tables (for testing)
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables checked/created.")