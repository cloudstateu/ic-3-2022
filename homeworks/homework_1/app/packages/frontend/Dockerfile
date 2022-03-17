FROM node:16-alpine as build

WORKDIR /home/app
COPY package*.json ./
RUN npm ci --silent

COPY ./ ./
RUN npm run build

# production environment
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /home/app/build ./
EXPOSE 80

COPY ./env.sh ./
COPY .env ./

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]