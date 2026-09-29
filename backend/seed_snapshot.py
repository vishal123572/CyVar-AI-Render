"""Load the bundled snapshot into an empty cloud database, without overwrites."""
import json
from pathlib import Path
from sqlalchemy import select, text
from database.connection import Base, engine
from models import asset, business_service, security_control, software_inventory, vulnerability

def seed_snapshot():
    snapshot = json.loads((Path(__file__).parent / 'demo-data' / 'synthetic-data.json').read_text(encoding='utf-8'))
    with engine.begin() as connection:
        # Serialize first startup if deployments overlap.
        connection.execute(text('SELECT pg_advisory_xact_lock(731704217)'))
        Base.metadata.create_all(bind=connection)
        tables = Base.metadata.sorted_tables
        if set(snapshot) != {table.name for table in tables}:
            raise RuntimeError('Demo snapshot tables do not match the application models.')
        if any(connection.execute(select(table.c.id).limit(1)).first() for table in tables):
            print('Existing database records retained; demo import skipped.', flush=True)
            return
        for table in tables:
            rows = snapshot[table.name]
            if rows:
                connection.execute(table.insert(), rows)
                connection.execute(text("SELECT setval(pg_get_serial_sequence(:table, 'id'), :last_id, true)"),
                                   {'table': table.name, 'last_id': max(row['id'] for row in rows)})
        print('Included synthetic demo snapshot loaded.', flush=True)

if __name__ == '__main__':
    seed_snapshot()
