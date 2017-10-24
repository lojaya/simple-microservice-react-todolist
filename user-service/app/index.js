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
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.set("secretjwt", config.session.secret);
  app.set("expires", config.session.expires);

  applyAllRoutes(app);

  return app;
};
