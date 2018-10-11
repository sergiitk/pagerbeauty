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
    this.intervalId = false;
    // Ten minutes
    this.refreshRate = 10 * 60 * 1000;
    this.skipLock = false;
  }

  async init(app) {
    // Todo: move to it's own app thing
    const pagerDutyClient = new PagerDutyClient(app.config.pdApiKey, app.config.pdApiURL);
    this.schedulesService = new SchedulesService(pagerDutyClient);

    await this.loadSchedules(app.config.pdSchedules);
    this.intervalId = setInterval(() => {
      this.loadSchedules(app.config.pdSchedules);
    }, this.refreshRate);
  }

  async loadSchedules(pdSchedules) {
    if (this.skipLock) {
      // @todo: log
      return false;
    }
    // console.log(`Loading ${pdSchedules}`)
    this.skipLock = true;
    await this.schedulesService.load(pdSchedules);
    this.skipLock = false;
    return true;
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
