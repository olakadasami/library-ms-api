# Use official Node.js image
FROM node:22.0.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port that AdonisJS will use
EXPOSE 3333

# Run database migrations
# RUN node ace migration:run --force

# Start the application using variables from Koyeb
# CMD ["node", "build/server.js"]

# Add this command to check if environment variables are being passed
CMD ["sh", "-c", "printenv && node build/bin/server.js"]
