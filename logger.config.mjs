import log from 'loglevel';
import { logToSentry } from './sentry.client.config.mjs';

/**
 * Configures the global logger behavior based on the environment.
 * In production; logs are sent to Sentry.
 * In development; logs go to the browser/ console.
 */
export const configureLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    // Silence default console logging in production
    log.setLevel('silent');

    /**
     * Override log.error to send meaningful errors to Sentry in production.
     * If the first argument is an Error object, capture it directly.
     * Otherwise, join all arguments into a single string and log that.
     */
    log.error = (...args) => {
      // Look for the first argument that is an actual Error object
      const errorArg = args.find(arg => arg instanceof Error);
      if (errorArg) {
        // If an Error object is found, send it directly to Sentry
        // This ensures we preserve the stack trace and error metadata
        logToSentry(errorArg);
      } else {
        // Fallback and stringify all other args
        const combinedMessage = args
          .map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' ');

        logToSentry(combinedMessage);
      }
    };

  } else if (process.env.NODE_ENV === 'development') {
    // In development, we want to log only to the browser/ console
    log.setLevel('info');
  }
};

// Initialize the logger configuration
configureLogger();

export default log;