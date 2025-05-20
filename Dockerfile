FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Install Tailwind CSS and related packages
RUN npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# Copy the rest of the code
COPY . .

# Ensure Tailwind config exists
RUN echo 'module.exports = {content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],theme: {extend: {}},plugins: []}' > tailwind.config.js
RUN echo 'module.exports = {plugins: {tailwindcss: {},autoprefixer: {}}}' > postcss.config.js

# Create a jsconfig.json to handle path aliases
RUN echo '{"compilerOptions":{"baseUrl":"./","paths":{"@/*":["*"]}}}' > jsconfig.json

EXPOSE 3000

# Start command will be provided by docker-compose.yml
