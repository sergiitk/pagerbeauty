# Deploying PagerBeauty to Heroku

## Requisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install).
2. [Git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

## Create Heroku App
### Using Heroku CLI

```sh
# Log into heroku
heroku login

# Clone PagerBeauty repo
git clone https://github.com/sergiitk/pagerbeauty.git
cd pagerbeauty

# Switch to latest stable build
git checkout production

# Crate new application
heroku create

# Enable fast deploys
heroku config:set NPM_CONFIG_PRODUCTION=true YARN_PRODUCTION=true

# Configure PagerBeauty
# PagerDuty REST API v2 Access Key, for example: y_NbAkKc66ryYTWUXYEu
heroku config:set PAGERBEAUTY_PD_API_KEY=y_NbAkKc66ryYTWUXYEu
# Comma-separated list of PagerDuty schedule ids, for example: PJ1P5JQ,P538IZH
heroku config:set PAGERBEAUTY_PD_SCHEDULES=PJ1P5JQ,P538IZH
# Optional: see all optional settins here: https://github.com/sergiitk/pagerbeauty#configuration

# Deploy!
git push heroku production:master

# Open your new app
heroku open
```

[Deploying with Git](https://devcenter.heroku.com/articles/git) on Heroku Devcenter
