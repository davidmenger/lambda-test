'use strict';

const { assert } = require('chai');

const ApiBlueprint = require('../../lib/apiBlueprint');

describe('Api blueprint', () => {
    describe('constructor', () => {
        it('should set actions provided argument', () => {
            const actions = [{
                groupName: 'Test group name'
            }];

            const api = new ApiBlueprint(actions);

            assert.equal(api.actions[0].groupName, 'Test group name');
        });

        it('should set default actions to empty array if no arguments were provided', () => {
            const api = new ApiBlueprint();

            assert.isEmpty(api.actions);
        });
    });

    describe('action', () => {
        let actions;
        let api;

        beforeEach(() => {
            actions = [{
                testId: 1,
                method: 'GET',
                uri: '/users'
            }, {
                testId: 2,
                method: 'POST',
                resourceUri: '/users'
            }];

            api = new ApiBlueprint(actions);
        });

        it('should find action by it\'s URI', () => {
            const action = api.action('/users');

            assert.equal(action.testId, 1);
        });

        it('should find action by it\'s resource URI', () => {
            const action = api.action('/users', 'POST');

            assert.equal(action.testId, 2);
        });

        it('should throw and error if no action was found', () => {
            const err = assert.throws(() => api.action('/undefined'));

            assert.equal(err.message, 'Action GET: /undefined not found');
        });
    });

    describe('request', () => {
        let actions;
        let api;
        let request;

        beforeEach(() => {
            request = {
                body: {
                    title: 'My post title',
                    content: 'My post content'
                },
                name: 'Update post by id'
            };

            actions = [{
                method: 'POST',
                uri: '/users',
                request
            }];

            api = new ApiBlueprint(actions);
        });

        it('should return request property of action', () => {
            assert.equal(api.request('/users', 'POST'), request);
        });
    });

    describe('response', () => {
        let actions;
        let api;
        let responses;
        let response200;
        let response404;

        beforeEach(() => {
            response200 = { status: 200 };
            response404 = { status: 404 };

            responses = {
                200: response200,
                404: response404
            };

            actions = [{
                method: 'GET',
                uri: '/users',
                responses
            }];

            api = new ApiBlueprint(actions);
        });

        it('should return response with code 200 by default', () => {
            assert.equal(api.response('/users'), response200);
        });

        it('should return response with specified code', () => {
            assert.equal(api.response('/users', 'GET', 404), response404);
        });

        it('should throw error if response with specified code was not found', () => {
            const err = assert.throws(() => api.response('/users', 'GET', 201));

            assert.equal(err.message, 'Response 201 not found in  GET: /users');
        });
    });

    describe('responseMatches', () => {
        let actions;
        let api;

        beforeEach(() => {
            actions = [{
                method: 'GET',
                uri: '/users',
                responses: {
                    200: {
                        body: {
                            username: 'username',
                            email: 'mail@example.com'
                        },
                        name: '200',
                        schema: {
                            $schema: 'http://json-schema.org/draft-04/schema#',
                            type: 'object',
                            properties: { username: String, email: String },
                            required: ['username', 'email']
                        }
                    }
                }
            }];

            api = new ApiBlueprint(actions);
        });

        it('should return validation result', () => {
            const result = api.responseMatches({ username: 'testuser', email: 'test@mail.com' }, '/users');

            assert.equal(result.constructor.name, 'ValidatorResult');
        });

        it('should throw error if response doesn\'t match actions', () => {
            const err = assert.throws(() => api.responseMatches({ undefined: 'testuser', email: 'test@mail.com' }, '/users'));

            assert.equal(err.message, 'Response 200 does not match schema GET: /users');
        });
    });
});
