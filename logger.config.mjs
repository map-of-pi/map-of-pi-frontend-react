import log from 'loglevel';
import { logToSentry } from './sentry.client.config.mjs';

export const configureLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    log.setLevel('error');

    const originalErrorMethod = log.error;
    log.error = (...args) => {
      originalErrorMethod(...args);  // log the error to the console
      logToSentry(args.join(' '));  // send the error to Sentry
    };

  } else if (process.env.NODE_ENV === 'development') {
    log.setLevel('info');
  }
};

// Initialize the logger configuration
configureLogger();

export default log;
