FROM node:20-alpine

# Set working directory
WORKDIR /app

# No need to copy package files or build - will be mounted from host
# Just install any global tools needed
RUN npm install -g next

EXPOSE 3000

# The actual build and run commands are in docker-compose.yml
