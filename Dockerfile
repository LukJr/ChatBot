FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (not just production)
RUN npm install

# Copy the rest of the code
COPY . .

# Create a jsconfig.json to handle path aliases
RUN echo '{"compilerOptions":{"baseUrl":"./","paths":{"@/*":["*"]}}}' > jsconfig.json

# Install missing dependencies
RUN npm install -D tailwindcss postcss autoprefixer

EXPOSE 3000

# Start command will be provided by docker-compose.yml
