/*#__PURE__*/
let errorsOnly = true;
/*#__PURE__*/
let logDebug = true;

export function setLogErrorsOnly(value: boolean) {
  errorsOnly = value;
}
export function setLogDebug(value: boolean) {
  logDebug = value;
}
/*#__PURE__*/
export function error(message: string, ...args: any[]) {
  if (errorsOnly) {
    console.error(message, ...args);
  }
}
/*#__PURE__*/
export function log(message: string, ...args: any[]) {
  if (logDebug) {
    console.log(message, ...args);
  }
}
/*#__PURE__*/
export function warn(message: string, ...args: any[]) {
  if (errorsOnly) {
    console.warn(message, ...args);
  }
}
/*#__PURE__*/
export function info(message: string, ...args: any[]) {
  if (logDebug) {
    console.info(message, ...args);
  }
}

export default new (class {
  error = error;
  log = log;
  warn = warn;
  info = info;
  setLogErrorsOnly = setLogErrorsOnly;
  setLogDebug = setLogDebug;
})();
