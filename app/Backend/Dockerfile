# 1. lépés: Node környezet
FROM node:18

# Mappa a konténerben
WORKDIR /app

# package.json és lock
COPY package*.json ./

# Függőségek telepítése
RUN npm install

# A teljes backend kód másolása
COPY . .

# Port, amin a szerver fut
EXPOSE 6769

# Konténer indítási parancs
CMD ["node", "server.js"]
