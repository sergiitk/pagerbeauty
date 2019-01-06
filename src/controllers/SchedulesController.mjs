// ------- Class ---------------------------------------------------------------

export class SchedulesController {
  constructor(app) {
    // Bind web methods to object context so they can be passed to router.
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.db = app.db;
  }

  async index(ctx, format = 'html') {
    const schedules = this.db.get('schedules').serialize();
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
    const schedule = this.db.get('oncalls').onCallRepo.get(scheduleId);

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
