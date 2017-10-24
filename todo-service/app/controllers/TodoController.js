const express = require("express");
const AWS = require("aws-sdk");
const uuid = require("uuid");
const crypto = require("crypto");

AWS.config.update({ region: "ap-southeast-1" });

const todoTable = "Todolist_Todo";
const docClient = new AWS.DynamoDB.DocumentClient();

const Methods = {
  getOne: function(todoId, userId) {
    let params = {
      TableName: todoTable,
      Key: { todoId }
    };

    return docClient.get(params).promise();
  },

  getMany: function(todoIds) {
    let params = {
      TableName: todoTable,
      RequestItems: {
        Todolist_Todo: {
          Keys: todoIds
        }
      }
    };

    return docClient.batchGet(params).promise();
  },

  getAll: function(userId) {
    let params = {
      TableName: todoTable,
      IndexName: "userId-index",
      KeyConditionExpression: "userId = :a",
      ExpressionAttributeValues: {
        ":a": userId
      },
      ProjectionExpression: "todoId, content, completed"
    };

    return docClient.query(params).promise();
  },

  upsertOne: function(data) {
    let params = {
      TableName: todoTable,
      Item: {
        todoId: data.todoId,
        userId: data.userId,
        completed: data.completed,
        content: data.content
      }
    };

    return docClient.put(params).promise();
  },

  upsertMany: function(data) {
    let putRequests = [];

    for (let i = 0; i < data.length; i++) {
      let element = data[i];
      let putRequest = {
        PutRequest: {
          Item: {
            todoId: element.todoId,
            userId: element.userId,
            completed: element.completed,
            content: element.content
          }
        }
      };
      putRequests.push(putRequest);
    }

    let params = {
      RequestItems: {
        Todolist_Todo: putRequests
      }
    };

    return docClient.batchWrite(params).promise();
  },

  deleteOne: function(todoId) {
    let params = {
      TableName: todoTable,
      Key: { todoId }
    };

    return docClient.delete(params).promise();
  },

  deleteMany: function(todoIds) {
    let deleteRequests = [];

    for (let i = 0; i < todoIds.length; i++) {
      let deleteRequest = {
        DeleteRequest: {
          Key: { todoId: todoIds[i] }
        }
      };
      deleteRequests.push(deleteRequest);
    }

    let params = {
      RequestItems: {
        Todolist_Todo: deleteRequests
      }
    };

    return docClient.batchWrite(params).promise();
  }
};

module.exports = {
  Methods
};
