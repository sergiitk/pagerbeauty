// ------- Imports -------------------------------------------------------------

import dotenv from 'dotenv';

// ------- Internal imports ----------------------------------------------------

import { EXIT_CODES } from './errors';
import { PagerBeautyWebApp } from './app/PagerBeautyWebApp';
import { setupDefaultLogger } from './init';

// ------- Program -------------------------------------------------------------

dotenv.config();
const logger = setupDefaultLogger();

// From environment
if (!process.env.PAGERBEAUTY_PD_API_KEY) {
  logger.error('Pager Duty API key is required');
  process.exit(EXIT_CODES.get('insufficient_config'));
}

if (!process.env.PAGERBEAUTY_PD_SCHEDULES) {
  logger.error('Pager Duty schedules list is required');
  process.exit(EXIT_CODES.get('insufficient_config'));
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
  env: process.env.NODE_ENV || 'development',
  version: process.env.npm_package_version || '0.0.0-dev',
};


const webApp = new PagerBeautyWebApp(config);
webApp.start();

// ------- End -----------------------------------------------------------------
