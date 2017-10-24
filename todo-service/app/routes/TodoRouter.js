const express = require("express");
const router = express.Router();

module.exports = function(app) {
  const TodoPresenter = using("app/presenters/TodoPresenter")(app);

  app.use(TodoPresenter.auth);

  router.get("/", TodoPresenter.getMany);
  router.post("/", TodoPresenter.upsertMany);
  router.put("/", TodoPresenter.upsertMany);
  router.put("/:id", TodoPresenter.upsertOne);
  router.delete("/", TodoPresenter.deleteMany);
  router.delete("/:id", TodoPresenter.deleteOne);

  return {
    base: "/todo",
    controls: router
  };
};
