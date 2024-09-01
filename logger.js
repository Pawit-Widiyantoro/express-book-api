const winston = require("winston");
const {combine, timestamp,  printf, colorize, align} = winston.format;
const dotenv = require("dotenv");

dotenv.config();

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
        colorize({all:true}),
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => {
            if (info.stack) {
                const stackLines = info.stack.split('\n');
                const truncatedStack = stackLines.slice(0, 5).join('\n');
                return `[${info.timestamp}] ${info.level}: ${info.message}\n${truncatedStack}`;
              }
            return `[${info.timestamp}] ${info.level}: ${info.message}`;
        })
      ),
      transports: [new winston.transports.Console()],
});

module.exports=logger;