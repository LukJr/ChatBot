FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Make sure next.config.js is being used instead of next.config.ts
RUN if [ -f next.config.ts ]; then rm next.config.ts; fi

# Build the Next.js application
RUN npx next build

# Verify build artifacts exist
RUN ls -la && ls -la .next || echo "Build directory not found"

# Expose port
EXPOSE 3000

# Start the application
CMD ["npx", "next", "start", "-H", "0.0.0.0"]
