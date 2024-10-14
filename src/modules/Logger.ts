class Logger {
    // Get caller information: file, line, and column using source map
    private static getCallerInfo(): string {
      try {
        const err = new Error();
        const stack = err.stack?.split('\n');
        // We are interested in the 3rd line of the stack trace
        const callerLine = stack ? stack[3] : '';
        const regex = /\((.*):(\d+):(\d+)\)/;
        const match = callerLine.match(regex);
  
        if (match && match.length === 4) {
          const filePath = match[1].split('/').pop(); // Extract file name
          const line = match[2];                      // Extract line number
          const column = match[3];                    // Extract column number
          return `${filePath}:${line}:${column}`;
        }
      } catch (err) {
        console.error('Failed to get caller info:', err);
      }
  
      return 'unknown';
    }
  
    // Log a message, with support for objects and optional function name
    static log(message: string | object, functionName: string = 'unknown'): void {
      const callerInfo = this.getCallerInfo();
  
      if (typeof message === 'object' && message !== null) {
        console.log(`[LOG] (${functionName} @ ${callerInfo})`, message);
      } else {
        console.log(`[LOG] (${functionName} @ ${callerInfo}) ${message}`);
      }
    }
  
    // Log a warning
    static warn(message: string | object, functionName: string = 'unknown'): void {
      const callerInfo = this.getCallerInfo();
  
      if (typeof message === 'object' && message !== null) {
        console.warn(`[WARN] (${functionName} @ ${callerInfo})`, message);
      } else {
        console.warn(`[WARN] (${functionName} @ ${callerInfo}) ${message}`);
      }
    }
  
    // Log an error
    static error(message: string | object, functionName: string = 'unknown'): void {
      const callerInfo = this.getCallerInfo();
  
      if (typeof message === 'object' && message !== null) {
        console.error(`[ERROR] (${functionName} @ ${callerInfo})`, message);
      } else {
        console.error(`[ERROR] (${functionName} @ ${callerInfo}) ${message}`);
      }
    }
  }
  
  export default Logger;
  