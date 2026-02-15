import winston from 'winston';
import fs from 'fs-extra';
import path from 'path';

const logDir = 'reports/logs';
fs.ensureDirSync(logDir);

const piiRedactor = winston.format((info) => {
    let message = info.message as string;

    // Email Masking
    message = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED EMAIL]');
    // Generic Credit Card (Simple check)
    message = message.replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED CC]');
    // US Phone
    message = message.replace(/\b(\+?1?[-.]?)?\(?[2-9]\d{2}\)?[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED PHONE]');

    info.message = message;
    return info;
});

export const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        piiRedactor(),
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
