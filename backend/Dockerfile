# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your backend API will use
EXPOSE 5000

# Run the backend
CMD ["npm", "start"]
