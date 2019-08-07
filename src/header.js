import React from "react";
import { compose, setDisplayName, withHandlers } from "recompose";
import Search from './search';
import style from "./style.less";
import favicon from '../static/favicon.png';

export default compose(
  setDisplayName(__filename),
)(({ onSearch, keyword, setKeyword }) => (
  <header className={style.Headerbar}>
    <a to="/" onClick={()=>setKeyword('')}><img className={style.TopLogo} src={favicon} alt="" /></a>
    <Search
      className={style.TopSearch}
      size="large"
      value={keyword}
      onSearch={onSearch}
      onChange={setKeyword}
    />
  </header>
));
