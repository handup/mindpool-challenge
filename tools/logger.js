var chalk = require('chalk');
var logSymbols = require('log-symbols');
var format = require('date-fns/format');

module.exports = function logger(type, message) {
    var error = chalk.bold.red;
    var success = chalk.bold.green;
    var time = format(new Date(), 'M/D h:mm:ss') + ': ';

    /*eslint-disable no-console */
    switch (type) {
        case 'error':
            console.log(time, logSymbols.error, error(message));
            return;
        case 'success':
            console.log(time, logSymbols.success, success(message));
            return;
        default:
            console.log(time, logSymbols.info, message);
            return;
    }
    /*eslint-enable no-console */
};
