import React from "react";
import { compose, setDisplayName, lifecycle, withState } from "recompose";
import QueryString from "query-string";
import "./lib.css";

import Index from "./index";
import Result from "./result";

export default compose(
  setDisplayName(__filename),
  withState("keyword", "setKeyword", {}),

  lifecycle({
    componentWillReceiveProps() {
      const search = document.location.search.substring(1);
      const keywords = QueryString.parse(search);
      console.log(keywords.q);
      this.props.setKeyword(keywords.q);
    }
  })
)(({ keyword }) => <div>{keyword ? <Result /> : <Index />}</div>);
