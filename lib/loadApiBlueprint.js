'use strict';

const fs = require('fs');

let protagonist;
try {
    protagonist = module.require('protagonist');
} catch (e) {
    protagonist = null;
}

function parseExample (res) {
    try {
        const body = JSON.parse(res.body);
        const schema = JSON.parse(res.schema);
        const { name } = res;

        return {
            body,
            name,
            schema
        };
    } catch (e) {
        return null;
    }
}

function parseResponses (responses) {
    const ret = {};

    responses.forEach((res) => {
        const response = parseExample(res);

        if (!response) {
            return;
        }

        ret[response.name] = response;
    });

    if (Object.keys(ret).length === 0) {
        return null;
    }

    return ret;
}

function loadApiBlueprint (filename) {
    if (protagonist === null) {
        throw new Error('`protagonist` must be included in project to test agains API blueprint');
    }

    const blueprint = fs.readFileSync(filename, 'utf8');

    const b = protagonist.parseSync(blueprint, { type: 'ast' });

    const endpoints = [];

    b.ast.resourceGroups.forEach((group) => {
        const groupName = group.name;

        group.resources.forEach((resource) => {
            const resourceName = resource.name;
            const resourceUri = resource.uriTemplate;

            resource.actions.forEach((action) => {
                const actionName = action.name;
                const uri = action.attributes.uriTemplate;
                const { method } = action;

                action.examples.forEach((example) => {

                    const request = example.requests[0]
                        && parseExample(example.requests[0]);

                    const responses = parseResponses(example.responses);

                    if (!responses) {
                        return;
                    }

                    /**
                     * THE STRUCTURE OF ENDPOINT
                     */
                    endpoints.push({
                        groupName,
                        resourceUri,
                        resourceName,
                        actionName,
                        uri: uri || resourceUri, // string
                        method, // string
                        request, // { body: Object, schema: Object }
                        responses // { [code]: { body: Object, schema: Object }}
                    });

                });
            });
        });
    });

    return endpoints;
}

// because the frontend (webpack)
// module.exports = () => ({ code: JSON.stringify(endpoints) });

module.exports = loadApiBlueprint;
