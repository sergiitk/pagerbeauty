// ------- Imports -------------------------------------------------------------

import dotenv from 'dotenv';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyWebApp } from './src/app/PagerBeautyWebApp';

// ------- Program -------------------------------------------------------------

dotenv.config();

// From environment
if (!process.env.PAGERBEAUTY_PD_API_KEY) {
  throw Error('Pager Duty API key is required');
}

if (!process.env.PAGERBEAUTY_PD_SCHEDULES) {
  throw Error('Pager Duty schedules list is required');
}

const config = {
  pagerDuty: {
    apiKey: process.env.PAGERBEAUTY_PD_API_KEY,
    apiURL: process.env.PAGERBEAUTY_PD_API_URL || false,
    schedules: {
      list: process.env.PAGERBEAUTY_PD_SCHEDULES.replace(/\s*/g, '').split(','),
      refreshRate: process.env.PAGERBEAUTY_REFRESH_RATE_MINUTES || 10,
    },
  },
  auth: {
    name: process.env.PAGERBEAUTY_HTTP_USER,
    pass: process.env.PAGERBEAUTY_HTTP_PASSWORD,
  },
};

const webApp = new PagerBeautyWebApp(config);
webApp.start();

// ------- End -----------------------------------------------------------------
