"use strict";

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const isUUID = require("is-uuid");
const uuid = require("uuid/v1");

module.exports = function(app) {
  const output = using("config/response");
  const { Methods } = using("app/controllers/TodoController");

  class TodoPresenter {
    constructor() {}

    auth(req, res, next) {
      // required to bypass OPTIONS on preflight request
      if (["POST", "GET", "PUT", "DELETE"].indexOf(req.method) !== -1) {
        const token =
          req.body.token || req.query.token || req.headers["x-access-token"];

        if (token) {
          jwt.verify(token, app.get("secretjwt"), (err, decoded) => {
            if (err) {
              next(output.notAuthorized("Failed to authenticate token."));
            } else {
              req.decoded = decoded;
              next();
            }
          });
        } else {
          next(output.forbidden("No token provided"));
        }
      } else {
        next();
      }
    }

    async getMany(req, res, next) {
      try {
        const result = await Methods.getAll(req.decoded.userId);
        res.json(output.found(result.Items, "OK", { count: result.Count }));
      } catch (error) {
        next(output.error(500, error));
      }
    }

    async upsertOne(req, res, next) {
      try {
        let data = req.body;
        if (!isUUID.v1(req.params.id)) {
          next(output.badRequest("data not found"));
        } else {
          data.todoId = req.params.id;
          data.userId = req.decoded.userId;
          const result = await Methods.upsertOne(data);
          res.json(output.found(data, "success"));
        }
      } catch (error) {
        next(output.error(500, error));
      }
    }

    async upsertMany(req, res, next) {
      try {
        let data = Array.isArray(req.body) ? req.body : [req.body];
        let dataRequest = [];

        for (let i = 0; i < data.length; i++) {
          let valid = true;
          let element = data[i];

          switch (req.method) {
            case "PUT":
              if (!isUUID.v1(element.todoId)) valid = false;
              break;
            case "POST":
              element.todoId = uuid();
              break;

            default:
              break;
          }

          element.userId = req.decoded.userId;
          if (typeof element.completed !== "boolean") element.completed = false;

          if (valid) dataRequest.push(element);
        }

        const result = await Methods.upsertMany(dataRequest);
        res.json(output.found(dataRequest, "success"));
      } catch (error) {
        next(output.error(500, error));
      }
    }

    async deleteOne(req, res, next) {
      try {
        let todoId = req.params.id;
        let userId = req.decoded.userId;
        const getOne = await Methods.getOne(todoId);
        const result = getOne.Item;

        if (result && result.userId === userId) {
          await Methods.deleteOne(todoId);
          res.json(output.found(result, "delete success"));
        } else {
          next(output.notFound("data is not found"));
        }
      } catch (error) {
        next(output.error(500, error));
      }
    }

    async deleteMany(req, res, next) {
      try {
        let userId = req.decoded.userId;
        let todoIds = req.body.map(todoId => {
          return { todoId };
        });

        const getMany = await Methods.getMany(todoIds);
        const result = getMany.Responses.Todolist_Todo;

        todoIds = result.reduce((memo, item) => {
          if (item.userId === userId) memo.push(item.todoId);
          return memo;
        }, []);

        if (todoIds.length) {
          await Methods.deleteMany(todoIds);
          res.json(output.found(result, "delete success"));
        } else {
          next(output.notFound("data is not found"));
        }
      } catch (error) {
        next(output.error(500, error));
      }
    }
  }

  return new TodoPresenter();
};
