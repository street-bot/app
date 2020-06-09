
export interface LogOptions {
  LogLevel: string
}

export interface ILogger {
  Trace(msg: any): void
  Debug(msg: any): void
  Info(msg: any): void
  Warn(msg: any): void
  Error(msg: any): void
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
  logLevel: string;
  context: string;

  constructor(context?: string, options?: LogOptions){
    const level = options ? options.LogLevel : "INFO";  // Default INFO log level if no options specified
    this.logLevel = level in logLevels ? level : "INFO"; // Default INFO log level if invalid log level
    this.context = context ? ` - ${context}` : "";  // Format the logger context or nothing
  }

  public Trace(msg: any) {
    if (logLevels[this.logLevel] <= logLevels['TRACE']) {
      console.log(`%cTRACE${this.context} : %c${msg}`, 'color:gray', 'color:black');
    }
  }

  public Debug(msg: any) {
    if (logLevels[this.logLevel] <= logLevels['DEBUG']) {
      console.log(`%cDEBUG${this.context}: %c${msg}`, 'color:black', 'color:black');
    }
  }

  public Info(msg: any) {
    if (logLevels[this.logLevel] <= logLevels['INFO']) {
      console.log(`%cINFO${this.context}: %c${msg}`, 'color:black', 'color:black');
    }
  }

  public Warn(msg: any) {
    if (logLevels[this.logLevel] <= logLevels['WARN']) {
      console.log(`%cWARN${this.context}: %c${msg}`, 'color:orange', 'color:black');
    }
  }

  public Error(msg: any) {
    if (logLevels[this.logLevel] <= logLevels['ERROR']) {
      console.log(`%cERROR:${this.context}: %c${msg}`, 'color:red', 'color:black');
    }
  }


}