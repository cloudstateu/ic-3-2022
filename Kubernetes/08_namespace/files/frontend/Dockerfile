FROM node:latest

WORKDIR /usr/src/frontend/

COPY package.json .

COPY frontend.js .

RUN npm install

EXPOSE 8080

CMD npm start