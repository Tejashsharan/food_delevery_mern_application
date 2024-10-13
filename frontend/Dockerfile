# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the frontend React app
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the port that the frontend will use
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
