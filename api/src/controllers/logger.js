const {createLogger, format,transports }= require('winston');

const logger = createLogger({
  level: 'info',
  format:format.combine(
    format.timestamp({format:"YYYY-MM-DD HH:mm:ss"}),
    format.json()
  ),
  transports:[
    new transports.File({
      filename:"src/logs/info.log",
      level:"info",
      maxSize:5242880,
      maxFile:5,
    })
  ]
  // transports: [new transports.Console({
  //   format:format.combine(format.colorize(),format.simple())
  // })],

});


module.exports = logger;