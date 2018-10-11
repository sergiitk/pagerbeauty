# Pager Beauty [![dependencies Status](https://david-dm.org/sergii-tkachenko/pagerbeauty/status.svg)](https://david-dm.org/sergii-tkachenko/pagerbeauty) [![devDependencies Status](https://david-dm.org/sergii-tkachenko/pagerbeauty/dev-status.svg)](https://david-dm.org/sergii-tkachenko/pagerbeauty?type=dev)

Add concise PagerDuty on-calls widget to your wallboard

## Running
### Using Docker

```sh
docker run --rm -p 8080:8080 --env-file=.env -it sergiitk/pagerbeauty:latest
```

### Configuration

Configure PagerBeauty with `.env` file or by exporting environment variables:

```sh
# PagerDuty API Key
PAGERBEAUTY_PD_API_KEY="yourkey"
# A list of schedule ids to load. Comma-separated and no spaces between.
PAGERBEAUTY_PD_SCHEDULES="SCHEDL1,SCHEDL2"

# Enable basic http authentication
PAGERBEAUTY_HTTP_USER="basic_username"
PAGERBEAUTY_HTTP_PASSWORD="basic_password"
```
