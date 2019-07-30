import ReactDOM from "react-dom";
import React from "react";
import Index from "./app";

import { Router } from "@reach/router";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Index path="*" />
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
