# Start from the official Node.js LTS (Long Term Support) base image
FROM node:lts

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the Docker container
COPY package*.json ./

# Install dependencies in the Docker container
RUN npm install

# Copy the rest of your application code into the Docker container
COPY . .

# Expose the port that your Express.js app listens on
EXPOSE 1337

# Specify the command to run your application
CMD [ "npm", "start" ]