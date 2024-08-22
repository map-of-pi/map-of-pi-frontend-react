import { createLogger, format, transports } from "winston";
import { SentryTransport } from "./sentry.client.config.mjs";

// define the logging configuration logic
export const getLoggerConfig = () => {
  let logLevel = '';
  let logFormat;
  const loggerTransports = [];

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'sandbox') {
    logLevel = 'info';
    logFormat = format.combine(format.colorize(), format.simple());
    loggerTransports.push(new transports.Console({ format: logFormat }));
  } else if (process.env.NODE_ENV === 'production') {
    logLevel = 'error';
    logFormat = format.combine(format.timestamp(), format.json());
    loggerTransports.push(new SentryTransport());
  } 

  return { level: logLevel, format: logFormat, transports: loggerTransports };
};

// Create the logger using the configuration
const loggerConfig = getLoggerConfig();

// set up Winston logger accordingly
const logger = createLogger({
  level: loggerConfig.level,
  format: loggerConfig.format,
  transports: loggerConfig.transports
});

export default logger;
