# Dockerfile for React client

#Build node image
FROM node:alpine as build

# Working directory 
WORKDIR /app

COPY package*.json ./

RUN npm install 

# copy local files to app folder
COPY . .

#create production build for react
RUN npm run build 

#Build nginx image
FROM nginx:alpine

RUN mkdir -p /var/www/OnlineTutors/client/build

COPY --from=build /app/build /var/www/OnlineTutors/client/build

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD nginx -g "daemon off;"

