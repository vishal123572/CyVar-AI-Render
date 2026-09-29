FROM postgres:17-bookworm
# PostgreSQL runs this only when initializing a new, empty persistent volume.
COPY demo-data/cyvar_db.sql /docker-entrypoint-initdb.d/001-cyvar-demo.sql
