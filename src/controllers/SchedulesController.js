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
    const oncall = this.db.get('oncalls').onCallRepo.get(scheduleId);
    let theme = false;
    if (ctx.request.query.theme === 'grafana') {
      theme = 'grafana';
    }

    switch (format) {
      case 'json':
        if (!oncall) {
          // Only error out in json repsonses.
          ctx.status = 404;
        } else {
          ctx.body = oncall.serialize();
        }
        break;
      case 'html':
        // HTML will handle it for now
        await ctx.render('oncalls/show.html', { oncall, theme });
        break;
      default:
        break;
    }
  }
}

// ------- End -----------------------------------------------------------------
