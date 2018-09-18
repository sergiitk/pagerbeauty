// ------- Imports -------------------------------------------------------------

// ------- Internal imports ----------------------------------------------------

// ------- Class ---------------------------------------------------------------

export class SchedulesController {
  constructor() {
    // Bind web methods to object context so they can be passed to router.
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
  }

  async index(ctx) {
    ctx.body = {
      test: 'index',
    };
  }

  async show(ctx) {
    ctx.body = {
      test: `show ${ctx.params.scheduleId}`,
    };
  }
}

// ------- End -----------------------------------------------------------------
