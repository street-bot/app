
export interface LogOptions {
  LogLevel: string
}

export interface ILogger {
  Trace(msg: string): void
  Debug(msg: string): void
  Info(msg: string): void
  Warn(msg: string): void
  Error(msg: string): void
}

interface stringNumberMap {
  [key: string]: number,
}

const logLevels: stringNumberMap = { 
  "TRACE": 10, 
  "DEBUG": 20,
  "INFO": 30,
  "WARN": 40, 
  "ERROR": 50 
}

export class Logger {
  logLevel: string
  constructor(options?: LogOptions){
    const level = options ? options.LogLevel : "INFO";  // Default INFO log level if no options specified
    this.logLevel = level in logLevels ? level: "INFO"; // Default INFO log level if invalid log level
  }

  public Trace(msg: string) {
    if (logLevels[this.logLevel] <= logLevels['TRACE']) {
      console.log(`%c${this.logLevel}: %c${msg}`, 'color:gray', 'color:black');
    }
  }

  public Debug(msg: string) {
    if (logLevels[this.logLevel] <= logLevels['DEBUG']) {
      console.log(`%c${this.logLevel}: %c${msg}`, 'color:black', 'color:black');
    }
  }

  public Info(msg: string) {
    if (logLevels[this.logLevel] <= logLevels['INFO']) {
      console.log(`%c${this.logLevel}: %c${msg}`, 'color:black', 'color:black');
    }
  }

  public Warn(msg: string) {
    if (logLevels[this.logLevel] <= logLevels['WARN']) {
      console.log(`%c${this.logLevel}: %c${msg}`, 'color:orange', 'color:black');
    }
  }

  public Error(msg: string) {
    if (logLevels[this.logLevel] <= logLevels['ERROR']) {
      console.log(`%c${this.logLevel}: %c${msg}`, 'color:red', 'color:black');
    }
  }


}