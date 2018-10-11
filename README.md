# Pager Beauty [![CircleCI](https://circleci.com/gh/sergii-tkachenko/pagerbeauty/tree/master.svg?style=svg)](https://circleci.com/gh/sergii-tkachenko/pagerbeauty/tree/master) [![dependencies Status](https://david-dm.org/sergii-tkachenko/pagerbeauty/status.svg)](https://david-dm.org/sergii-tkachenko/pagerbeauty) [![devDependencies Status](https://david-dm.org/sergii-tkachenko/pagerbeauty/dev-status.svg)](https://david-dm.org/sergii-tkachenko/pagerbeauty?type=dev)

Add concise PagerDuty on-calls widget to your wallboard

![PagerDuty On Call](https://user-images.githubusercontent.com/672669/46779296-1e233100-cce5-11e8-897c-b60f935e3ca8.png)

## Running
### Using Docker

```sh
docker run --rm -p 8080:8080 --env-file=.env -it sergiitk/pagerbeauty:latest
```

### Configuration

Configure PagerBeauty with `.env` file or by exporting environment variables:

```sh
# For Docker compatibility, do not quote the values.
# https://docs.docker.com/compose/env-file/

# PagerDuty API key
PAGERBEAUTY_PD_API_KEY=yourkey

# A list of schedule ids to load. Comma-separated and no spaces between.
PAGERBEAUTY_PD_SCHEDULES=SCHEDL1,SCHEDL2
# Optional: How often to refresh schedules list, in minutes. Defaults to 10.
PAGERBEAUTY_REFRESH_RATE_MINUTES=10

# Optional: Enable basic http authentication
PAGERBEAUTY_HTTP_USER=basic_username
PAGERBEAUTY_HTTP_PASSWORD=basic_password

# Optional: Local time zone, defaults to server timezone
# https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
TZ=America/New_York
```

## Roadmap

This project is under active development.

- [x] Load and process oncalls
- [x] JSON response
- [x] HTML response
- [x] HTML responsive layout
- [x] Basic autorefresh
- [x] MVP: Embed in DataDog dashboard as an iframe
- [x] Show dates in local time
- [x] Configurable refresh period
- [x] HTTP Basic Authentication
- [ ] Full README.md and examples
- [ ] Unit testing
- [ ] Load all API pages
- [ ] Ajax refresh
- [ ] Change color to red when an incident is triggered
- [ ] Functional testing
- [ ] Automated builds
- [ ] Next on duty
- [ ] Websocket refresh
