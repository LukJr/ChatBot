FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Run the debugging script to inspect the setup
RUN node debug-nextjs.js

# Make sure next.config.js is being used instead of next.config.ts
RUN if [ -f next.config.ts ]; then rm next.config.ts; fi

# Try to build Next.js with multiple approaches
RUN echo "Attempting to build with npx next build" && \
    npx next build || \
    echo "Trying alternative build approach" && \
    NODE_ENV=production npx next build || \
    echo "Failed to build Next.js application"

# Expose port
EXPOSE 3000

# If build failed, run debug script otherwise start the app
CMD ["sh", "-c", "if [ ! -d .next ]; then node debug-nextjs.js; else npx next start -H 0.0.0.0; fi"]
