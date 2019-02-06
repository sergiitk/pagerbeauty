# Pager Beauty [![CircleCI](https://circleci.com/gh/sergiitk/pagerbeauty/tree/master.svg?style=shield)](https://circleci.com/gh/sergiitk/pagerbeauty/tree/master) [![dependencies Status](https://david-dm.org/sergiitk/pagerbeauty/status.svg)](https://david-dm.org/sergiitk/pagerbeauty)

Add concise PagerDuty on-call widget to your monitoring dashboard.
[Live Demo!](https://demo.pagerbeauty.sergii.org/)

### Who's on-call?
![PagerDuty On Call](https://user-images.githubusercontent.com/672669/52192981-d63b9300-281a-11e9-8d51-d0982c205b78.png)

<details>
  <summary><strong>Active PagerDuty Incident</strong></summary>
  <img width="939" alt="Active PagerDuty Incident" src="https://user-images.githubusercontent.com/672669/52192943-95dc1500-281a-11e9-976f-094eed7e2126.png">
</details>

<details>
  <summary><strong>PagerBeauty on Real Datadog Dashboard</strong></summary>
  <img alt="PagerBeauty on Real Datadog Dashboard" src="https://user-images.githubusercontent.com/672669/52193081-5104ae00-281b-11e9-9b4b-3bd16d1b7029.jpg">
</details>

## Running on Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sergiitk/pagerbeauty)

The easiest way give PagerBeauty a run is one-click deployment using Heroku Button.  
Refer to advanced [PagerBeauty on Heroku documentation](https://github.com/sergiitk/pagerbeauty/tree/master/docs/heroku.md)
for manual deployments using Heroku CLI and keeping PagerBeauty up-to-date.

## Running with Docker
Docker repo: [`sergiitk/pagerbeauty`](https://hub.docker.com/r/sergiitk/pagerbeauty)

You can run PagerBeauty [locally](http://localhost:8080) on your infrastructure using [Docker](https://www.docker.com/get-started).  
Create `.env` file as instructed in [configuration](#configuration) and run:
```sh
docker run --rm -p 8080:8080 --env-file=.env -it sergiitk/pagerbeauty:latest
```

Or set individual environment variables as needed:
```sh
docker run --rm -p 8080:8080 -e PAGERBEAUTY_PD_API_KEY=yourkey -e PAGERBEAUTY_PD_SCHEDULES=SCHEDL1,SCHEDL2 -it sergiitk/pagerbeauty:latest
```

Example running PagerBeauty using test key:
```sh
docker run --rm -p 8080:8080 -e PAGERBEAUTY_PD_API_KEY=y_NbAkKc66ryYTWUXYEu -e PAGERBEAUTY_PD_SCHEDULES=PJ1P5JQ,P538IZH -it sergiitk/pagerbeauty:latest
```

## Running with Node
NPM repo: [`pagerbeauty`](https://www.npmjs.com/package/pagerbeauty)

Setup PagerBeauty by following [configuration](#configuration) section and run:
```sh
yarn add pagerbeauty
node --experimental-modules node_modules/pagerbeauty/src/pagerbeauty.mjs
```

## Configuration

Configure PagerBeauty with `.env` file or by exporting environment variables:

```sh
# For Docker compatibility, do not placed quotation marks around the values.
# https://docs.docker.com/compose/env-file/

# PagerDuty REST API v2 Access Key (Read-only)
# Docs: https://support.pagerduty.com/docs/using-the-api
PAGERBEAUTY_PD_API_KEY=yourkey

# Comma-separated list of PagerDuty schedule ids
# You can find schedule id in the URL of the schedule on PagerDuty website after symbol #
# For example, schedule https://example.pagerduty.com/schedules#PJ1P5JQ has id PJ1P5JQ
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

## Adding to Datadog dashboard

![Add PagerDuty to Datadog dashboard](https://user-images.githubusercontent.com/672669/46853316-ad0a7900-cdcb-11e8-80b3-ddedb7c8f2eb.gif)

1. Open the schedules list in PagerBeauty. Make sure the app is running behind HTTPS
2. Find the schedule you want to embed, copy its URL
3. Open your Datadog dashboard, click "Edit Board".
4. Drag "IFrame" widget to the board
5. Paste copied PagerBeauty schedule URL to IFrame URL on Datadog board
6. Resize and save!

## Add to Grafana dashboard

![Add PagerDuty to Grafana dashboard](https://user-images.githubusercontent.com/672669/52322269-75d95c80-29a6-11e9-9432-e3b420c13de1.gif)


1. Install [AJAX](https://grafana.com/plugins/ryantxu-ajax-panel) plugin:  
   `grafana-cli plugins install ryantxu-ajax-panel`
2. Restart Grafana Server
3. Open the schedules list in PagerBeauty
4. Find the schedule you want to embed, open it, copy its URL
5. Open your Grafana dashboard, click "Add Panel"
6. Select `AJAX` panel
7. Click `Panel title` -> `Edit`
8. On `Request` tab, fill out:  
   `URL`: paste copied PagerBeauty schedule URL  
   `Method`: `iframe`  
   `Parameters`: `{ theme: "grafana" }`
9. On `General` tab, set your panel title and check `Transparent`
10. Close panel edit, resize and save!

## FAQ
### How it works?
PagerBeauty acts as a local cache server for PagerDuty schedules.
It fetches and refreshes PagerDuty schedules in the background using secret PagerDuty API key and makes them available through web interface. This is done to protect your secret API key from public exposure. This means you'll need to run PagerBeauty as a service.

### How to add my userpic?
PagerDuty uses [Gravatar](https://en.gravatar.com/) to manage profile photos. 
If you already have a Gravatar account, you can attach your PagerDuty login email to this account.

## Contributing
[Contribution guide](https://github.com/sergiitk/pagerbeauty/tree/master/CONTRIBUTING.md) and step-by-step local development instructions.  
The source code of [Pager Beauty](https://github.com/sergiitk/pagerbeauty) is maintained by [@sergiitk](https://github.com/sergiitk).
It's an Open Source project under MIT License. Contributions are welcomed. Follow the usual GitHub Pull Request process. [Be nice.](https://github.com/sergiitk/pagerbeauty/tree/master/CODE_OF_CONDUCT.md)

## Roadmap
This project is under active development.

#### Version 1.0

- [x] Load and process on-calls
- [x] JSON response
- [x] HTML response
- [x] HTML responsive layout
- [x] Basic autorefresh
- [x] MVP: Embed in Datadog dashboard as an iframe
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
- [x] HTTP authentication bypass support for embeds

#### Version 2.0

- [ ] Built-in SSL Support
- [ ] Next on duty
- [ ] Websocket refresh

#### Documentation and examples

- [x] Live demo on Heroku
- [x] Example: Heroku
- [ ] Example: Custom SSL certificate using Docker
- [ ] Example: Digital Ocean

## Sponsors and Supporters

| [<img src="https://github.com/sergiitk/pagerbeauty/raw/master/.github/images/sponsors-jw-logo.svg?sanitize=true" height="70">](https://www.jwplayer.com/) |
|:---:|
| [<sub><b>JW Player</b></sub>](https://www.jwplayer.com/) |

## Questions?
Ask me on Twitter: [@sergiitk](https://twitter.com/sergiitk)

## License

Pager Beauty is released under the [MIT License](https://opensource.org/licenses/MIT).
