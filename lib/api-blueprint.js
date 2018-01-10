'use strict';

const { validate } = require('jsonschema');

class ApiBlueprint {

    constructor (actions = []) {
        this.actions = actions;
    }

    /**
     * Returns action
     *
     * @param {string} endpoint
     * @param {string} [method='GET']
     * @returns {{body:Object,schema:Object}}
     * @throws {Error} when not found
     *
     * @memberOf ApiBlueprint
     */
    action (endpoint, method = 'GET') {
        const action = this.actions
            .find(a => (a.method === method
                && (a.uri === endpoint || a.resourceUri === endpoint)));

        if (!action) {
            throw new Error(`Action ${method}: ${endpoint} not found`);
        }

        return action;
    }

    /**
     * Returns request example
     *
     * @param {string} endpoint
     * @param {string} [method='GET']
     * @returns {{body:Object,schema:Object}}
     * @throws {Error} when not found
     *
     * @memberOf ApiBlueprint
     */
    request (endpoint, method = 'GET') {
        return this.action(endpoint, method).request;
    }

    /**
     * Returns response example
     *
     * @param {string} endpoint
     * @param {string} [method='GET']
     * @param {number|string} [code=200]
     * @returns {{body:Object,schema:Object}}
     * @throws {Error} when not found
     *
     * @memberOf ApiBlueprint
     */
    response (endpoint, method = 'GET', code = 200) {
        const action = this.action(endpoint, method);

        const strCode = `${code}`;

        if (typeof action.responses[strCode] !== 'object') {
            throw new Error(`Response ${strCode} not found in  ${method}: ${endpoint}`);
        }

        return action.responses[strCode];
    }

    /**
     * Returns response example
     *
     * @param {any} response - input data
     * @param {string} endpoint
     * @param {string} [method='GET']
     * @param {number|string} [code=200]
     * @returns {{body:Object,schema:Object}}
     * @throws {Error} validation error
     *
     * @memberOf ApiBlueprint
     */
    responseMatches (response, endpoint, method = 'GET', code = 200) {
        const res = this.response(endpoint, method, code);
        const validationResult = validate(response, res.schema);

        if (validationResult.errors.length) {
            const validationError = new Error(`Response ${code} does not match schema ${method}: ${endpoint}`);
            validationError.errors = validationResult.errors;
            validationError.actual = response;
            throw validationError;
        }

        return validationResult;
    }

}

module.exports = ApiBlueprint;
