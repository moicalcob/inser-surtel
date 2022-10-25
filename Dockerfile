### BUILD INSER MAIN STAGE ###
FROM node:14.15-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:prod

### BUILD INSER SECONDARY STAGE ###
FROM node:14.15-alpine AS build2
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:prod2

### RUN STAGE ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/INSER /usr/share/nginx/html
COPY --from=build2 /usr/src/app/dist/INSER /usr/share/nginx/html2