# Stage 1: Build the frontend
FROM docker.io/node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine

# Install curl for debugging purposes
RUN apk add --no-cache ca-certificates curl

# remove Caddy capabilities to bind to lower ports
RUN setcap -r /usr/bin/caddy

# Copy the built frontend files
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# format the Caddyfile
RUN caddy fmt --overwrite /etc/caddy/Caddyfile

# Ports, healthcheck, non-root user
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:8080/health

# Non-root user
USER 1001

# Stage 1: Build the frontend
# FROM node:18 AS builder

# WORKDIR /app
# COPY . .

# RUN npm install
# RUN npm run build

# # Stage 2: Serve with Caddy
# FROM caddy:alpine

# # Install curl and libcap for debugging and capability management
# RUN apk add --no-cache curl libcap

# # remove Caddy capabilities to bind to lower ports
# # This may fail in some environments, so we make it non-fatal
# RUN setcap -r /usr/bin/caddy || echo "setcap failed (non-fatal in buildx)"

# # Create necessary directories and set ownership
# RUN mkdir -p /config/caddy /data/caddy/locks \
#     && addgroup --system appgroup \
#     && adduser --system --ingroup appgroup appuser \
#     && chown -R appuser:appgroup /config /data /usr/share/caddy

# Copy the built frontend files
# COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddyfile
# COPY --chown=appuser:appgroup Caddyfile /etc/caddy/Caddyfile

# Create a non-root user and group
# RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Run as appuser (non-root) (safe in containerized environments unless restricted)
# USER appuser

# HEALTHCHECK --interval=30s --timeout=5s CMD curl -f http://localhost/ || exit 1
