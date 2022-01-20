/* eslint-disable prefer-spread */
import winston, { createLogger, format } from 'winston';
import moment from 'moment';
import chalk from 'chalk';
import path from 'path';

const config = {
  shouldUseSimpleOutput: false,
  shouldTruncateLongSql: false,
  shouldCombineMultipleLines: false,
  shouldOutputToFile: false, // process.env.NODE_ENV === 'production',
};

const chalkNone = str => str;
const chalkTitle = config.shouldUseSimpleOutput ? chalkNone : chalk.cyanBright;
const newLineReplacement = '  >>';
const newLinePrefix = config.shouldCombineMultipleLines ? `${newLineReplacement}  ` : '\n  ';

const getWinstonArguments = (options) => {
  const fullMessage = [];
  let messageText;

  if (typeof options === 'string') {
    messageText = options;
    // eslint-disable-next-line no-param-reassign
    options = {};
  } else if (options.message) {
    messageText = options.message;
    // eslint-disable-next-line no-param-reassign
    delete options.message;
  }

  if (options.request) { // express request object
    fullMessage.push(`${chalkTitle(`API Request ${options.request.loggingCounter}`)}: ${options.request.method} ${options.request.originalUrl}`);
    // eslint-disable-next-line no-param-reassign
    delete options.request;
  }

  if (messageText) {
    fullMessage.push(messageText);
  }

  if (options.error) { // caught error
    fullMessage.push(`${chalkTitle('Error')}: ${options.error.message}`);

    let stackTrace = options.error.stack;
    if (stackTrace && config.shouldCombineMultipleLines) {
      stackTrace = stackTrace.replace(/\n/g, newLineReplacement);
    }
    fullMessage.push(`${chalkTitle('Stack trace')}: ${stackTrace}`);
    // eslint-disable-next-line no-param-reassign
    delete options.error;
  }

  if (options.sql) {
    // limit the logged sql to 1000 length on prod
    let sql = config.shouldTruncateLongSql ? options.sql.substring(0, 1050) : options.sql;
    const regexResult = sql.match(/^Executing \(([^)]+)\):/);
    const transaction = (regexResult && regexResult.length > 1 && regexResult[1]) || 'default';
    sql = sql.replace(/^Executing \([^)]+\): /, '');

    if (config.shouldCombineMultipleLines) {
      sql = sql.replace(/\n/g, newLineReplacement);
    }

    if (transaction === 'default') { // no transaction
      fullMessage.push(`${chalkTitle('SQL')}: ${sql}`);
    } else {
      fullMessage.push(`${chalkTitle('SQL')}: Txn (${transaction}) ${sql}`);
    }
    // eslint-disable-next-line no-param-reassign
    delete options.sql;
  }

  // in local dev, add an empty line at the end to make reading easier
  if (!config.shouldUseSimpleOutput) {
    fullMessage.push('');
  }

  return [fullMessage.join(newLinePrefix), options];
};

const Transport = config.shouldOutputToFile ? winston.transports.File : winston.transports.Console;

const transportOptions = {
  json: false, // so error object makes it to the formatter function
  level: 'info',
  timestamp: () => moment().format('Y-MM-DD HH:mm:ss:SSS'),
};

if (config.shouldOutputToFile) {
  transportOptions.filename = path.join(__dirname, '../../logs', `${moment().week()} - ${moment().format('YYYY')}.log`);
}

const wLogger = createLogger({
  transports: [
    new (Transport)(transportOptions),
  ],
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(info => `${info.timestamp} ${info.level.toLowerCase()}: ${info.message}${info.splat !== undefined ? `${info.splat}` : ' '}`),
  ),
});

export default {
  info: options => wLogger.info.apply(wLogger, getWinstonArguments(options)),
  warn: options => wLogger.warn.apply(wLogger, getWinstonArguments(options)),
  error: options => wLogger.error.apply(wLogger, getWinstonArguments(options)),
};
