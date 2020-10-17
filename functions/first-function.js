'use strict';

const co = require("co");
const Promise = require("bluebird");
const fs= Promise.promisifyAll(require("fs"));
const aws4 = require ('aws4');
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const Mustache = require("mustache");
const URL = require('url');
const http = require('superagent-promise')(require('superagent'),Promise);
var html;
const restaurantsApiRoot = process.env.restaurants_api;

function* loadHtml() {
  console.log("here" +JSON.stringify(URL));
  if(!html)
    html = yield fs.readFileAsync('static/index.html','utf-8');
  
  return html;
  
}
function* getRestaurants() {
  
  let url = URL.parse(restaurantsApiRoot);
  let opt ={
    host:url.hostname,
    path:url.pathname
  };
  aws4.sign(opt);
  
  return (yield http.get(restaurantsApiRoot)
                    .set('Host',opt.headers['Host'])
                    .set('X-Amz-Date',opt.headers['X-Amz-Date'])
                    .set('Authorization',opt.headers['Authorization'])
                    .set('X-Amz-Security-Token',opt.headers['X-Amz-Security-Token'])
  ).body;
}

module.exports.main = co.wrap( function* (event, context, callback)  {
  let template = yield loadHtml();
  let restaurants = yield getRestaurants();
  let dayOfWeek = days[new Date().getDay()];
  let html = Mustache.render(template,{ dayOfWeek, restaurants });
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
