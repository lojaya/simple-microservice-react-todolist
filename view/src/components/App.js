import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import TodoNavigation from "./Nav";
import TodoItem from "./Item";
import TodoFooter from "./Footer";
import utils from "../utils/utils";
import { todoApi } from "../utils/apiCall";

import "../styles/normalize.css";
import "../styles/app.css";
import "react-toastify/dist/ReactToastify.min.css";

class TodoApp extends Component {
  toastId = null;

  constructor(props) {
    super(props);
    this.state = {
      editing: null,
      nowShowing: utils.constant.ALL_TODOS,
      newTodo: "",
      items: [],
      isLoading: false
    };
  }

  showLoader = load => {
    this.setState({
      isLoading: load
    });
  };

  notify = msg => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast.error(msg);
    }
  };

  getAllTodos = cb => {
    const self = this;
    const token = localStorage.getItem("token");

    const callback =
      cb ||
      function(result) {
        self.setState({
          items: result.data
        });
      };

    if (token) {
      todoApi.getMany(token, callback, function(err) {
        localStorage.removeItem("token");
      });
    }
  };

  removeAllTodos = () => {
    this.setState({
      items: []
    });
  };

  componentDidMount() {
    var initial = {
      editing: null,
      nowShowing: utils.constant.ALL_TODOS,
      newTodo: ""
    };

    this.setState(initial);

    this.getAllTodos();
  }

  // input events
  handleChange = event => {
    this.setState({
      newTodo: event.target.value
    });
  };

  handleNewTodo = event => {
    const self = this;
    const newValue = this.state.newTodo.trim();

    if (newValue) {
      self.showLoader(true);
      todoApi.createOne(
        localStorage.getItem("token"),
        {
          content: newValue,
          completed: false
        },
        function(result) {
          const newitem = result.data;
          self.setState({
            newTodo: "",
            items: [...self.state.items, ...newitem]
          });
          self.showLoader(false);
        },
        function(err) {
          self.notify(err.message);
          self.showLoader(false);
        }
      );
    }
  };

  handleNewTodoClick = event => {
    this.handleNewTodo(event);
  };

  handleNewTodoKeyDown = event => {
    if (event.keyCode !== 13) {
      return;
    }

    this.handleNewTodo(event);
  };

  toggleAll = event => {
    const self = this;
    var checked = event.target.checked;

    self.showLoader(true);

    this.getAllTodos(result => {
      self.setState({
        items: result.data
      });

      var todos = self.state.items.map(item => {
        return utils.extend({}, item, { completed: checked });
      });

      todoApi.updateMany(
        localStorage.getItem("token"),
        todos,
        function(result) {
          console.log("result");
          console.log(result);
          self.setState({
            items: result.data
          });
          self.showLoader(false);
        },
        function(err) {
          console.log("err");
          console.log(err);
          self.notify(err.message);
          self.showLoader(false);
        }
      );
    });
  };
  //

  //list events
  toggle(todoToToggle) {
    const self = this;
    todoToToggle.completed = !todoToToggle.completed;

    self.showLoader(true);

    todoApi.updateOne(
      localStorage.getItem("token"),
      todoToToggle,
      function(result) {
        var todos = self.state.items.map(item => {
          return item.todoId !== todoToToggle.todoId
            ? item
            : utils.extend({}, item, { completed: item.completed });
        });
        self.setState({
          items: todos
        });
        self.showLoader(false);
      },
      function(err) {
        self.notify(err.message);
        self.showLoader(false);
      }
    );
  }

  destroy(todo) {
    const self = this;

    self.showLoader(true);

    todoApi.deleteOne(
      localStorage.getItem("token"),
      todo.todoId,
      function(result) {
        var todos = self.state.items.filter(item => {
          return item !== todo;
        });
        self.setState({
          items: todos
        });
        self.showLoader(false);
      },
      function(err) {
        self.notify(err.message);
        self.showLoader(false);
      }
    );
  }

  edit(todo) {
    this.setState({
      editing: todo.todoId
    });
  }

  save(todoToSave, text) {
    const self = this;

    self.showLoader(true);

    todoApi.updateOne(
      localStorage.getItem("token"),
      Object.assign({}, todoToSave, { content: text }),
      function(result) {
        var todos = self.state.items.map(items => {
          return items !== todoToSave
            ? items
            : utils.extend({}, items, { content: text });
        });

        self.setState({
          items: todos,
          editing: null
        });
        self.showLoader(false);
      },
      function(err) {
        self.notify(err.message);
        self.showLoader(false);
      }
    );
  }

  cancel() {
    this.setState({
      editing: null
    });
  }
  //

  //footer events
  clearCompleted = () => {
    const self = this;

    self.showLoader(true);

    var todoIds = self.state.items.reduce((memo, item) => {
      if (item.completed) memo.push(item.todoId);
      return memo;
    }, []);

    todoApi.deleteMany(
      localStorage.getItem("token"),
      todoIds,
      function(result) {
        var todos = self.state.items.filter(item => {
          return !item.completed;
        });
        self.setState({
          items: todos
        });
        self.showLoader(false);
      },
      function(err) {
        self.notify(err.message);
        self.showLoader(false);
      }
    );
  };

  onChangeStatus(status) {
    this.setState({
      nowShowing: status
    });
  }
  //

  render() {
    let todoClass, loader, main, footer;
    let todos = this.state.items;

    let shownTodos = todos.filter(todo => {
      switch (this.state.nowShowing) {
        case utils.constant.ACTIVE_TODOS:
          return !todo.completed;
        case utils.constant.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    }, this);

    let todoItems = shownTodos.map(todo => {
      return (
        <TodoItem
          key={todo.todoId}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.todoId}
          onSave={this.save.bind(this, todo)}
          onCancel={this.cancel}
        />
      );
    }, this);

    let activeTodoCount = todos.reduce(function(accumulate, todo) {
      return todo.completed ? accumulate : accumulate + 1;
    }, 0);

    let completedCount = todos.length - activeTodoCount;

    if (activeTodoCount || completedCount) {
      footer = (
        <TodoFooter
          count={activeTodoCount}
          completedCount={completedCount}
          nowShowing={this.state.nowShowing}
          onClearCompleted={this.clearCompleted}
          onChangeStatus={this.onChangeStatus.bind(this)}
        />
      );
    }

    if (todos.length) {
      main = (
        <section className="main">
          <input
            className="toggle-all"
            type="checkbox"
            onChange={this.toggleAll}
            checked={activeTodoCount === 0}
          />
          <ul className="todo-list">{todoItems}</ul>
        </section>
      );
    }

    todoClass = "todoapp";

    if (this.state.isLoading) {
      todoClass += " loading";
      loader = (
        <div className="spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>
      );
    }

    return (
      <div>
        <TodoNavigation
          onLoginSuccess={this.getAllTodos}
          onLogoutSuccess={this.removeAllTodos}
        />
        <div className={todoClass}>
          {loader}
          <header className="header">
            <input
              className="new-todo"
              placeholder="Add a to-do here"
              value={this.state.newTodo}
              onKeyDown={this.handleNewTodoKeyDown}
              onChange={this.handleChange}
              autoFocus={false}
            />
            <input
              className="new-todo-submit"
              type="submit"
              value="submit"
              onClick={this.handleNewTodoClick}
            />
          </header>
          {main}
          {footer}
        </div>

        <ToastContainer
          position="top-right"
          type="default"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
      </div>
    );
  }
}

export default TodoApp;
