FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production

EXPOSE 6769

CMD ["node", "server.js"]
