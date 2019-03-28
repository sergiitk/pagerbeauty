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
export function setupDefaultLogger({ level = 'info', logFormat = 'human' }) {
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
    format: logFormat === 'machine' ? machineReadable : humanReadable,
    transports: [
      // Unix FTW.
      new winston.transports.Console({ eol: '\n' }),
    ],
  });
  winston.debug('Configured logger');
  return winston;
}

// ------- End -----------------------------------------------------------------
