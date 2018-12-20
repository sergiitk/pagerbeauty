/*
 * Common app functionality
 */

// ------- PagerBeautyError ----------------------------------------------------

export class PagerBeautyError extends Error {
  /**
   * PagerBeauty generic error constructor.
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}


// ------- Application Errors --------------------------------------------------

/**
 * Initializtion failed
 */
export class PagerBeautyInitError extends PagerBeautyError {}


export class PagerBeautyWebServerStartError extends PagerBeautyError {
  /**
   * Can't start web server.
   *
   * @param  {Error} message
   *   The message with the error that prevented server from starting
   * @param  {http.Server} server Failing web server
   */
  constructor(message, server) {
    super(message);
    this.server = server;
  }
}

// ------- End -----------------------------------------------------------------
