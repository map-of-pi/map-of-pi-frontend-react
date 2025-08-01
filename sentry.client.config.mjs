import * as Sentry from "@sentry/nextjs";
import { replayIntegration } from '@sentry/browser';

// initialize Sentry only in production environment
if (process.env.NODE_ENV === 'production') {
  try {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    });
  } catch (error) {
    throw new Error(`Failed connection to Sentry: ${error.message}`);
  }
}

export const logToSentry = (message) => {
  if (message instanceof Error) {
    Sentry.captureException(message);
  } else if (typeof message === 'string') {
    Sentry.captureException(new Error(message));
  } else {
    // Handle fallback for unknown cases like object arrays
    Sentry.captureException(new Error(JSON.stringify(message)));
  }
};