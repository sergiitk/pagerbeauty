// ------- Imports -------------------------------------------------------------

import dotenv from 'dotenv';

// ------- Internal imports ----------------------------------------------------

import { EXIT_CODES } from './errors';
import { PagerBeautyApp } from './app/PagerBeautyApp';
import { setupDefaultLogger } from './init';

// ------- Program -------------------------------------------------------------

dotenv.config();

// Human-readable logs by default.
let logFormat = 'human';
// Machine-readable logs on production.
if (process.env.NODE_ENV === 'production') {
  logFormat = 'machine';
}
// Or, force the override
if (process.env.PAGERBEAUTY_LOG_FORMAT) {
  logFormat = process.env.PAGERBEAUTY_LOG_FORMAT;
}

const logger = setupDefaultLogger({
  level: process.env.PAGERBEAUTY_LOG_LEVEL,
  logFormat,
});

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
    incidents: {
      enabled: !process.env.PAGERBEAUTY_INCIDENTS_DISABLE,
      refreshRate: process.env.PAGERBEAUTY_INCIDENTS_REFRESH_RATE_MINUTES || 1,
    },
  },
  env: process.env.NODE_ENV || 'development',
  version: process.env.npm_package_version || '0.0.0-dev',
  web: {
    port: process.env.PAGERBEAUTY_HTTP_PORT,
    auth: {
      name: process.env.PAGERBEAUTY_HTTP_USER,
      pass: process.env.PAGERBEAUTY_HTTP_PASSWORD,
    },
  },
};


const pagerBeautyApp = new PagerBeautyApp(config);
pagerBeautyApp.start();

// ------- End -----------------------------------------------------------------
