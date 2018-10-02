# https://hub.docker.com/_/node/
FROM node:10.11.0-alpine

# Environment
ENV APP_DIR=/usr/src/app/

# Create app directory
WORKDIR $APP_DIR

# Install
COPY package.json yarn.lock $APP_DIR
RUN yarn install --prod --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "run", "app"]
