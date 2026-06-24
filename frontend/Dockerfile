# Stage 1: Build the frontend
FROM docker.io/node:22-alpine AS builder

# Define build arguments
# ARG REACT_APP_BASE_URL
# ARG REACT_APP_AUTH_CALLBACK_URL

# Set environment variables from build args
# ENV REACT_APP_BASE_URL=$REACT_APP_BASE_URL
# ENV REACT_APP_AUTH_CALLBACK_URL=$REACT_APP_AUTH_CALLBACK_URL

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
#HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost/:8080/health

# Non-root user
USER 1001
