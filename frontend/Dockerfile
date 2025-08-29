# Stage 1: Build the frontend
FROM docker.io/node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine

# Install curl for debugging purposes
RUN apk add --no-cache curl

# remove Caddy capabilities to bind to lower ports
RUN setcap -r /usr/bin/caddy

# Copy the built frontend files
COPY --from=builder /app/dist /usr/share/caddy

# Copy the Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile
