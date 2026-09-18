FROM node:24-alpine

RUN apk add --no-cache su-exec

WORKDIR /home/container

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY entrypoint.sh /entrypoint.sh
COPY --chown=node:node . .
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
