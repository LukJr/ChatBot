FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Install global tools
RUN npm install -g next

EXPOSE 3000

# The actual build and run commands are in docker-compose.yml
