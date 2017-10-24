const express = require("express");
const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const crypto = require("crypto");

AWS.config.update({ region: "ap-southeast-1" });

const userTable = "Todolist_User";
const dynamoDb = new AWS.DynamoDB();

const Methods = {
  register: function(data) {
    let params = {
      TableName: userTable,
      Item: {
        userId: { S: uuid() },
        email: { S: data.email.toLowerCase() },
        password: {
          S: crypto
            .createHash("sha256")
            .update(data.password)
            .digest("hex")
        }
      }
    };

    return dynamoDb.putItem(params).promise();
  },

  checkEmail: function(email) {
    let params = {
      TableName: userTable,
      ExpressionAttributeValues: {
        ":e": { S: email.toLowerCase() }
      },
      IndexName: "email-index",
      KeyConditionExpression: "email = :e"
    };

    return dynamoDb.query(params).promise();
  },

  checkById: function(userId) {
    let params = {
      TableName: userTable,
      ExpressionAttributeValues: {
        ":e": { S: userId }
      },
      KeyConditionExpression: "userId = :e",
      ProjectionExpression: "userId, email"
    };

    return dynamoDb.query(params).promise();
  },

  unmarshall: function(data) {
    return data.Items.map(AWS.DynamoDB.Converter.unmarshall);
  }
};

module.exports = {
  Methods
};
