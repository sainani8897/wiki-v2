# Use the official Node.js image as the base image
FROM node:16

# Set environment variables
ENV NODE_ENV=development
ENV APP_NAME=Wikiskillz
ENV APP_ENV=local
ENV APP_KEY=base64:28b8LR4NS6GkMnJvP1uAyeaLCcCtLF7eZL1ONIBXySY=
ENV API_KEY=28b8LR4NS6GkMnJvP1uAyeaLCcCtLF7eZL1ONIBXySY=
ENV APP_DEBUG=true
ENV APP_URL=http://localhost:4040
ENV APP_PORT=4040

ENV DB_CONNECTION=mongodb
ENV DB_HOST=mongo
ENV DB_PORT=27017
ENV DB_DATABASE=wikiskillz
ENV DB_USERNAME=
ENV DB_PASSWORD=
ENV REDIS_HOST=redis
ENV REDIS_PASSWORD=null
ENV REDIS_PORT=6379

# Create and set the working directory
WORKDIR /var/app

# Copy package.json and package-lock.json to the container
COPY package*.json yarn.lock ./

# Install Node.js dependencies
RUN yarn install

# Copy the rest of the application files to the container
COPY ./ ./

# Start the Node.js application
CMD ["npm","run","dev"]