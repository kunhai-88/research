import React from "react";
import { compose, setDisplayName, withHandlers } from "recompose";
import Search from '../components/search';
import style from "./style.module.less";
import favicon from '../../static/favicon.png';
import { Link } from "@reach/router";

export default compose(
  setDisplayName(__filename),
  withHandlers({
    onChange: ({ setKeyword }) => e => {
      setKeyword(e.target.value);
    },
  })
)(({ onSearch, keyword, onChange }) => (
  <header className={style.Headerbar}>
    <Link to="/"><img className={style.TopLogo} src={favicon} alt="" /></Link>
    <Search
      className={style.TopSearch}
      size="large"
      value={keyword}
      onSearch={onSearch}
      onChange={onChange}
    />
  </header>
));
