'use strict';

const HandlerTester = require('./lib/handler-tester');

module.exports = {
    handlerTester: (handler) => {
        return new HandlerTester(handler);
    }
};
