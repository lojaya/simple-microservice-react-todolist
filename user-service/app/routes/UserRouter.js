const express = require("express");
const router = express.Router();

module.exports = function(app) {
  const UserPresenter = using("app/presenters/UserPresenter")(app);

  router.post("/register", UserPresenter.register);
  router.post("/login", UserPresenter.login);
  router.get("/isAuthorized", UserPresenter.isAuthorized);

  return {
    base: "/auth",
    controls: router
  };
};
