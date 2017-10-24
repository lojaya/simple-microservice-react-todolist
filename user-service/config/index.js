let env = "dev";
if (process.env.NODE_ENV === "production") {
  env = "dist";
}

module.exports = require("./" + env + ".env.js");
