FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM nginx:stable-alpine
ENV PORT=8080 API_UPSTREAM=http://backend:8000
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY frontend/15-resolvers.envsh /docker-entrypoint.d/15-resolvers.envsh
RUN chmod +x /docker-entrypoint.d/15-resolvers.envsh
EXPOSE 8080
