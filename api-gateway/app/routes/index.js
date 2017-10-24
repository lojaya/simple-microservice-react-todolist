const express = require("express");
const proxy = require("http-proxy-middleware");
const config = using("config");

const applyServices = app => {
  config.microservices.forEach(microservice => {
    let proxyOpt = {
      target: microservice.target,
      changeOrigin: true,
      ws: true,
      pathRewrite: microservice.pathRewrite
    };

    app.use("/api" + microservice.route, proxy(proxyOpt));
  }, this);
};

module.exports = app => {
  // apply all services
  applyServices(app);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error("Not Found");
    const notFound = {
      status: 404,
      message: err.message,
      stack: err.stack
    };

    next(notFound);
  });

  // error handler
  app.use(function(err, req, res, next) {
    const status = err.status || 500;

    if (req.app.get("env") !== "development") {
      delete err.stack;
      delete err.stack_message;
    }

    res.status(status).json(err);
  });
};
