FROM node:18-alpine
WORKDIR /app

# Set PATH to include node_modules/.bin
ENV PATH /app/node_modules/.bin:$PATH

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build the application and verify the build
RUN npm run build && \
    ls -la .next || echo "Build failed - .next directory not created"

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application with debugging information
CMD ["sh", "-c", "ls -la && ls -la .next || echo '.next directory not found' && npx next start -H 0.0.0.0"]
