import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const logger = new (winston.Logger)({
    exitOnError: false
});

logger.add(winston.transports.DailyRotateFile, {
    filename: path.join(__dirname, '..', '..', 'logs', 'log'),
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    maxDays: 10,
    createTree: true
});
