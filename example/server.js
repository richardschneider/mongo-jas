"use strict";
var server = module.exports = { };

var jsonApi = require("jsonapi-server");
var fs = require("fs");
var path = require("path");

jsonApi.mongoHandlers = require('../index.js').handlers;
//jsonApi.mongoHandlers = jsonApi.mockHandlers;

jsonApi.setConfig({
  base: "rest",
  port: 16006,
  meta: {
    copyright: "Blah example server for MongoDB"
  }
});

jsonApi.authenticate(function(request, callback) {
  // If a "blockMe" header is provided, block access.
  if (request.headers.blockme) return callback("Fail");

  // If a "blockMe" cookie is provided, block access.
  if (request.cookies.blockMe) return callback("Fail");

  return callback();
});

fs.readdirSync(path.join(__dirname, "/resources")).filter(function(filename) {
  return /^[a-z].*\.js$/.test(filename);
}).map(function(filename) {
  return path.join(__dirname, "/resources/", filename);
}).forEach(require);

jsonApi.onUncaughtException(function(request, error) {
  var errorDetails = error.stack.split("\n");
  console.error(JSON.stringify({
    request: request,
    error: errorDetails.shift(),
    stack: errorDetails
  }));
});

jsonApi.start();
server.start = jsonApi.start;
server.close = jsonApi.close;
