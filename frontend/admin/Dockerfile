# Use the official Node.js image as the base image
# Install dependencies only when needed
# FROM --platform=linux/x86-64 node:14-slim AS deps
FROM node:16
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

# Set environment variables
ENV NODE_ENV=development
ENV APP_NAME=Wikiskillz
ENV APP_ENV=local
ENV APP_URL=http://localhost:4040
ENV API_URL=http://localhost:4040/api/v1
ENV APP_PORT=4040


# Create and set the working directory
WORKDIR /var/admin

#Install dependencies Yarn 
# RUN yarn set version berry

COPY package.json tsconfig.json yarn.lock  ./
# COPY .yarn ./.yarn

# COPY frontend/admin  frontend/admin

RUN yarn install

# Copy the rest of the application files to the container
COPY ./ ./

# Start the Node.js application
# CMD ["npm","run","dev"]

# Start the Node.js application

EXPOSE 3100

CMD ["yarn","dev"]

# EXPOSE 3100