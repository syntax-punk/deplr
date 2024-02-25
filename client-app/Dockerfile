# Start from the official Node.js LTS (Long Term Support) base image
FROM node:lts

# Set the working directory in the Docker container
WORKDIR /usr/src/app4

# Copy package.json and package-lock.json into the Docker container
COPY package*.json ./

# Install dependencies in the Docker container
RUN npm install

# Copy the rest of your application code into the Docker container
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=development

# Specify the command to run your application
CMD [ "npm", "start" ]