import winston from 'winston';
import fs from 'fs-extra';
import path from 'path';

const logDir = 'reports/logs';
fs.ensureDirSync(logDir);

export const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
            )
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'execution.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5
        })
    ]
});
