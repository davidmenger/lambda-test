'use strict';

const LambdaTest = require('./lib/LambdaTest');
const HandlerTester = require('./lib/HandlerTester');

/**
 * Create test and checks for status code
 *
 * when first parameter is API path, response is checked against api blueprint
 *
 * @param {Function} handler - function to test
 * @param {number} [statusCode] - expected status code
 * @param {string} [httpMethod] - http method to use
 * @returns {HandlerTester}
 */
function test (handler, statusCode, httpMethod) {
    const t = new LambdaTest();

    return t.test(handler, statusCode, httpMethod);
}

module.exports = test;

module.exports.LambdaTest = LambdaTest;
module.exports.HandlerTester = HandlerTester;
