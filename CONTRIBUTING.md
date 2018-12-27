# Contributing

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
It's using [Mockserver](https://github.com/namshi/mockserver) in place of real PagerBeaty API v2.

HTTP server and webpack are running in watch mode.
All changes you make should be picked up automatically on the next page refres.

### Additional configuration

Use `.env` to override the [default settings](https://github.com/sergiitk/pagerbeauty#configuration),
for example:

**Verbose logging**
```sh
PAGERBEAUTY_LOG_LEVEL=verbose
```

**Fast schedule refreshes**
```sh
# (Optional) Highest logging level to include into application logs.
# One of: error, warn, info, verbose, debug, silly
# Default: info
PAGERBEAUTY_LOG_LEVEL=verbose
```

**Using real PagerDuty API**
```sh
# Use real API
PAGERBEAUTY_PD_API_URL=https://api.pagerduty.com
PAGERBEAUTY_PD_API_KEY=real_key
```

Note, this will not break local acceptance tests. It shouldn't be a problem for development.

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
