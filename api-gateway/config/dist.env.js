module.exports = {
  http: {
    server: "localhost",
    port: 3000
  },
  session: {
    secret: "thereisnosecret",
    expires: 2 * 3600 * 1000 // 2 hours
  },
  microservices: [
    {
      name: "todo-api",
      target: "http://localhost:3002",
      pathRewrite: {
        "^/api/todo/*": "/todo/"
      },
      route: "/todo"
    },
    {
      name: "user-api",
      target: "http://localhost:3001",
      pathRewrite: {
        "^/api/auth/*": "/auth/"
      },
      route: "/auth"
    }
  ]
};
