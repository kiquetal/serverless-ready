'use strict';
const co = require("co");
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurant_tables;

function* getRestaurant(count)
{
  let req={
    TableName:tableName,
    Limit: count
  }
  let resp = yield dynamodb.scan(req).promise();
  return resp.Items;
}

module.exports.main = co.wrap(function* (event,context,cb){
  
  let restaurants = yield getRestaurant(defaultResults);
  let response = {
    
    statusCode: 200,
    body: JSON.stringify(restaurants)
  }
  
  cb(null,response);
  
});
