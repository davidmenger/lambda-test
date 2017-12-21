'use strict';

const assert = require('chai').assert;

const NpmModule = require('../../lib/npm-module');

describe('Npm module', () => {
    it('works', () => {
        const npmModule = new NpmModule();
        assert.instanceOf(npmModule, NpmModule);
    });
});
