// ------- Imports -------------------------------------------------------------

// ------- Internal imports ----------------------------------------------------

import { PagerDutyClient } from '../services/PagerDutyClient';
import { SchedulesService } from '../services/SchedulesService';

// ------- Class ---------------------------------------------------------------

export class SchedulesController {
  constructor() {
    // Bind web methods to object context so they can be passed to router.
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.schedulesService = false;
  }

  async init() {
    const pagerDutyClient = new PagerDutyClient(process.env.PD_API_KEY, process.env.PD_API_URL);
    this.schedulesService = new SchedulesService(pagerDutyClient);

    await this.schedulesService.load(process.env.PDS_CHEDULES.split(','));
  }

  async index(ctx, format='html') {
    switch(format) {
      case 'json':
        ctx.body = this.schedulesService.serialize();
        break;
      case 'html':
        ctx.body = 'in progress'
        break;
    }
  }

  async show(ctx, scheduleId, format='html') {
    const schedule = this.schedulesService.onCallRepo.get(scheduleId);
    if (!schedule) {
      ctx.status = 404;
      return;
    }

    switch(format) {
      case 'json':
        ctx.body = schedule.serialize();
        break;
      case 'html':
        ctx.body = 'in progress'
        break;
    }

  }
}

// ------- End -----------------------------------------------------------------
