// ------- Imports -------------------------------------------------------------

import logger from 'winston';

// ------- Internal imports ----------------------------------------------------

import { PagerBeautyInitError } from '../errors';
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
    this.loadSchedulesSemaphore = true;
  }

  async start(app) {
    // Todo: move to it's own app thing
    const pagerDutyConfig = app.config.pagerDuty;
    const pagerDutyClient = new PagerDutyClient(
      pagerDutyConfig.apiKey,
      pagerDutyConfig.apiURL,
    );
    this.schedulesService = new SchedulesService(pagerDutyClient);

    const schedules = pagerDutyConfig.schedules.list;
    await this.loadSchedules(schedules);

    // Set refresh.
    const refreshRateMinutes = Number(pagerDutyConfig.schedules.refreshRate);
    if (Number.isNaN(refreshRateMinutes)) {
      throw new PagerBeautyInitError('Refresh rate is not a number');
    }

    const refreshRateMS = refreshRateMinutes * 60 * 1000;
    this.intervalId = setInterval(() => {
      logger.verbose(`Timer-initiated schedule refresh (every ${refreshRateMinutes}m)`);
      this.loadSchedules(schedules);
    }, refreshRateMS);
  }

  stop() {
    clearInterval(this.intervalId);
  }

  async loadSchedules(pdSchedules) {
    if (!this.loadSchedulesSemaphore) {
      logger.warn(
        'Attempting schedule refresh while the previous request is '
        + 'still running. This should not normally happen. Try decreasing '
        + 'schedule refresh rate',
      );
      return false;
    }

    this.loadSchedulesSemaphore = false;
    let result = false;
    try {
      await this.schedulesService.load(pdSchedules);
      result = true;
    } catch (e) {
      // Do nothing
    }
    this.loadSchedulesSemaphore = true;

    return result;
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

    switch (format) {
      case 'json':
        if (!schedule) {
          // Only error out in json repsonses.
          ctx.status = 404;
        } else {
          ctx.body = schedule.serialize();
        }
        break;
      case 'html':
        // HTML will handle it for now
        await ctx.render('schedules/show.html', { schedule });
        break;
      default:
        break;
    }
  }
}

// ------- End -----------------------------------------------------------------
