# Dockerfile for React client
FROM node:alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

#create production build for react
RUN npm run build 

FROM nginx:alpine

#use react prod build from prev build stage as nginx webroot
COPY --from=build /app/build /usr/share/nginx/html

#copy nginx conf file from source directory to docker nginx container
COPY ./nginx.conf /etc/nginx/nginx.conf

CMD nginx -g "daemon off;"

