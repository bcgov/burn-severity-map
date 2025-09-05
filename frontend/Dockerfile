# Stage 1: Build the frontend
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine

# Install curl and libcap for debugging and capability management
RUN apk add --no-cache curl libcap

# remove Caddy capabilities to bind to lower ports
# This may fail in some environments, so we make it non-fatal
RUN setcap -r /usr/bin/caddy || echo "setcap failed (non-fatal in buildx)"

# Create necessary directories
RUN mkdir -p /config/caddy /data/caddy

# Copy the built frontend files
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile
RUN chmod -R 777 /data /config

# Run as root (safe in containerized environments unless restricted)
USER root
