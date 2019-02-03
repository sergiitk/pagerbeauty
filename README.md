# Pager Beauty [![CircleCI](https://circleci.com/gh/sergiitk/pagerbeauty/tree/master.svg?style=shield)](https://circleci.com/gh/sergiitk/pagerbeauty/tree/master) [![dependencies Status](https://david-dm.org/sergiitk/pagerbeauty/status.svg)](https://david-dm.org/sergiitk/pagerbeauty) [![devDependencies Status](https://david-dm.org/sergiitk/pagerbeauty/dev-status.svg)](https://david-dm.org/sergiitk/pagerbeauty?type=dev)

Add concise PagerDuty on-calls widget to your dashboard

![PagerDuty On Call](https://user-images.githubusercontent.com/672669/46779296-1e233100-cce5-11e8-897c-b60f935e3ca8.png)

## Running
### Using Docker
Docker repo: [`sergiitk/pagerbeauty`](https://hub.docker.com/r/sergiitk/pagerbeauty)

```sh
docker run --rm -p 8080:8080 --env-file=.env -it sergiitk/pagerbeauty:latest
```

### Configuration

Configure PagerBeauty with `.env` file or by exporting environment variables:

```sh
# For Docker compatibility, do not placed quotation marks around the values.
# https://docs.docker.com/compose/env-file/

# PagerDuty REST API v2 Access Key
# Read-only access is sufficient
# Docs: https://support.pagerduty.com/docs/using-the-api
PAGERBEAUTY_PD_API_KEY=yourkey

# Comma-separated list of PagerDuty schedule ids
PAGERBEAUTY_PD_SCHEDULES=SCHEDL1,SCHEDL2

# (Optional) How often to refresh the schedules, in minutes.
# Default: 10.
# PAGERBEAUTY_REFRESH_RATE_MINUTES=10

# (Optional) Disable polling for active incidents.
# Default: false
# PAGERBEAUTY_INCIDENTS_DISABLE=true

# (Optional) How often to refresh active incidents, in minutes.
# Default: 1
# PAGERBEAUTY_INCIDENTS_REFRESH_RATE_MINUTES=5

# (Optional) Highest logging level to include into application logs.
# One of: error, warn, info, verbose, debug, silly
# Default: info
# PAGERBEAUTY_LOG_LEVEL=verbose

# (Optional) Log format. One of:
# machine - Machine-readable JSON format
# human   - Human-readable colorized format
# Default: resolved to `human` for development and `machine` for production.
# PAGERBEAUTY_LOG_FORMAT=machine

# (Optional) The port for HTTP server to listen on.
# Default: 8080
# PAGERBEAUTY_HTTP_PORT=80

# (Optional) Enable basic HTTP authentication
# Default: disabled
# PAGERBEAUTY_HTTP_USER=basic_username
# PAGERBEAUTY_HTTP_PASSWORD=basic_password

# (Optional) Enable authentication access token (RFC6750)
# Note: embedding iframes that link to a page with basic HTTP name/password
# authentication is not supported by most modern browsers. To bypass it, you
# can set random access_token and append it to schedule URL. For example, if you can't embed schedule
# https://pb.example.com/v1/schedules/P538IZH.html, you can append your access token like so:
# https://pb.example.com/v1/schedules/P538IZH.html?acccess_token=your_token
# This link is embeddable now. Please use HTTPS.
# Default: disabled
# PAGERBEAUTY_HTTP_ACCESS_TOKEN=your_token
```

## Add to DataDog dashboard

![Add PagerDuty to DataDog dashboard](https://user-images.githubusercontent.com/672669/46853316-ad0a7900-cdcb-11e8-80b3-ddedb7c8f2eb.gif)

1. Open the schedules list in deployed app. Make sure the app is running behind HTTPS
2. Find the schedule you want to embed
3. Open your DataDog dashboard, click "Edit Board".
4. Drag "IFrame" widget to the board
5. Copy PagerBeauty URL of your schedule and paste to IFrame URL on DataDog board

## Roadmap

This project is under active development.

#### Version 1.0

- [x] Load and process on-calls
- [x] JSON response
- [x] HTML response
- [x] HTML responsive layout
- [x] Basic autorefresh
- [x] MVP: Embed in DataDog dashboard as an iframe
- [x] Show dates in local time
- [x] Configurable refresh period
- [x] HTTP Basic Authentication
- [x] On-call TimeZone is loaded from the PagerDuty schedule settings
- [x] Application logging
- [x] Ajax refresh
- [x] Automated Testing
- [x] Automated Builds
- [x] No limit on the total number of schedules supported
- [x] Make on-call view red during an active incident

#### Version 2.0

- [ ] Next on duty
- [ ] HTTP authentication bypass support for embeds
- [ ] Websocket refresh

#### Documentation and examples

- [ ] Live demo on Heroku
- [ ] Example: Heroku
- [ ] Example: Custom SSL certificate using Docker
- [ ] Example: Digital Ocean

## Sponsors and Supporters

| [<img src="https://github.com/sergiitk/pagerbeauty/raw/master/.github/images/sponsors-jw-logo.svg?sanitize=true" height="70">](https://www.jwplayer.com/) |
|:---:|
| [<sub><b>JW Player</b></sub>](https://www.jwplayer.com/) |

## Contributing

[Contribution guide](CONTRIBUTING.md) and step-by-step local development instructions.

The source code of [Pager Beauty](https://github.com/sergiitk/pagerbeauty) is maintained by [@sergiitk](https://github.com/sergiitk).
It's an Open Source project under MIT License. Contributions are welcomed. Follow the usual GitHub Pull Request process.

[Be nice.](CODE_OF_CONDUCT.md)

#### Questions?
Ask me on Twitter: [@sergiitk](https://twitter.com/sergiitk)


## License

Pager Beauty is released under the [MIT License](https://opensource.org/licenses/MIT).
