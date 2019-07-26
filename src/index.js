import ReactDOM from 'react-dom';
import React from 'react';
import Index from './pages/index';
 
import { Router } from "@reach/router";

class App extends React.Component {
  render() {
    return (
      <div>
      <Router>
        <Index  path="*" />
      </Router>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));