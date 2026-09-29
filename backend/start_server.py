"""Wait for PostgreSQL before importing the existing FastAPI application."""
import os
import sys
import time
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from database.connection import engine

for attempt in range(30):
    try:
        with engine.connect() as connection:
            connection.execute(text('SELECT 1'))
        break
    except OperationalError:
        if attempt == 29:
            raise RuntimeError('PostgreSQL did not become ready; check DATABASE_URL.') from None
        print('Waiting for PostgreSQL...', flush=True)
        time.sleep(2)

if os.environ.get('SEED_DEMO_DATA', '').lower() == 'true':
    from seed_snapshot import seed_snapshot
    seed_snapshot()

os.execvp(sys.executable, [sys.executable, '-m', 'uvicorn', os.environ.get('APP_MODULE', 'main:app'),
    '--host', '0.0.0.0', '--port', os.environ.get('PORT', '8000'), '--proxy-headers'])
