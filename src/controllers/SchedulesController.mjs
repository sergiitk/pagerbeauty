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

  async init(app) {
    const pagerDutyClient = new PagerDutyClient(app.config.pdApiKey, app.config.pdApiURL);
    this.schedulesService = new SchedulesService(pagerDutyClient);

    await this.schedulesService.load(app.config.pdSchedules);
  }

  async index(ctx, format = 'html') {
    const schedules = this.schedulesService.serialize();
    switch (format) {
      case 'json':
        ctx.body = schedules;
        break;
      case 'html':
        await ctx.render('schedules/index.html', { schedules });
        break;
      default:
        break;
    }
  }

  async show(ctx, scheduleId, format = 'html') {
    const schedule = this.schedulesService.onCallRepo.get(scheduleId);
    if (!schedule) {
      ctx.status = 404;
      return;
    }

    switch (format) {
      case 'json':
        ctx.body = schedule.serialize();
        break;
      case 'html':
        await ctx.render('schedules/show.html', { schedule });
        break;
      default:
        break;
    }
  }
}

// ------- End -----------------------------------------------------------------
