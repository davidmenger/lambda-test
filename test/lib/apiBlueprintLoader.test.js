'use strict';

const { assert } = require('chai');
const path = require('path');

const loadApiBlueprint = require('../../lib/loadApiBlueprint');

describe('ApiBlueprintLoader', () => {
    let api;

    beforeEach(() => {
        api = loadApiBlueprint(path.resolve(process.cwd(), './apiBlueprint.apib'));
    });

    describe('code', () => {
        it('should return array', () => {
            // console.log(api[0].responses['200']);
            assert.typeOf(api, 'array');
        });

        it('should return all documented groups', () => {
            const groupNames = api.map(endpoint => endpoint.groupName);
            const uniqueGroupNames = [...new Set(groupNames)];

            assert.lengthOf(uniqueGroupNames, 2);
            assert.equal(uniqueGroupNames[0], 'Users');
            assert.equal(uniqueGroupNames[1], 'Posts');
        });

        it('should parse responses correctly', () => {
            const { body } = api[0].responses['200'];

            assert.deepEqual(body, [{ username: 'mtakac', email: 'marek.takac@pragonauts.com' }]);
        });

        it('should parse request correctly', () => {
            const { body } = api[1].request;

            assert.deepEqual(body, { username: 'mtakac', email: 'marek.takac@pragonauts.com' });
        });

        it('should allow multiple responses for each endpoint', () => {
            const { responses } = api[5];

            assert.deepEqual(Object.keys(responses), ['200', '404', '422']);
        });

        it('should parse all endpoints documented in api blueprint', () => {
            assert.lengthOf(api, 6);
        });
    });
});
