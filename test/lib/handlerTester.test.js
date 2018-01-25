'use strict';

const { assert } = require('chai');

const HandlerTester = require('../../lib/handlerTester');

describe('HandlerTester', () => {
    let handler;
    let tester;

    beforeEach(() => {
        handler = () => (
            Promise.resolve()
                .then(() => 'Resolved')
                .catch(() => 'Cathed')
        );

        tester = new HandlerTester(handler);
    });

    describe('constructor', () => {
        it('should load api blueprint', () => {
            assert.isNotEmpty(tester._api.actions);
        });

        it('should set handler', () => {
            assert.isFunction(tester._handler);
        });

        it('should set default values for other properties', () => {
            assert.isObject(tester._headers);
            assert.isNull(tester._queryStringParameters);
            assert.isNull(tester._pathParameters);
            assert.isNull(tester._body);
        });
    });

    describe('queryStringParameters', () => {
        let result;

        beforeEach(() => {
            result = tester.queryStringParameters({ limit: 5, offset: 15 });
        });

        it('should set _queryStringParameters property', () => {
            const { limit, offset } = tester._queryStringParameters;

            assert.equal(limit, 5);
            assert.equal(offset, 15);
        });

        it('should return instance of HandlerTester', () => {
            assert.equal(result.constructor.name, 'HandlerTester');
        });
    });

    describe('body', () => {
        let result;

        beforeEach(() => {
            result = tester.body({ statusCode: 200, data: 'some data' });
        });

        it('should set _body property', () => {
            const { statusCode, data } = tester._body;

            assert.equal(statusCode, 200);
            assert.equal(data, 'some data');
        });

        it('should return instance of HandlerTester', () => {
            assert.equal(result.constructor.name, 'HandlerTester');
        });
    });

    describe('pathParameters', () => {
        let result;

        beforeEach(() => {
            result = tester.pathParameters({ path: 'param' });
        });

        it('should set _pathParameters property', () => {
            const { path } = tester._pathParameters;

            assert.equal(path, 'param');
        });

        it('should return instance of HandlerTester', () => {
            assert.equal(result.constructor.name, 'HandlerTester');
        });
    });

    describe('expect', () => {

    });
});
