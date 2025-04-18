import asyncio
import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from sqlalchemy.sql import text

from ..config.security import security_settings
from ...core.models.user import User

# Define an event_loop fixture with session scope.
@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()

# Create an engine fixture that uses the test event loop.
@pytest_asyncio.fixture(scope="module")
async def engine():
    engine = create_async_engine(
        str(security_settings.DATABASE_URL),
        pool_size=20,
        max_overflow=10,
        pool_pre_ping=True
    )
    yield engine
    await engine.dispose()

# Create a session fixture that uses the engine fixture.
@pytest_asyncio.fixture(scope="module")
async def session(engine) -> AsyncSession:
    AsyncSessionLocal = sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    async with AsyncSessionLocal() as session:
        yield session

@pytest.mark.asyncio
async def test_database_connection(session: AsyncSession):
    async with session.begin():
        result = await session.execute(text("SELECT 1"))
        value = result.scalar()
        assert value == 1

@pytest.mark.asyncio
async def test_create_and_read_user(session: AsyncSession):
    # Insert a new user inside a transaction block.
    async with session.begin():
        new_user = User(email="test@example.com", role_id=1, org_id=1)
        session.add(new_user)
        await session.flush()

    # Query for the user outside the transaction block.
    result = await session.execute(
        select(User).where(User.email == "test@example.com")
    )
    user_in_db = result.scalar_one_or_none()

    assert user_in_db is not None
    assert user_in_db.email == "test@example.com"
