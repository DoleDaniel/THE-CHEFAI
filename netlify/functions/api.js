const serverless = require('serverless-http');
const app = require('../../server.js');

module.exports.handler = serverless(app, {
  basePath: '/.netlify/functions/api'
});
