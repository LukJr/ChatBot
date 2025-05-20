FROM node:18-alpine AS runner
WORKDIR /app

# Copy only needed files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install production-only dependencies
RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
