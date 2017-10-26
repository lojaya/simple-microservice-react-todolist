import React, { Component } from "react";

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editText: this.props.todo.content
    };
  }

  handleSubmit(event) {
    var val = this.state.editText.trim();
    if (val) {
      this.props.onSave(val);
      this.setState({
        editText: val
      });
    } else {
      this.props.onDestroy();
    }
  }

  handleEdit() {
    this.props.onEdit();
    this.setState({
      editText: this.props.todo.content
    });
  }

  handleKeyDown(event) {
    if (event.which === 27) {
      this.setState({
        editText: this.props.todo.content
      });
      this.props.onCancel(event);
    } else if (event.which === 13) {
      this.handleSubmit(event);
    }
  }

  handleChange(event) {
    if (this.props.editing) {
      this.setState({
        editText: event.target.value
      });
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      nextProps.todo !== this.props.todo ||
      nextProps.editing !== this.props.editing ||
      nextState.editText !== this.state.editText
    );
  };

  render() {
    var classname = "";

    if (this.props.todo.completed) {
      classname = "completed ";
    }

    if (this.props.editing) {
      classname += "editing";
    }

    return (
      <li className={classname}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.props.todo.completed}
            onChange={this.props.onToggle}
          />
          <label onDoubleClick={this.handleEdit.bind(this)}>
            {this.props.todo.content}
          </label>
          <button className="destroy" onClick={this.props.onDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleSubmit.bind(this)}
          onChange={this.handleChange.bind(this)}
          onKeyDown={this.handleKeyDown.bind(this)}
        />
      </li>
    );
  }
}

export default TodoItem;
