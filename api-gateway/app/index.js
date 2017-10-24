const express = require("express");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const config = using("config");
const applyAllRoutes = using("app/routes");

module.exports = function() {
  const app = express();

  // settings
  app.use(morgan("dev"));
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, x-access-token"
    );
    next();
  });
  applyAllRoutes(app);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set("secretjwt", config.session.secret);
  app.set("expires", config.session.expires);

  return app;
};
