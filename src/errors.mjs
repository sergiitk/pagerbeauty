/*
 * Common app functionality
 */

// ------- PagerBeautyError ----------------------------------------------------

export class PagerBeautyError extends Error {
  /**
   * Blink generic error constructor.
   *
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

// ------- End -----------------------------------------------------------------
