# https://hub.docker.com/_/node/
FROM node:10.14.2-alpine

# Environment
ENV APP_DIR=/usr/src/app

# Create app directory
WORKDIR $APP_DIR

# Install
COPY package.json yarn.lock $APP_DIR/
RUN yarn install --prod --frozen-lockfile

# Pagerbeauty default port
EXPOSE 8080

# ---------- Prod image from here

# Bundle app source
COPY . .

CMD ["yarn", "-s", "run", "app:prod"]
