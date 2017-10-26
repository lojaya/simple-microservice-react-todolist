import React, { Component } from 'react';
import utils from '../utils/utils'

class TodoFooter extends Component {
    changeStatus(status, e) {
        e.preventDefault();
        this.props.onChangeStatus(status);
    }

    render() {
        var activeTodoWord = utils.pluralize(this.props.count, 'item');
        var clearButton = null;
        
        if (this.props.completedCount > 0) {
            clearButton = (
                <button
                    className="clear-completed"
                    onClick={this.props.onClearCompleted}>
                    Clear completed
                </button>
            );
        }

        var nowShowing = this.props.nowShowing;

        return (
            <footer className="footer">
                <span className="todo-count">
                    <strong>{this.props.count}</strong> {activeTodoWord} left
                </span>
                <ul className="filters">
                    <li>
                        <a
                            href=""
                            className={(nowShowing === utils.constant.ALL_TODOS) ? "selected" : ""}
                            onClick={this.changeStatus.bind(this, utils.constant.ALL_TODOS)}>
                        All</a>
                    </li>
                    {' '}
                    <li>
                        <a
                            href=""
                            className={(nowShowing === utils.constant.ACTIVE_TODOS) ? "selected" : ""}
                            onClick={this.changeStatus.bind(this, utils.constant.ACTIVE_TODOS)}>
                            Active
                        </a>
                    </li>
                    {' '}
                    <li>
                        <a
                            href=""
                            className={(nowShowing === utils.constant.COMPLETED_TODOS) ? "selected" : ""}
                            onClick={this.changeStatus.bind(this, utils.constant.COMPLETED_TODOS)}>
                        Completed</a>
                    </li>
                </ul>
                { clearButton }
            </footer>
        );
    }
}

export default TodoFooter;