FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Configurar npm para usar legacy peer deps
RUN npm config set legacy-peer-deps true
RUN npm install --production

COPY . .

EXPOSE 3001

CMD ["npm", "start"] 