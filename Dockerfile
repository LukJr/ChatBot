# 1. Use the official Node.js image
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy app dependencies
COPY package.json package-lock.json ./
RUN npm install

# 4. Copy all other files
COPY . .

# 5. Build the Next.js app
RUN npm run build

# 6. Use a lightweight image for running the app
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only the necessary files from build stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment
ENV NODE_ENV=production
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]