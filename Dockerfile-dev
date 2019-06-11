# https://hub.docker.com/_/node/
FROM node:10.16.0-alpine
ARG VCS_REF=not_ci
LABEL org.label-schema.description="PagerDuty on-call dashboard widget" \
      org.label-schema.name="PagerBeauty" \
      org.label-schema.schema-version="1.0" \
      org.label-schema.url="https://work.sergii.org/pagerbeauty" \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://github.com/sergiitk/pagerbeauty" \
      org.label-schema.vendor="Sergii Tkachenko <hi@sergii.org>"

# Environment
ENV APP_DIR=/usr/src/app

# Create app directory
WORKDIR $APP_DIR

# Install
COPY package.json yarn.lock $APP_DIR/
RUN yarn install --prod --frozen-lockfile \
  && yarn cache clean

# Pagerbeauty default port
EXPOSE 8080

# ---------- Dev image from here
# NPM config and dev environment
RUN  npm config set scripts-prepend-node-path true \
  && mkdir -v $APP_DIR/tmp

# Install the rest
RUN yarn install --frozen-lockfile

# Pagerbeauty with HTTP auth
EXPOSE 8081

# Acceptance test mock server
EXPOSE 8090

# Bundle app source
COPY . .

CMD ["yarn", "run", "app"]
