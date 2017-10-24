module.exports = {
  http: {
    server: "localhost",
    port: 3001
  },
  session: {
    secret: "thereisnosecret",
    expires: 2 * 3600 * 1000 // 2 hours
  }
};
