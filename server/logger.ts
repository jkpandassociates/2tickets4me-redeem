import * as winston from 'winston';
import 'winston-daily-rotate-file';

// const transport = new winston.transports.DailyRotateFile({
//     filename: './log',
//     datePattern: 'yyyy-MM-dd.',
//     prepend: true,
//     level: process.env.ENV === 'development' ? 'debug' : 'info',
//     maxDays: 10
// });

export const logger = new (winston.Logger)({
    exitOnError: false
});

logger.add(winston.transports.DailyRotateFile, {
    filename: './log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info',
    maxDays: 10
});
