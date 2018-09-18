// ------- Imports -------------------------------------------------------------

import dotenv from 'dotenv';

// ------- Internal imports ----------------------------------------------------

import { PagerDutyClient } from './src/services/PagerDutyClient';
import { SchedulesService } from './src/services/SchedulesService';
import { PagerBeautyWebApp } from './src/app/PagerBeautyWebApp';

// ------- Program -------------------------------------------------------------

dotenv.config();

const pd = new PagerDutyClient(process.env.PD_API_KEY);
const sss = new SchedulesService(pd);


sss.load(process.env.PDS_CHEDULES.split(',')).then(res => console.log(res)).catch(e => console.log(e));

// const webApp = new PagerBeautyWebApp();
// webApp.start();

// ------- End -----------------------------------------------------------------
