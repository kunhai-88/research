import ReactDOM from 'react-dom';
import React from 'react';
import Index from './pages/index';
import Result from './pages/result';
 
import { Router } from "@reach/router";

class App extends React.Component {
  render() {
    return (
      <div>
      <Router>
        <Index  path="*" />
        <Result path="result" />
    
      </Router>
      </div>
    );
  }
}


ReactDOM.render(<App />, document.querySelector('#root'));