var log4js = require('log4js');
log4js.configure({
  "appenders": [
      {
          type: "console"
        , category: "console"
      },
      {
          "type": "file",
          "filename": "logs/test.log",
          "maxLogSize": 1024,
          "backups": 3,
          "category": "root"
      }
  ]
});
log = log4js.getLogger("root");
