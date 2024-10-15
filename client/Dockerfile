# client/Dockerfile

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

# Expose the application port
EXPOSE 3000

# Start the Vite application in development mode
CMD ["npm", "run", "dev"]
