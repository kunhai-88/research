import React from "react";
import { prop, trim, isEmpty } from "lodash/fp";
import {
  compose,
  setDisplayName,
  withHandlers,
  lifecycle,
  withState
} from "recompose";

import { navigate, Link } from "@reach/router";
import Search from "../components/search";
import { get } from "../../shared/request";
import logo from "../../static/logo-white.png";
import iconCircle from "../../static/info-circle.png";
import "./lib.css";
import style from "./index.less";

export default compose(
  setDisplayName(__filename),
  withState("cover", "setCover", {}),
  lifecycle({
    componentDidMount() {
      const { setCover } = this.props;
      get(`/cover`).then(({ data }) => {
        setCover(data);
      });
    }
  }),
  withHandlers({
    onSearch: () => value => {
      const q = trim(value);
      if (!isEmpty(q)) {
        navigate(`/?q=${q}`);
      }
    }
  })
)(({ cover, onSearch }) => (
  <div
    className={style.SearchPage}
    style={{ backgroundImage: `url(${prop("link")(cover) || 'https://cn.bing.com/th?id=OHR.GodsGarden_EN-CN6732844646_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hpå'})` }}
  >
    <div className={style.SearchBar}>
      <div className={style.LogoWrap}>
        <img className={style.Logo} src={logo} alt="" />
        <a target="blank" href={prop("search")(cover)}>
          <img src={iconCircle} className={style.InfoIcon}  />
        </a>
      </div>
      <Search onSearch={onSearch} placeholder="javascript" />
       
    </div>
  </div>
));
