const winston = require('winston');
const {timestamp, label, combine, printf, colorize}= winston.format;
const customFormat = printf(({level, message,label, timestamp})=>{
    return `${timestamp} [${label}] ${level}: ${message}`;
});



module.exports = function(moduleName){
    return logger = winston.createLogger({
        level:'debug',
        format: combine(
            label({ label: moduleName }),
            timestamp(),
            customFormat//,
           // colorize()
          ),
        //format:winston.format.json(),
        transports: [
            //
            // - Write all logs with level `error` and below to `error.log`
            // - Write all logs with level `info` and below to `combined.log`
            //
            new winston.transports.File({
                filename: 'logs/error.log',
                 level: 'error',

                  maxsize: 20971520, // 20 MB
                  maxFiles:5

                 }),
            new winston.transports.File({
                filename: 'logs/combined.log',

                 maxsize: 20971520, // 20 MB
                 maxFiles:5
                }),
          ]
    });
}