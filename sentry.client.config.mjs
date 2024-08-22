import * as Sentry from "@sentry/nextjs";
import { replayIntegration } from '@sentry/browser';
import { transports } from 'winston';

// initiailize Sentry only in production environment
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      integrations: [
        replayIntegration({
          maskAllText: true // enforce PII masking and privacy considerations
        })
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    });
  } catch (error) {
    throw new Error(`Failed connection to Sentry: ${error.message}`);
  }
}

// create a custom Sentry transport for Winston in production
class SentryTransport extends transports.Stream {
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    if (info.level === 'error') {
      Sentry.captureMessage(info.message, 'error');
    }
    callback();
    return true;
  }
}

export { SentryTransport };
