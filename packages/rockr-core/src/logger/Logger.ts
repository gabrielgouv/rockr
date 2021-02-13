import * as winston from 'winston'

const { combine, timestamp, label, colorize, printf  } = winston.format;

const format = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'rockr-logger' }),
        timestamp(),
        colorize(),
        format
    ),
    transports: [
        new winston.transports.Console()
    ],
});