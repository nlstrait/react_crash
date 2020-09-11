import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';
import About from './components/pages/About';

import axios from 'axios';

import './App.css';

const API_URL = "http://localhost:8000/api";

class App extends Component {
  state = {
    todos: []
  }

  componentDidMount() {
    axios.get(API_URL + "/items/")
      .then(res => this.setState({ todos: res.data }))
  }

  // Toggle Todo complete
  markComplete = (id) => {
    const completed = this.state.todos.find(item => item.id === id).completed
    axios.patch(API_URL + `/items/${id}/`, {
      completed: !completed
    })
      .then(res => this.setState((state) => ({
        todos: state.todos.map(todo => {
          if (todo.id === id) {
            todo.completed = !todo.completed
          }
          return todo;
        }),
       })));
  }

  // Delete Todo
  delTodo = (id) => {
    axios.delete(API_URL + `/items/${id}/`)
      .then(res => this.setState((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      })));
  }

  // Add Todo
  addTodo = (title) => {
    axios.post(API_URL + "/items/", {
      title,
      completed: false
    })
      .then(res => this.setState((state) => ({
        todos: [...state.todos, res.data]
      })));
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <div className="container">
            <Header />
            <Route exact path="/" render={props => (
              <Fragment>
                <AddTodo addTodo={this.addTodo}/>
                <Todos todos={this.state.todos} markComplete={this.markComplete} delTodo={this.delTodo}/>
              </Fragment>
            )} />
            <Route path="/about" component={About}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
