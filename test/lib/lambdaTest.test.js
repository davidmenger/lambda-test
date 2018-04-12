/*
 * @author David Menger
 */
'use strict';

const assert = require('assert');
const LambdaTest = require('../../lib/LambdaTest');

describe('<LambdaTest>', function () {

    it('should verify the request against blueprint', async () => {
        const lt = new LambdaTest('./apiBlueprint.apib');

        const handler = (event, context, callback) => (
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    username: 'mtakac',
                    email: 'marek.takac@pragonauts.com'
                })
            })
        );

        const res = await lt.test(handler, '/users/{id}', 'GET', 200)
            .verify();

        const { body, statusCode } = res;

        assert.strictEqual(body.username, 'mtakac');
        assert.strictEqual(statusCode, 200);
    });

    it('should fail, when response doesnt match', async () => {
        const lt = new LambdaTest('./apiBlueprint.apib');

        const handler = (event, context, callback) => (
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    foo: 'bar'
                })
            })
        );

        let thrown = null;

        try {
            await lt.test(handler, '/users/{id}', 'GET', 200)
                .verify();
        } catch (e) {
            thrown = e;
        }

        assert.ok(thrown instanceof Error);
    });

});
