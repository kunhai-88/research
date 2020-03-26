import React from "react";
import Search from './search';
import style from "./style.less";
import favicon from '../static/favicon.png';

export default ({ onSearch, keyword, setKeyword }) => (
  <header className={style.Headerbar}>
    <a to="/" onClick={()=>setKeyword('')}><img className={style.TopLogo} src={favicon} alt="" /></a>
    <Search
      className={style.TopSearch}
      size="large"
      value={keyword}
      onSearch={onSearch}
      onChange={setKeyword}
    />
    <a className={style.Tip} href="http://search.kunhai.xyz/">请使用新地址</a>
  </header>
);
