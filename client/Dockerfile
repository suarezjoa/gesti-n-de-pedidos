FROM node:16-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

# Configurar npm para usar legacy peer deps
RUN npm config set legacy-peer-deps true
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Configuración de nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 