# njuskalo-crawler

## Env variables

You must create `.env` file and specify bellow env variables:

```bash
# Required
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=crawler@email.com
EMAIL_RECEIVERS=your.email@here.com
ERRORS_RECEIVER=your.email@here.com
ADS_FILE=./ads.json
NEW_ADS_FILE=./new_ads.json
# Moment compatible time string 
NOT_BEFORE_DATE_TIME=2019-08-18T00:00:00+01:00
# Host the new ads on this port
PORT=3000

# Optional, comma separated URLs with preselected query options from the relevant site 
NJUSKALO_URL=
PLAVI_URL=
INDEX_URL=
```

## Run

```bash
yarn install
yarn start
```
