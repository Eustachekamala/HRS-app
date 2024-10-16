# Use the official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package files to install dependencies
COPY ./client/package.json ./client/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY ./client .

# Expose the application port (Vite's default is 3000)
EXPOSE 3000

# Start the Vite application in development mode
CMD ["npm", "run", "dev"]
