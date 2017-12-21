# *NPM module template*

Small template for building NPM modules.

**This App follows [Sustainable App Manifest](https://github.com/pragonauts/developer-friendly-app-manifest)**

-----------------------

1. [NPM Tasks](#npm-tasks)
1. [How To Use](#how-to-use)
1. [Developing in right Node.js environment](#developing-in-right-nodejs-environment)
1. [Conributing](#contributing)

## NPM Tasks

- `$ npm test` - runs automatic tests (linter, coverage, unit & API tests)
- `$ npm run test:backend` - run backend unit & API test
- `$ npm run test:backend:watch` - run and watch backend unit & API test
- `$ npm run test:coverage` - run coverage test
- `$ npm run test:coverage:threshold` - run coverage threshold test
- `$ npm run test:lint` - run eslint test

## How To Use

1. Fork the project
1. Clone your fork
1. Rename the root directory and name atrribute in `package.json`
1. Run `npm install` command
1. And you're ready to start developing your own NPM module

## Developing in right Node.js environment

- you can use [NVM](https://github.com/creationix/nvm) to manage multiple Node versions
- just specify wanted Node version in `.nvmrc` file

## Contributing

- Follow [AirBnB style guide](https://github.com/airbnb/javascript)
- Mind the [Gitflow workflow](http://nvie.com/posts/a-successful-git-branching-model/)
- Check ESLint settings in `.eslintrc` and ensure your ESLint is enabled
- (*do the magick*)
- run `npm test` to ensure everything is fine
- create feature branch at your fork and make pull request to upstream (ask App Owner)
