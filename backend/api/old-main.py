import enum
from typing import AsyncGenerator, List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, constr
from sqlalchemy import Column, Index, String, create_engine
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import Mapped, declarative_base, mapped_column

# --- Configuration ---
# Replace with your actual PostgreSQL connection string
# Format: "postgresql+asyncpg://username:password@host:port/database_name"
DATABASE_URL = "postgresql+asyncpg://postgres:redhat@127.0.0.1:5432/postgres"

# --- SQLAlchemy Setup ---
Base = declarative_base()
async_engine = create_async_engine(DATABASE_URL, echo=True) # echo=True for logging SQL
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    class_=AsyncSession
)



# --- SQLAlchemy Model ---
class BurnRecord(Base):
    __tablename__ = "burn_records"

    # Columns
    FIRE_NUMBER: Mapped[str] = mapped_column(String(100), primary_key=True, index=True)
    PRE_DATE: Mapped[Optional[str]] = mapped_column(String(50)) # Assuming YYYY-MM-DD or similar
    POST_DATE: Mapped[Optional[str]] = mapped_column(String(50))
    BURN_CLASS: Mapped[BurnClassEnum] = mapped_column(SQLAlchemyEnum(BurnClassEnum, name="burn_class_enum_type", create_type=True))

    # For PostgreSQL, an explicit index on FIRE_NUMBER is created because it's a PK.
    # If you needed other indexes, you could define them like this:
    # __table_args__ = (Index("ix_burn_records_fire_number", "FIRE_NUMBER", unique=True),)

    def __repr__(self):
        return f"<BurnRecord(FIRE_NUMBER='{self.FIRE_NUMBER}', BURN_CLASS='{self.BURN_CLASS}')>"



# --- FastAPI Application ---
app = FastAPI(
    title="Burn Records API",
    description="API for managing fire burn records.",
    version="1.0.0"
)

# --- Dependency to get DB session ---
async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency that provides an asynchronous database session.
    Ensures the session is closed after the request.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit() # Commit changes if no exceptions
        except Exception:
            await session.rollback() # Rollback on error
            raise
        finally:
            await session.close()


# --- Event to create database tables on startup (for development) ---
@app.on_event("startup")
async def startup_event():
    """
    On application startup, create all database tables if they don't exist.
    For production, use a migration tool like Alembic.
    """
    async with async_engine.begin() as conn:
        # This will create the "burn_class_enum_type" ENUM type in PostgreSQL
        # and then the "burn_records" table.
        # await conn.run_sync(Base.metadata.drop_all) # Use to drop tables if needed for reset
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables checked/created.")

# --- API Endpoints ---

@app.post(
    "/burn-records/",
    response_model=BurnRecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new burn record",
    tags=["Burn Records"]
)
async def create_burn_record(
    record_data: BurnRecordCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Creates a new burn record in the database.
    - **FIRE_NUMBER**: Unique identifier for the fire.
    - **PRE_DATE**: Date string before the burn.
    - **POST_DATE**: Date string after the burn.
    - **BURN_CLASS**: Severity of the burn (High, Moderate, Low, None).
    """
    # Check if record with this FIRE_NUMBER already exists
    stmt_select = select(BurnRecord).where(BurnRecord.FIRE_NUMBER == record_data.FIRE_NUMBER)
    existing_record_result = await db.execute(stmt_select)
    if existing_record_result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Burn record with FIRE_NUMBER '{record_data.FIRE_NUMBER}' already exists."
        )

    # Create new SQLAlchemy model instance
    db_record = BurnRecord(
        FIRE_NUMBER=record_data.FIRE_NUMBER,
        PRE_DATE=record_data.PRE_DATE,
        POST_DATE=record_data.POST_DATE,
        BURN_CLASS=record_data.BURN_CLASS  # Pydantic ensures this is a valid BurnClassEnum
    )

    # Add to session and flush to get it into the DB (commit happens in get_async_db)
    db.add(db_record)
    await db.flush() # Flushes changes to the DB, good for getting generated IDs or ensuring constraints
    await db.refresh(db_record) # Refreshes the instance with data from the DB (e.g., defaults)

    return db_record # FastAPI will convert this to BurnRecordResponse


@app.get(
    "/burn-records/",
    response_model=List[BurnRecordResponse],
    summary="Read all burn records",
    tags=["Burn Records"]
)
async def read_all_burn_records(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves a list of all burn records from the database, with pagination.
    - **skip**: Number of records to skip.
    - **limit**: Maximum number of records to return.
    """
    stmt = select(BurnRecord).offset(skip).limit(limit)
    result = await db.execute(stmt)
    records = result.scalars().all()
    return records # FastAPI converts list of ORM models to list of Pydantic response models

@app.get(
    "/burn-records/{fire_number}",
    response_model=BurnRecordResponse,
    summary="Read a specific burn record by FIRE_NUMBER",
    tags=["Burn Records"]
)
async def read_burn_record_by_fire_number(
    fire_number: str,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieves a specific burn record by its FIRE_NUMBER.
    - **fire_number**: The unique FIRE_NUMBER of the record to retrieve.
    """
    stmt = select(BurnRecord).where(BurnRecord.FIRE_NUMBER == fire_number)
    result = await db.execute(stmt)
    record = result.scalars().first()
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Burn record with FIRE_NUMBER '{fire_number}' not found."
        )
    return record