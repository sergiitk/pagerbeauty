// ------- Imports -------------------------------------------------------------

import dotenv from 'dotenv';

// ------- Internal imports ----------------------------------------------------

import { PagerDutyClient } from './src/services/PagerDutyClient';
import { PagerBeautyWebApp } from './src/app/PagerBeautyWebApp';

// ------- Program -------------------------------------------------------------

dotenv.config();

const pd = new PagerDutyClient(process.env.PD_API_KEY);


pd.schedules(process.env.PDS_CHEDULES.split(',')).then(res => console.log(res)).catch(e => console.log(e));

// const webApp = new PagerBeautyWebApp();
// webApp.start();

// ------- End -----------------------------------------------------------------
