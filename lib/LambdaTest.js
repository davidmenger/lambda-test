/*
 * @author David Menger
 */
'use strict';

const path = require('path');
const ApiBlueprint = require('./ApiBlueprint');
const blueprintLoader = require('./loadApiBlueprint');
const HandlerTester = require('./HandlerTester');

class LambdaTest {

    /**
     *
     * @constructor
     * @param {string} [blueprintFile] - api blueprint
     */
    constructor (blueprintFile = null) {
        this._blueprintFile = blueprintFile;
        this._api = null;
    }

    /**
     * @returns {ApiBlueprint}
     */
    _getBlueprint () {
        if (this._api) {
            return this._api;
        }

        let filename = this._blueprintFile;

        if (!filename) {
            throw new Error('To test against API blueprint, you must define blueprintFile');
        } else if (filename.indexOf(path.sep) !== 0) {
            filename = path.resolve(process.cwd(), filename);
        }

        const actions = blueprintLoader(filename);
        this._api = new ApiBlueprint(actions);

        return this._api;
    }

    /**
     * Create test and checks for status code
     *
     * when first parameter is API path, response is checked against api blueprint
     *
     * @param {Function} handler - function to test
     * @param {number|string} [routeOrStatus] - route path for blueprint or status code
     * @param {string} [httpMethod] - http method to use
     * @param {number|null} [statusCode=null] - expected status code
     * @returns {HandlerTester}
     */
    test (handler, routeOrStatus = 200, httpMethod = null, statusCode = null) {
        if (typeof routeOrStatus === 'number' || routeOrStatus === null) {
            return new HandlerTester(handler, routeOrStatus, httpMethod);
        }
        const api = this._getBlueprint();
        return new HandlerTester(handler, statusCode, httpMethod, routeOrStatus, api);
    }

}

module.exports = LambdaTest;
