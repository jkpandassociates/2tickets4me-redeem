declare var require: any;

const pkg = require('../../../../package.json');

export const environment = {
  name: pkg.name,
  version: pkg.version,
  production: true
};
