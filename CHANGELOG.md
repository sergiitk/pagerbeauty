# PagerBeauty Changelog

## [1.0.1](https://github.com/sergiitk/pagerbeauty/compare/v1.0.0...v1.0.1) (2019-03-14)


### Cleanup

- [98](https://github.com/sergiitk/pagerbeauty/pull/98) **chore-dependencies** More dependency upgrades
- [96](https://github.com/sergiitk/pagerbeauty/pull/96) **chore-dependencies** Use esm instead of experimental modules
- [95](https://github.com/sergiitk/pagerbeauty/pull/95) **docker** Reduce docker image size by cleaning yarn cache

### Security

- [94](https://github.com/sergiitk/pagerbeauty/pull/94) **CVE-2019-5737** Upgrade node in Docker to 10.15.3 and refresh npm dependencies

# [1.0.0](https://github.com/sergiitk/pagerbeauty/compare/v0.3.0...v1.0.0) (2019-02-07)


### Bug Fixes

- [79](https://github.com/sergiitk/pagerbeauty/pull/79) **core** Fix error handling on unknown schedules
- [80](https://github.com/sergiitk/pagerbeauty/pull/80) **ui-oncalls** Handle one user in the rotation (no end date)

### Cleanup

- [75](https://github.com/sergiitk/pagerbeauty/pull/75) **chore-dependencies** Dependencies upgrade
- [64](https://github.com/sergiitk/pagerbeauty/pull/64) **chore-dependencies** Dependencies upgrade
- [83](https://github.com/sergiitk/pagerbeauty/pull/83) **chore-dependencies** Dependencies upgrade
- [87](https://github.com/sergiitk/pagerbeauty/pull/87) **circleci** Move test key from secrets to allow exogenous PRs
- [70](https://github.com/sergiitk/pagerbeauty/pull/70) **core** Load Schedules separately from OnCalls
- [69](https://github.com/sergiitk/pagerbeauty/pull/69) **core** Move schedule loading out of web controller
- [65](https://github.com/sergiitk/pagerbeauty/pull/65) **misc-local-dev** Acceptance tests in Docker
- [62](https://github.com/sergiitk/pagerbeauty/pull/62) **misc-release** Automated Docker image builds with basic sanity checks
- [71](https://github.com/sergiitk/pagerbeauty/pull/71) **misc-release** Improve Semantic Release
- [66](https://github.com/sergiitk/pagerbeauty/pull/66) **misc-release** Run acceptance tests in CircleCI
- [68](https://github.com/sergiitk/pagerbeauty/pull/68) **tests** Better test reports
- [67](https://github.com/sergiitk/pagerbeauty/pull/67) **tests** Setup unit test tools and refactor acceptance tests

### Documentation

- [78](https://github.com/sergiitk/pagerbeauty/pull/78) **deploy** Document deploying PagerBeauty to Heroku
- [90](https://github.com/sergiitk/pagerbeauty/pull/90) **readme** Add PagerBeauty on Grafana Dashboard screenshot
- [86](https://github.com/sergiitk/pagerbeauty/pull/86) **readme** Fix minor typo
- [89](https://github.com/sergiitk/pagerbeauty/pull/89) **readme** Update Adding to Datadog dashboard gif
- [85](https://github.com/sergiitk/pagerbeauty/pull/85) **readme** Update caps on Datadog

### Features

- [73](https://github.com/sergiitk/pagerbeauty/pull/73) **core-incidents** Poll for active incidents
- [72](https://github.com/sergiitk/pagerbeauty/pull/72) **core-oncalls** Removes implicit limit on how many on-calls can be loaded
- [77](https://github.com/sergiitk/pagerbeauty/pull/77) **core-web** HTTP server can be started on custom port
- [82](https://github.com/sergiitk/pagerbeauty/pull/82) **core-web** Support for Authentication Bearer access_token
- [88](https://github.com/sergiitk/pagerbeauty/pull/88) **grafana** Support Grafana
- [74](https://github.com/sergiitk/pagerbeauty/pull/74) **ui-oncalls** On-call active incident view: show incident info and make red

# [0.3.0](https://github.com/sergiitk/pagerbeauty/compare/v0.2.0...v0.3.0) (2018-12-22)


### Cleanup

- [60](https://github.com/sergiitk/pagerbeauty/pull/60) **ui** Lint UI assets

### Features

- [59](https://github.com/sergiitk/pagerbeauty/pull/59) **ui** Add status indicator to on-call
- [58](https://github.com/sergiitk/pagerbeauty/pull/58) **ui** Replace hard page refresh with AJAX Long Polling

# [0.2.0](https://github.com/sergiitk/pagerbeauty/compare/v0.1.1...v0.2.0) (2018-12-21)


### Features

- [54](https://github.com/sergiitk/pagerbeauty/pull/54) **core** Application logging

## [0.1.1](https://github.com/sergiitk/pagerbeauty/compare/v0.1.0...v0.1.1) (2018-12-19)


### Bug Fixes

- [52](https://github.com/sergiitk/pagerbeauty/pull/52) **assets** Fix bundle.css link not using production assets path
- [51](https://github.com/sergiitk/pagerbeauty/pull/51) **docker** Docker should use production assets and ignore dev

# [0.1.0](https://github.com/sergiitk/pagerbeauty/compare/v0.0.12...v0.1.0) (2018-12-19)


### Cleanup

- [48](https://github.com/sergiitk/pagerbeauty/pull/48) **chore-dependencies** Dependencies upgrade #38

### Documentation

- [47](https://github.com/sergiitk/pagerbeauty/pull/47) **readme** Add dockerhub link, update roadmap
- [49](https://github.com/sergiitk/pagerbeauty/pull/49) **readme** Wallboard -> dashboard

### Features

- [39](https://github.com/sergiitk/pagerbeauty/pull/39) **ui-schedules** Major UI refactoring: modernize assets pipeline and move rendering to React

## [0.0.12](https://github.com/sergiitk/pagerbeauty/compare/v0.0.11...v0.0.12) (2018-12-17)


### Documentation

- [43](https://github.com/sergiitk/pagerbeauty/pull/43) **readme** Add sponsors section to README.md

### Security

- [44](https://github.com/sergiitk/pagerbeauty/pull/44) **CVE-2018-12120** Upgrade node in Docker to 10.14.2 and refresh npm dependencies

## [0.0.11](https://github.com/sergiitk/pagerbeauty/compare/v0.0.10...v0.0.11) (2018-11-04)


### Bug Fixes

- [40](https://github.com/sergiitk/pagerbeauty/pull/40) **core-schedules** Fix uncontrollable refresh

### Cleanup

- [38](https://github.com/sergiitk/pagerbeauty/pull/38) **chore-dependencies** Dependencies upgrade

## [0.0.10](https://github.com/sergiitk/pagerbeauty/compare/v0.0.9...v0.0.10) (2018-10-20)


### Bug Fixes

- [36](https://github.com/sergiitk/pagerbeauty/pull/36) **misc-release** Update CHANGELOG.md on builds

## [0.0.9](https://github.com/sergiitk/pagerbeauty/compare/v0.0.8...v0.0.9) (2018-10-20)


### Bug Fixes

- [33](https://github.com/sergiitk/pagerbeauty/pull/33) **misc-release** Various fixes to automated builds

## [0.0.8](https://github.com/sergiitk/pagerbeauty/compare/v0.0.7...v0.0.8) (2018-10-20)


### Bug Fixes

- [29](https://github.com/sergiitk/pagerbeauty/pull/29) **core-schedules** Fixes schedules not being refreshed after first request error
- [30](https://github.com/sergiitk/pagerbeauty/pull/30) **ui-schedules** Display "No one on call" to ensure 404 doesn't break widget autorefresh
