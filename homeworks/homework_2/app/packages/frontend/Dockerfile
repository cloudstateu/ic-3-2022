FROM node:16-alpine as build

WORKDIR /home/app
COPY package*.json .
RUN npm ci --silent

COPY . .
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /home/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]