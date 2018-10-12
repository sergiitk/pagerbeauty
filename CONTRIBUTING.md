# Contributing

## Rules

The source code of [Pager Beauty](https://github.com/sergii-tkachenko/pagerbeauty) is maintained by [@sergii-tkachenko](https://github.com/sergii-tkachenko).
It's an Open Source project under MIT Licence. Contributions are welcomed. Follow the usual GitHub Pull Request process.

[Be nice.](CODE_OF_CONDUCT.md)

## Requisites
- Install [Docker](https://docs.docker.com/install/)

## Running local services

1. Clone the repository
2. Create `.env` file with the following:

```sh
# Test key and schedules
PAGERBEAUTY_PD_API_KEY=y_NbAkKc66ryYTWUXYEu
PAGERBEAUTY_PD_SCHEDULES=P538IZH,PJ1P5JQ,PY2L7QI

# In addition, you can override API url to mock server responses manually
# PAGERBEAUTY_PD_API_URL=http://127.0.0.1:8000
```

3. Build an run local Docker container

```sh
docker-compose up
```

4. Open [localhost:8080](http://localhost:8080)

## Questions?
Ask me on Twitter: [@sergiitk](https://twitter.com/sergiitk)
