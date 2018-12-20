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
  const { format } = winston;

  const humanReadable = format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'HH:mm:ss.SSS' }),
    format.align(),
    format.printf(data => `${data.timestamp} ${data.level}: ${data.message}`),
  );

  const machineReadable = format.combine(
    format.timestamp(),
    format.json(),
  );

  winston.configure({
    level,
    format: env === 'production' ? machineReadable : humanReadable,
    transports: [
      new winston.transports.Console({}),
    ],
  });
  winston.info('Configured logger');
  return winston;
}

// ------- End -----------------------------------------------------------------
