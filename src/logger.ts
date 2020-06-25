import { createLogger, format, transports } from "winston";

const { timestamp, combine, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const Logger = createLogger({
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "activity.log" }),
  ],
});

export default Logger;
