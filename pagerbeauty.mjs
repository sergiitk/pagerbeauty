// ------- Imports -------------------------------------------------------------

import dotenv from 'dotenv';

// ------- Internal imports ----------------------------------------------------

import { PagerDutyService } from './src/services/PagerDutyService';
import { PagerBeautyWebApp } from './src/app/PagerBeautyWebApp';

// ------- Program -------------------------------------------------------------

dotenv.config();

const pd = new PagerDutyService();


console.log(pd);

// const webApp = new PagerBeautyWebApp();
// webApp.start();

// ------- End -----------------------------------------------------------------
