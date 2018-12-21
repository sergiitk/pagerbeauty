// ------- PagerBeautyUiError ----------------------------------------------------

export class PagerBeautyUiError extends Error {
  /**
   * PagerBeauty frontend errors.
   */
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}


// ------- Application Errors --------------------------------------------------

/**
 * Fetch request returned 404
 */
export class PagerBeautyHttpNotFoundError extends PagerBeautyUiError {}

// ------- End -----------------------------------------------------------------
