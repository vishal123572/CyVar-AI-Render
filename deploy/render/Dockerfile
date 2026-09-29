FROM node:22-bookworm-slim AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.13-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 PORT=10000 \
    APP_MODULE=cloud_main:app SEED_DEMO_DATA=true LLM_PROVIDER=none \
    OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY backend/requirements-docker.txt ./requirements.txt
RUN pip install -r requirements.txt
COPY backend/ ./
COPY demo-data/synthetic-data.json ./demo-data/synthetic-data.json
COPY --from=frontend /frontend/dist ./static
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 10000
CMD ["python", "start_server.py"]
