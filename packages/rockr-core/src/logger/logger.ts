import * as winston from 'winston'

const { combine, timestamp, label, colorize, printf  } = winston.format;

const format = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    vm: 3
};

const colors = {
    vm: 'red'
}

winston.addColors(colors)

export const logger = winston.createLogger({
    levels: levels,
    level: 'vm',
    format: combine(
        label({ label: 'rockr' }),
        timestamp(),
        colorize(),
        format
    ),
    transports: [
        new winston.transports.Console()
    ],
});
