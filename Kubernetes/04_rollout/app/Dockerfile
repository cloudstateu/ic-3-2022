FROM node:slim

WORKDIR /home/app

COPY package*.json .
RUN npm ci --slient

COPY . .

ENTRYPOINT ["node", "index.js"]