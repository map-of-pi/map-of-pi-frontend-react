import log from 'loglevel';
import { logToSentry } from './sentry.client.config.mjs';

export const configureLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production: Log only errors and send them to Sentry
    log.setLevel('error');

    const originalErrorMethod = log.error;
    log.error = (...args) => {
      originalErrorMethod(...args);  // Log the error to the console
      logToSentry(args.join(' '));  // Send the error to Sentry
    };

  } else if (process.env.NODE_ENV === 'development') {
    // Development: Log at the info level to the console
    log.setLevel('info');
  }
};

// Initialize the logger configuration
configureLogger();

export default log;
