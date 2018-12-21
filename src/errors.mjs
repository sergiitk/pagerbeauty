/*
 * Common app functionality
 */

// ------- Exit error code -=---------------------------------------------------
export const EXIT_CODES = new Map([
  ['insufficient_config', 10],
]);

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


export class PagerBeautyHttpServerStartError extends PagerBeautyError {
  /**
   * Can't start HTTP server.
   *
   * @param  {Error} message
   *   The message with the error that prevented server from starting
   * @param  {http.Server} server Failing HTTP server
   */
  constructor(message, server) {
    super(message);
    this.server = server;
  }
}

// ------- End -----------------------------------------------------------------
