'use strict';

const ApiBlueprint = require('./api-blueprint');
const blueprintLoader = require('./api-blueprint-loader');

class HandlerTester {

    constructor (handler) {
        this._api = new ApiBlueprint(JSON.parse(blueprintLoader().code));
        this._handler = handler;
        this._headers = {};
        this._queryStringParameters = null;
        this._pathParameters = null;
        this._body = null;
    }

    queryStringParameters (query = {}) {
        this._queryStringParameters = query;
        return this;
    }

    body (body) {
        this._body = body;
        return this;
    }

    pathParameters (params = {}) {
        this._pathParameters = params;
        return this;
    }

    expect (route, httpMethod = 'GET', statusCode = 200) {
        return this.request(httpMethod)
            .then((res) => {
                if (res.statusCode !== statusCode) {
                    const e = new Error(res.body.error);
                    e.stack = res.body.stack;
                    throw e;
                }
                try {
                    this._api.responseMatches(res.body, route, httpMethod, statusCode);
                    return res;
                } catch (e) {
                    const messages = (e.errors || []).map(err => `  - ${err.stack}`).join('\n');
                    Object.assign(e, {
                        message: `${e.message}: \n${messages}`
                    });
                    throw e;
                }
            });
    }

    request (httpMethod = 'GET') {
        return new Promise((resolve, reject) => {
            const event = {
                headers: this._headers,
                queryStringParameters: this._queryStringParameters,
                pathParameters: this._pathParameters,
                body: this._body ? JSON.stringify(this._body) : null,
                httpMethod
            };
            const context = {};
            const callback = (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Object.assign(res, {
                        body: JSON.parse(res.body)
                    }));
                }
            };
            this._handler(event, context, callback);
        });
    }

    then (fn) {
        return this.request().then(fn);
    }
}

module.exports = function (handler) {
    return new HandlerTester(handler);
};
