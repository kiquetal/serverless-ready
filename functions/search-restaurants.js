'use strict';
const co = require("co");
const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const defaultResults = process.env.defaultResults || 8;
const tableName = process.env.restaurant_tables;

function* findRestaurantByTheme(count,theme)
{
  let req={
    TableName:tableName,
    Limit: count,
    FilterExpression: "contains(themes,:theme)",
    ExpressionAttributeValues:{":theme":theme}
  }
  let resp = yield dynamodb.scan(req).promise();
  return resp.Items;
}

module.exports.main = co.wrap(function* (event,context,cb){
  let req = JSON.parse(event.body);
  let restaurants = yield findRestaurantByTheme(defaultResults,req.theme);
  let response = {
    
    statusCode: 200,
    body: JSON.stringify(restaurants)
  }
  
  cb(null,response);
  
});
