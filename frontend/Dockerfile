# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.19.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory for all build stages.
WORKDIR /usr/src/app


################################################################################
# Create a stage for installing production dependecies.
FROM base AS deps

COPY package*.json ./
RUN npm ci --omit=dev
# RUN npm install --omit=dev

# Install 'serve' to serve static files in production
RUN npm install --omit=dev serve

################################################################################
# Build the application
FROM deps AS build

# Copy the rest of the source files into the image.
COPY . .

RUN npm ci && npm run build

################################################################################
# Run the application
FROM base AS final

# Use production node environment by default.
ENV NODE_ENV=production

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application using 'serve' to serve the static files from /dist
CMD ["npx", "serve", "-s", "dist", "-l", "8080"]

