#  Dockerfile for Node Express Backend
FROM node:alpine as build

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

CMD npm start
