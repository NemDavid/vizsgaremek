# 1. lépés: Build stage
FROM node:18 AS build

# App mappa a konténerben
WORKDIR /app

# package.json és lock fájlok másolása
COPY package*.json ./

# Függőségek telepítése
RUN npm install

# A teljes frontend kód másolása
COPY . .

# React app buildelése (production build)
RUN npm run build

# 2. lépés: Serve stage (statikus fájlok kiszolgálása)
FROM nginx:alpine

# A buildelt React app másolása az nginx default könyvtárába
COPY --from=build /app/build /usr/share/nginx/html

# Nginx port
EXPOSE 80

# Nginx indítása foregroundban
CMD ["nginx", "-g", "daemon off;"]
