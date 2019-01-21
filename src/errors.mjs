/*
 * Common app functionality
 */

// ------- Exit error code -=---------------------------------------------------
export const EXIT_CODES = new Map([
  ['insufficient_config', 10],
]);

// ------- PagerBeautyError ----------------------------------------------------

/**
 * PagerBeauty generic error constructor.
 */
export class PagerBeautyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

// ------- Application Errors --------------------------------------------------

/**
 * Initializtion failed. Throw on fatal constructor errors.
 */
export class PagerBeautyInitError extends PagerBeautyError {}

/**
 * Initializtion failed due to incorrect config value.
 */
export class PagerBeautyConfigError extends PagerBeautyInitError {}

/**
 * Can't start HTTP server.
 */
export class PagerBeautyHttpServerStartError extends PagerBeautyError {
  /**
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
