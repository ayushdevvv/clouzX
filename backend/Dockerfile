FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 600000 \
    && npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
