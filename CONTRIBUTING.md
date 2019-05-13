# Contributing

## Dev Statuses
[![CircleCI](https://circleci.com/gh/sergiitk/pagerbeauty/tree/master.svg?style=shield)](https://circleci.com/gh/sergiitk/pagerbeauty/tree/master) [![dependencies Status](https://david-dm.org/sergiitk/pagerbeauty/status.svg)](https://david-dm.org/sergiitk/pagerbeauty) [![devDependencies Status](https://david-dm.org/sergiitk/pagerbeauty/dev-status.svg)](https://david-dm.org/sergiitk/pagerbeauty?type=dev)

### Docker images
[![](https://images.microbadger.com/badges/version/sergiitk/pagerbeauty:dev.svg)](https://microbadger.com/images/sergiitk/pagerbeauty:dev) [![](https://images.microbadger.com/badges/image/sergiitk/pagerbeauty:dev.svg)](https://microbadger.com/images/sergiitk/pagerbeauty:dev)  
[![](https://images.microbadger.com/badges/version/sergiitk/pagerbeauty.svg)](https://microbadger.com/images/sergiitk/pagerbeauty) [![](https://images.microbadger.com/badges/image/sergiitk/pagerbeauty.svg)](https://microbadger.com/images/sergiitk/pagerbeauty)

## Rules

The source code of [Pager Beauty](https://github.com/sergiitk/pagerbeauty) is maintained by [@sergiitk](https://github.com/sergiitk).
It's an Open Source project under MIT License. Contributions are welcomed. Follow the usual GitHub Pull Request process.

[Be nice.](CODE_OF_CONDUCT.md)

## Running local services

### Requisites
- Install [Docker](https://docs.docker.com/install/)

### Running local services

1. Clone the repository
2. Build an run local Docker container

```sh
docker-compose up
```

3. Open [localhost:8080](http://localhost:8080)

PagerBeauty for local development is preconfigured, no `.env` file is necessary.  
It's using [Mockserver](https://github.com/namshi/mockserver) in place of real PagerDuty API v2: [localhost:8090](http://localhost:8090).

Application HTTP server and webpack are running in `watch` mode.
All changes you make should be picked up automatically on the next page refresh: [localhost:8080](http://localhost:8080).

Additional version of PagerBeauty with HTTP authentication enabled is available at [localhost:8081](http://localhost:8081). Default credentials:

```sh
PAGERBEAUTY_HTTP_USER=basic_username
PAGERBEAUTY_HTTP_PASSWORD=basic_password
PAGERBEAUTY_HTTP_ACCESS_TOKEN=803651A9-E3B7-4153-9566-6E54F5F0CEAB
```

#### Grafana
There's a test Grafana with pre-provisioned PagerBeauty board available
at <http://localhost:3000/d/RUn-WZumz/pagerbeauty>. Feel free to use for testing.  
Login and pasword are `admin`.

### Additional configuration

Use `.env` to override the [default settings](https://github.com/sergiitk/pagerbeauty#configuration),
for example:

**Verbose logging**

```sh
PAGERBEAUTY_LOG_LEVEL=verbose
```

**Custom HTTP ports**

In case you have another service running on port 8080, the following option
will start PagerBeauty on custom port and bind it to the same port on the host.

```sh
# Start PagerBeauty on port 8181 in Docker and bind it to port 8181 on the host:
# http://localhost:8181/
PAGERBEAUTY_HTTP_PORT=8181
```

In the same manner, you can choose custom port for `pagerbeauty-dev-with-auth` service:

```sh
# Start PagerBeauty with enabled HTTP authentication on port 8182
# in Docker and bind it to port 8181 on the host:
# http://localhost:8182/
PAGERBEAUTY_WITH_AUTH_HTTP_PORT=8182
```

To change PagerDuty Mock API port, you need to update the following
```sh
# Use custom port for PagerDuty Mock API:
PAGERBEAUTY_PD_API_MOCK_PORT=9090
# Instruct PagerBeauty use different PagerDuty API:
PAGERBEAUTY_PD_API_URL=http://mock-pagerduty-api:9090
```

You can configure grafana local port with:
```sh
PAGERBEAUTY_GRAFANA_PORT=3001
```

**Using real PagerDuty API**

```sh
# Use real API
PAGERBEAUTY_PD_API_URL=https://api.pagerduty.com
PAGERBEAUTY_PD_API_KEY=real_key
```

Note, using real PagerDuty API will break local acceptance tests. It shouldn't be a problem for a routine development.

### Other

#### Installing new packages

```sh
docker-compose run --rm yarn add --dev your_package
```

#### Running linter
We mostly adhere to [Airbnb JavaScript Style](https://github.com/airbnb/javascript), with [minor exceptions](https://github.com/sergiitk/pagerbeauty/blob/master/.eslintrc.js).

```sh
docker-compose run --rm yarn lint
```

#### Running tests
```sh
docker-compose run --rm yarn test:full
```

#### Running acceptance tests
```sh
docker-compose run --rm yarn test:acceptance
```

### Questions?
Ask me on Twitter: [@sergiitk](https://twitter.com/sergiitk)
