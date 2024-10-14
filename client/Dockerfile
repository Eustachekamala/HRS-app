# Use the official Node.js image from the Docker Hub
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the app for production
RUN npm run build

# Expose the port your frontend runs on (e.g., 3000)
EXPOSE 3000

# Serve the app (adjust as needed)
CMD ["npx", "serve", "-s", "build"]
