import ReactDOM from 'react-dom';
import React from 'react';
import Root from './pages/root.js';
 
import { Router } from "@reach/router";

class App extends React.Component {
  render() {
    return (
      <div>
      <Router>
        <Root  path="*" />
      </Router>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));