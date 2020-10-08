'use strict';

const co = require("co");
const Promise = require("bluebird");
const fs= Promise.promisifyAll(require("fs"));
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const Mustache = require("mustache");
const URL=process.env.APIG_URL;
var html;

function* loadHtml() {
  console.log("here" +JSON.stringify(URL));
  if(!html)
    html = yield fs.readFileAsync('static/index.html','utf-8');
  
  return html;
  
}

module.exports.main = co.wrap( function* (event, context, callback)  {
  let html = yield loadHtml();
  const response = {
    statusCode: 200,
    body: html,
    headers:{
      'Content-Type':'text/html; charset=UTF-8'
    }
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
});
