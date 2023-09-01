FROM node:18.12.1

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci
COPY src/ .
CMD ["node", "app.js"]
