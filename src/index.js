import ReactDOM from "react-dom";
import React from "react";
import Index from "./app";


class App extends React.Component {
  render() {
    return (
        <Index   />
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#root"));
