import asyncio
from pathlib import Path
from src.skeleton.skeleton import run_evaluation

# ----------- Main Function -----------
async def main(csv_path, test_size=None):
    return await run_evaluation(csv_path, test_size)

# ----------- Run -----------
if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent
    csv_path = base_dir / 'vectordb_data.csv'
    asyncio.run(main(csv_path, test_size=1))
