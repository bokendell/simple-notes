# Stage 1: Build the React application
FROM node:20-alpine AS build

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory for client
WORKDIR /app/client

# Copy client package files
COPY client/package.json client/yarn.lock ./

# Install client dependencies
RUN yarn install

# Copy the entire client directory
COPY client/. ./

# Build the React application
RUN yarn build

# Stage 2: Set up the Express server to serve the React build
FROM node:20-alpine

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory for server
WORKDIR /app

# Copy server package files
COPY package.json yarn.lock ./

# Install server dependencies (only production)
RUN yarn install --production

# Remove build dependencies to keep the image lightweight
RUN apk del python3 make g++

# Copy the built React app from the build stage
COPY --from=build /app/client/build ./client/build

# Copy the rest of the server code
COPY . ./

# Expose port 4000 for the server
EXPOSE 4000

# Start the Express server
CMD ["yarn", "start"]
