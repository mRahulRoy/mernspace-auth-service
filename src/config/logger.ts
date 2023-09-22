import winston from 'winston';
import { Config } from '.';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        serviceName: 'auth-service',
    },
    transports: [
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
            level: 'info',
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            silent: Config.NODE_ENV === 'test',
        }),
    ],
});

export default logger;
