'use strict';

class HandlerTester {

    /**
     *
     * @param {Function} handler
     * @param {number|null} [statusCode]
     * @param {string|null} [httpMethod]
     * @param {string|null} [route]
     * @param {ApiBlueprint|null} [api]
     */
    constructor (handler, statusCode = null, httpMethod = null, route = null, api = null) {
        this._handler = handler;
        this._api = api;
        this._httpMethod = httpMethod;
        this._route = route;
        this._statusCode = statusCode;

        this._headers = {};
        this._queryStringParameters = null;
        this._pathParameters = null;
        this._body = null;
    }

    /**
     * Sets query string
     *
     * @param {Object|null} query - the query string
     * @returns {this}
     */
    queryStringParameters (query = null) {
        if (query === null) {
            this._queryStringParameters = null;
            return this;
        } else if (this._queryStringParameters === null) {
            this._queryStringParameters = {};
        }
        Object.keys(query)
            .forEach((key) => {
                this._queryStringParameters[key] = encodeURIComponent(query[key]);
            });
        return this;
    }

    /**
     * Sets request body
     *
     * @param {Object|string} body - request body
     * @returns {this}
     */
    body (body = null) {
        if (typeof body === 'object' && body !== null) {
            this._body = JSON.stringify(body);
            Object.assign(this._headers, {
                'content-type': 'application/json; charset=utf-8'
            });
        } else {
            this._body = body;
        }
        return this;
    }

    /**
     * Set request headers
     *
     * @param {Object|null} headers
     * @returns {this}
     */
    headers (headers = null) {
        if (headers === null) {
            this._headers = {};
        } else {
            Object.assign(this._headers, headers);
        }
        return this;
    }

    /**
     *
     * @param {Object|null} params
     * @returns {this}
     */
    pathParameters (params = null) {
        if (params === null) {
            this._pathParameters = null;
            return this;
        } else if (this._pathParameters === null) {
            this._pathParameters = {};
        }
        Object.assign(this._pathParameters, params);
        return this;
    }

    _method () {
        if (this._httpMethod !== null) {
            return this._httpMethod;
        }
        return this._body ? 'POST' : 'GET';
    }

    /**
     * Send request
     *
     * @returns {Promise<Object>}
     */
    run () {
        return new Promise((resolve, reject) => {
            const event = {
                headers: this._headers,
                queryStringParameters: this._queryStringParameters,
                pathParameters: this._pathParameters,
                body: this._body ? JSON.stringify(this._body) : null,
                httpMethod: this._method()
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

    /**
     * Send request
     *
     * @returns {Promise<Object>}
     */
    verify () {
        return this.run()
            .then((res) => {
                if (this._statusCode !== null && res.statusCode !== this._statusCode) {
                    const e = new Error(res.body.error);
                    e.stack = res.body.stack;
                    throw e;
                }

                if (this._api === null) {
                    return res;
                }

                try {
                    this._api
                        .responseMatches(res.body, this._route, this._method(), this._statusCode);
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
}

module.exports = HandlerTester;
