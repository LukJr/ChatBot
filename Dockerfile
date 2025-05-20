# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Copy built assets and necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Start the application using npx to directly call Next.js
CMD ["npx", "next", "start", "-H", "0.0.0.0"]
