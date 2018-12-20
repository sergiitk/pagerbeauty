/*
 * Setup functions to be used during application init.
 */

// ------- Imports -------------------------------------------------------------

import winston from 'winston';

// ------- Init methods --------------------------------------------------------

/**
 * Configures the default logger.
 *
 * @return  The configured logger. To be used for logging during app init.
 */
export function setupDefaultLogger(env = 'development', level = 'verbose') {
  const format = env === 'production'
    ? winston.format.json()
    : winston.format.cli();

  winston.configure({
    level,
    format,
    transports: [
      new winston.transports.Console({}),
    ],
  });
  return winston;
}

// ------- End -----------------------------------------------------------------
