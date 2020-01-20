import { Logger, transports } from 'winston';
import path from 'path';
import config from '../configs/index';

// #region helpers

const logstashFormatter = (options) => JSON.stringify({
    '@timestamp': new Date().toISOString(),
    '@version': 1,
    application: 'mindpool-web',
    channel: config.env,
    host: config.server.host,
    message: options.message || '',
    level: options.level.toUpperCase(),
    ...extractExtraDataFromMeta(options.meta || {})
}, (key, value) => value instanceof Buffer ? value.toString('base64') : value);

const extractExtraDataFromMeta = meta => Object.entries(meta).reduce((acc, [key, value]) => ({
    ...acc,
    [`ctxt_${key}`]: value
}), {});

// #endregion

const logger = new Logger();

if (config.logging) {
    logger.add(transports.File, {
        filename: path.join(process.cwd(), `log`, `logstash-${config.env}.log`),
        formatter: logstashFormatter,
        json: false
    });
}

logger.add(transports.Console, {
    colorize: true,
    handleExceptions: true,
    prettyPrint: true
});

export default logger;
