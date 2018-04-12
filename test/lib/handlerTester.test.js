'use strict';

const { assert } = require('chai');

const HandlerTester = require('../../lib/HandlerTester');

describe('HandlerTester', () => {
    let handler;
    let tester;

    beforeEach(() => {
        handler = (event, context, callback) => (
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    username: 'mtakac',
                    email: 'marek.takac@pragonauts.com'
                })
            })
        );

        tester = new HandlerTester(handler, 200);
    });

    describe('constructor', () => {

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

            assert.strictEqual(limit, '5');
            assert.strictEqual(offset, '15');
        });

        it('additional calls adds data', () => {
            tester.queryStringParameters({ added: 4 });

            const { limit, offset, added } = tester._queryStringParameters;

            assert.strictEqual(limit, '5');
            assert.strictEqual(offset, '15');
            assert.strictEqual(added, '4');
        });

        it('null resets property', () => {
            tester.queryStringParameters();

            assert.strictEqual(tester._queryStringParameters, null);
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
            const { statusCode, data } = JSON.parse(tester._body);

            assert.equal(statusCode, 200);
            assert.equal(data, 'some data');
        });

        it('null resets property', () => {
            tester.body();

            assert.strictEqual(tester._body, null);
        });

        it('string is set as string', () => {
            tester.body('hello');

            assert.strictEqual(tester._body, 'hello');
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

        it('null resets property', () => {
            tester.pathParameters();

            assert.strictEqual(tester._pathParameters, null);
        });

        it('should return instance of HandlerTester', () => {
            assert.equal(result.constructor.name, 'HandlerTester');
        });
    });

    describe('request', () => {

        it('verifies request', async () => {
            const res = await tester.verify();

            const { body, statusCode } = res;

            assert.strictEqual(body.username, 'mtakac');
            assert.strictEqual(statusCode, 200);
        });

    });
});
