import log from 'loglevel';
import { logToSentry } from './sentry.client.config.mjs';

export const configureLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, we want to log only to Sentry
    log.setLevel('silent');

    log.error = (...args) => {
      logToSentry(args.join(' '));
    };

  } else if (process.env.NODE_ENV === 'development') {
    // In development, we want to log only to the console
    log.setLevel('info');
  }
};

// Initialize the logger configuration
configureLogger();

export default log;
