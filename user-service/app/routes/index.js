const express = require("express");
const routers = collect("app/routes", "router");

const applyRoutes = (app, routes) => {
  routes.forEach(route => {
    const router = route(app);
    app.use(router.base, router.controls);
  }, this);
};

module.exports = app => {
  // apply all routes
  applyRoutes(app, routers);

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
