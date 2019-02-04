# PagerBeauty on Heroku

## Requisites

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
2. [Git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)

## Deploying with Git

General documentation on Git deploys is available on [Heroku Dev Center](https://devcenter.heroku.com/articles/git).

```sh
# Log into Heroku
heroku login

# Clone PagerBeauty repository and change directory to it
git clone https://github.com/sergiitk/pagerbeauty.git
cd pagerbeauty

# Switch to the latest stable build
git checkout production

# Create new application
heroku create

# Minimal configuration

# PagerDuty REST API v2 Access Key (Read-only)
# Generate your key https://support.pagerduty.com/docs/using-the-api
# or try test key y_NbAkKc66ryYTWUXYEu
heroku config:set PAGERBEAUTY_PD_API_KEY=y_NbAkKc66ryYTWUXYEu

# Comma-separated list of PagerDuty schedule ids.
# You can find schedule id in the URL of the schedule on PagerDuty website after symbol #
# For example, schedule https://example.pagerduty.com/schedules#PJ1P5JQ has id PJ1P5JQ
# Or try test schedules: PJ1P5JQ,P538IZH
heroku config:set PAGERBEAUTY_PD_SCHEDULES=PJ1P5JQ,P538IZH

# Using `heroku config:set`, you can configure any PagerBeauty option from this list:
# https://github.com/sergiitk/pagerbeauty#configuration

# Deploy!
git push heroku production:master

# Open your new app
heroku open
```

#### Updating App Deployed with Git
```sh
# Clone pagerbeauty repository if you don't have it
git clone https://github.com/sergiitk/pagerbeauty.git

# Change directory to pagerbeauty
cd pagerbeauty

# Switch to the latest stable build
git checkout production
git pull

# Deploy!
git push heroku production:master
```

## Deploying with Heroku Button
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sergiitk/pagerbeauty)

#### Updating App Deployed with Heroku Button
Currently the only way to update Heroku app deployed with Heroku Button is
through Heroku CLI and Git.

```sh
# Log into heroku
heroku login

# Clone pagerbeauty repository if you don't have it
git clone https://github.com/sergiitk/pagerbeauty.git

# Change directory to pagerbeauty
cd pagerbeauty

# Switch to the latest stable build
git checkout production
git pull

# Find the name of PagerBeauty app on Heroku
heroku apps

# Register it in git
heroku git:remote -a my-pagerbeauty-app

# Deploy!
git push heroku production:master

# Open your app
heroku open
```
