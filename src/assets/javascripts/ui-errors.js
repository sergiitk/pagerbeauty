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
 * Generic fetch error
 */
export class PagerBeautyFetchUiError extends PagerBeautyUiError {
  constructor(statusCode, statusText) {
    super(`${statusCode} ${statusText}`);
    this.name = this.constructor.name;
  }
}

/**
 * Fetch request returned 404
 */
export class PagerBeautyFetchNotFoundUiError extends PagerBeautyFetchUiError {}

// ------- End -----------------------------------------------------------------
