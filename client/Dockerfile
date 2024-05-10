# Dockerfile for React client
#Build npm sys
FROM node:alpine as build

# Working directory
WORKDIR /app

COPY package*.json ./

# Installing dependencies
RUN npm install --silent

# copy local files to app folder
COPY . .

#create production build for react
RUN npm run build

RUN timedatectl set-timezone America/New_York

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
