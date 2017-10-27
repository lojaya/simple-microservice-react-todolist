import axios from "axios";

const baseUrl = "http://localhost:3000/api";

const authApi = {
  register: function(email, password, success, failed) {
    axios({
      method: "post",
      url: baseUrl + "/auth/register",
      data: {
        email: email,
        password: password
      }
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  },

  login: function(email, password, success, failed) {
    axios({
      method: "post",
      url: baseUrl + "/auth/login",
      data: {
        email: email,
        password: password
      }
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  },

  isAuthorized: function(token, success, failed) {
    axios({
      method: "get",
      url: baseUrl + "/auth/isAuthorized",
      headers: { "x-access-token": token }
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  }
};

const todoApi = {
  getMany: function(token, success, failed) {
    axios({
      method: "get",
      url: baseUrl + "/todo",
      headers: { "x-access-token": token }
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  },

  createOne: function(token, data, success, failed) {
    axios({
      method: "post",
      url: baseUrl + "/todo",
      headers: { "x-access-token": token },
      data: data
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  },

  updateMany: function(token, data, success, failed) {
    axios({
      method: "put",
      url: baseUrl + "/todo",
      headers: { "x-access-token": token },
      data: data
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  },

  updateOne: function(token, data, success, failed) {
    axios({
      method: "put",
      url: baseUrl + "/todo/" + data.todoId,
      headers: { "x-access-token": token },
      data: data
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  },

  deleteOne: function(token, todoId, success, failed) {
    axios({
      method: "delete",
      url: baseUrl + "/todo/" + todoId,
      headers: { "x-access-token": token }
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  },

  deleteMany: function(token, data, success, failed) {
    axios({
      method: "delete",
      url: baseUrl + "/todo",
      headers: { "x-access-token": token },
      data: data
    })
      .then(response => {
        if (response.data.status !== 200) {
          failed(response.data);
        } else {
          success(response.data);
        }
      })
      .catch(error => {
        failed(error.response.data);
      });
  }
};

export { authApi, todoApi };
