#  Dockerfile for Node Express Backend

# Build npm sys
FROM node:alpine as build

# Working directory 
WORKDIR /node

# Install Dependencies
COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .

CMD npm start
