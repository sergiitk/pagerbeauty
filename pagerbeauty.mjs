// ------- Imports -------------------------------------------------------------

import dotenv from 'dotenv';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyWebApp } from './src/app/PagerBeautyWebApp';

// ------- Program -------------------------------------------------------------

dotenv.config();

// From environment
if (!process.env.PAGERBEAUTY_PD_API_KEY) {
  throw 'Pager Duty API key is required';
}

if (!process.env.PAGERBEAUTY_PD_SCHEDULES) {
  throw 'Pager Duty schedules list is required';
}

const config = {
  pdApiKey: process.env.PAGERBEAUTY_PD_API_KEY,
  pdApiURL: process.env.PAGERBEAUTY_PD_API_URL || false,
  pdSchedules: process.env.PAGERBEAUTY_PD_SCHEDULES.split(','),
}

const webApp = new PagerBeautyWebApp(config);
webApp.start();

// ------- End -----------------------------------------------------------------
