# Use the official Node.js image as the base image
FROM node:16

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 8010

# Run the application
CMD ["node", "dist/main"]
