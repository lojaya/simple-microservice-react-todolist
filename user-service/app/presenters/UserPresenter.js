"use strict";

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const uuid = require("uuid/v1");

module.exports = function(app) {
  const output = using("config/response");
  const { Methods } = using("app/controllers/UserController");

  const tokenizer = function(userId) {
    return jwt.sign({ userId: userId }, app.get("secretjwt"), {
      expiresIn: app.get("expires")
    });
  };

  class UserPresenter {
    constructor() {}

    async register(req, res, next) {
      try {
        let data = req.body;
        const isEmailRegistered = await Methods.checkEmail(data.email);

        if (isEmailRegistered.Count) {
          next(output.error(400, null, "email is already registered!"));
        } else {
          await Methods.register(data);
          const result = await Methods.checkEmail(data.email);
          const mapped = await Methods.unmarshall(result);
          const token = tokenizer(mapped[0].userId);
          res.json(output.found({ token }, "success register"));
        }
      } catch (error) {
        next(output.error(500, error));
      }
    }

    async login(req, res, next) {
      try {
        let data = req.body;
        const password = crypto
          .createHash("sha256")
          .update(data.password)
          .digest("hex");
        const result = await Methods.checkEmail(data.email);
        if (result.Count) {
          const mapped = await Methods.unmarshall(result);
          if (password === mapped[0].password) {
            const token = tokenizer(mapped[0].userId);
            res.json(output.found({ token }, "success"));
          } else {
            next(output.error(400, null, "email or password is wrong!"));
          }
        } else {
          next(output.error(400, null, "email or password is wrong!"));
        }
      } catch (error) {
        next(output.error(500, error));
      }
    }

    isAuthorized(req, res, next) {
      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (token) {
        jwt.verify(token, app.get("secretjwt"), async (err, decoded) => {
          if (err) {
            next(output.notAuthorized("Failed to authenticate token."));
          } else {
            const result = await Methods.checkById(decoded.userId);
            const mapped = await Methods.unmarshall(result);
            res.json(output.found(mapped[0], "authorized"));
          }
        });
      } else {
        next(output.forbidden("No token provided"));
      }
    }
  }

  return new UserPresenter();
};
