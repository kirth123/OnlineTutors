#  Dockerfile for Node Express Backend

FROM node:alpine as build

WORKDIR /node

COPY package*.json ./

RUN npm install

COPY . .

COPY /etc/letsencrypt/live/www.onlinetutorstoday.net /node/tls

CMD npm start
