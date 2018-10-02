# Pager Beauty

Add concise PagerDuty on-calls widget to your wallboard

## Running
### In docker

```sh
docker run --rm -p 8080:8080 --env-file=.env -it sergiitk/pagerbeauty
```

.env file:
```
PAGERBEAUTY_PD_API_KEY=yourkey
PAGERBEAUTY_PD_SCHEDULES=SCHEDL1,SCHEDL2
# Optional
# PAGERBEAUTY_PD_API_URL=http://127.0.0.1:8000
```
