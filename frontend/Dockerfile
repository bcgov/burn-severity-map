FROM docker.io/node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine

# Install curl and libcap for debugging and capability management
RUN apk add --no-cache curl libcap

# remove Caddy capabilities to bind to lower ports
RUN setcap -r /usr/bin/caddy

# Create necessary directories and set correct ownership
RUN mkdir -p /config/caddy /data/caddy && \
    chown -R caddy:caddy /config /data

# Copy the built frontend files
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Run as the caddy user to ensure proper permissions
USER caddy
