import React, { Component } from "react";
import axios from "axios";
import utils from "../utils/utils";
import { authApi } from "../utils/apiCall";

const ValidateEmail = str => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(str);
};

class TodoNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
      user: "",
      isLoading: false
    };
  }

  resetState = () => {
    this.setState({
      email: "",
      password: "",
      error: "",
      user: ""
    });
  };

  showLoader = load => {
    this.setState({
      isLoading: load
    });
  };

  isAuthorized = () => {
    const self = this;
    const token = localStorage.getItem("token");

    if (token) {
      authApi.isAuthorized(
        token,
        function(result) {
          self.setState({
            user: result.data.email
          });
        },
        function(err) {
          localStorage.removeItem("token");
          self.resetState();
        }
      );
    }
  };

  componentDidMount() {
    window.addEventListener("hashchange", this.resetState, false);
    this.isAuthorized();
  }

  componentWillUnmount() {
    window.addEventListener("hashchange", this.resetState, false);
  }

  handleChangeEmail = event => {
    this.setState({
      email: event.target.value
    });
  };

  handleChangePassword = event => {
    this.setState({
      password: event.target.value
    });
  };

  handleError() {
    let isValid = true;
    this.setState({
      error: ""
    });

    if (!this.state.password) {
      isValid = false;
      this.setState({
        error: "please insert password!"
      });
    }

    if (!this.state.email) {
      isValid = false;
      this.setState({
        error: "please insert email!"
      });
    } else {
      if (!ValidateEmail(this.state.email)) {
        isValid = false;
        this.setState({
          error: "email format is wrong!"
        });
      }
    }

    return isValid;
  }

  handleRegister = event => {
    var self = this;
    event.preventDefault();
    let valid = this.handleError();
    if (valid) {
      self.showLoader(true);
      authApi.register(
        this.state.email,
        this.state.password,
        function(result) {
          localStorage.setItem("token", result.data.token);
          window.location.hash = "#";
          self.isAuthorized();
          self.showLoader(false);
        },
        function(err) {
          self.setState({
            error: err.message
          });
          self.showLoader(false);
        }
      );
    }
  };

  handleRegisterKeydown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.handleRegister(event);
    }
  };

  handleLogin = event => {
    var self = this;
    event.preventDefault();
    let valid = this.handleError();

    if (valid) {
      self.showLoader(true);
      authApi.login(
        this.state.email,
        this.state.password,
        function(result) {
          localStorage.setItem("token", result.data.token);
          window.location.hash = "#";
          self.isAuthorized();
          self.showLoader(false);
          self.props.onLoginSuccess();
        },
        function(err) {
          self.setState({
            error: err.message
          });
          self.showLoader(false);
        }
      );
    }
  };

  handleLoginKeydown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.handleLogin(event);
    }
  };

  handleLogout = event => {
    event.preventDefault();
    localStorage.removeItem("token");
    this.resetState();
    this.props.onLogoutSuccess();
  };

  render() {
    let menus = (
      <ul className="navigation">
        <li>
          <a href="#register">register</a>
        </li>
        <li>
          <a href="#login">login</a>
        </li>
      </ul>
    );

    let loader, loaderClass;

    if (this.state.isLoading) {
      loaderClass = "loading";
      loader = (
        <div className="spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>
      );
    }

    let loginFrame = (
      <div id="login" className="modal-window">
        <div className={loaderClass}>
          {loader}
          <a href="#" title="Close" className="modal-close">
            Close
          </a>
          <h1>Login</h1>
          <div className="input-control">
            <input
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
              onKeyDown={this.handleLoginKeydown}
            />
          </div>
          <div className="input-control">
            <input
              type="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
              onKeyDown={this.handleLoginKeydown}
            />
          </div>
          <a className="btn" href="" onClick={this.handleLogin}>
            Submit
          </a>
          <p className="error">{this.state.error}</p>
        </div>
      </div>
    );

    let registerFrame = (
      <div id="register" className="modal-window">
        <div className={loaderClass}>
          {loader}
          <a href="#" title="Close" className="modal-close">
            Close
          </a>
          <h1>Register</h1>
          <div className="input-control">
            <input
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
              onKeyDown={this.handleRegisterKeydown}
            />
          </div>
          <div className="input-control">
            <input
              type="password"
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
              onKeyDown={this.handleRegisterKeydown}
            />
          </div>
          <a className="btn" href="" onClick={this.handleRegister}>
            Submit
          </a>
          <p className="error">{this.state.error}</p>
        </div>
      </div>
    );

    if (localStorage.getItem("token")) {
      menus = (
        <ul className="navigation">
          <li>hi {this.state.user}</li>
          <li>
            <a href="" onClick={this.handleLogout}>
              logout
            </a>
          </li>
        </ul>
      );
      loginFrame = "";
      registerFrame = "";
    }

    return (
      <nav className="nav">
        {menus}
        {loginFrame}
        {registerFrame}
      </nav>
    );
  }
}

export default TodoNavigation;
