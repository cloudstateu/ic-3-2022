FROM node:slim

WORKDIR /home/app

COPY package*.json .
RUN npm ci --slient

COPY . .

EXPOSE 8080
CMD npm start