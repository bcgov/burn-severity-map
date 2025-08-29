# Stage 1: Build the frontend
FROM docker.io/node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine

# Create a non-root user with UID 1001 (OpenShift-compatible)
RUN adduser -D -u 1001 caddyuser

# Install curl for debugging
RUN apk add --no-cache curl

# Copy the built frontend files
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Set ownership to non-root user
RUN chown -R 1001:1001 /usr/share/caddy /etc/caddy

# Switch to non-root user
USER 1001

# Expose non-privileged port
EXPOSE 8080

# Run Caddy on port 8080
ENTRYPOINT ["/usr/bin/caddy", "run", "--config", "/etc/caddy/Caddyfile"]
