# Use the official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files
COPY ./client/package.json .
COPY ./client/package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY ./client .

# Build the Vite application
RUN npm run build

# Install a simple server to serve the static files
RUN npm install -g serve

# Expose the application port
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "dist"]
