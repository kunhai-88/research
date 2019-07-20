import React from "react";
import { trim, prop, map, isEmpty, sortBy, flow } from "lodash/fp";
import QueryString from "query-string";
import { navigate } from "@reach/router";
import {
  compose,
  setDisplayName,
  withHandlers,
  lifecycle,
  withState,
  withProps
} from "recompose";
import "./lib.css";
import { get } from "../../shared/request";
import style from "./style.module.less";

import Header from "../components/header";

const numberFormat = number => {
  const realNumber = parseInt(number);
  if (realNumber > 10000) {
    return (realNumber / 10000).toFixed(2) + "万";
  }
  return number;
};

export default compose(
  setDisplayName(__filename),
  withState("reslut", "setResult", []),
  withState("keyword", "setKeyword", ""),
  withState("searching", "setSearching", false),
  withState("height", "setHeight", 420),
  withHandlers({
    onResize: ({ setHeight })=>()=>{
      var height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
      setHeight(height - 148);
    },
  }),
  lifecycle({
    componentDidMount() {
      const search = prop("location.hash")(this.props);
      const { setResult, setKeyword, setSearching, setHeight } = this.props;
      const keywords = QueryString.parse(search);
      setSearching(true);
      setKeyword(keywords.q);
      get(`/search?q=${keywords.q}`).then(({ data }) => {
        if (_hmt) {
          _hmt.push(["_trackEvent", "搜索", "关键字", keywords.q, 1]);
        }
        setResult(prop("data")(data));
        setSearching(false);
      });
      this.props.onResize();
      window.onresize = this.props.onResize;
    }
  }),
  withHandlers({
    onSearch: ({ setResult, setKeyword, setSearching }) => value => {
      const q = trim(value);
      setKeyword(q);
      window.location.hash = `#q=${q}`;
      if (!isEmpty(q)) {
        setSearching(true);
        get(`/search?q=${q}`)
          .then(({ data }) => {
            setSearching(false);
            setResult(prop("data")(data));
          })
          .catch(() => {
            setSearching(false);
            setResult([]);
          });
      } else {
        navigate(`/`);
      }
    },
    onView: () => (title) =>()=> {
      if (_hmt) {
        _hmt.push(["_trackEvent", "课程", "查看", title, 1]);
      }
    },
  }),
  withProps(({ reslut }) => {
    return {
      reslut: flow(
        sortBy(item => {
          let hot = prop("hot")(item);
          return -hot;
        })
      )(reslut)
    };
  })
)(({ 
  reslut,
  onSearch,
  keyword,
  setKeyword, 
  searching,
  height,
  onView,

}) => (
  <div>
    <div className={style.Header}>
      <Header onSearch={onSearch} keyword={keyword} setKeyword={setKeyword} />
    </div>
    <div className={style.Content} style={{ minHeight: height || 420 }}>
      <div className={style.Result}>
        {map(item => (
          <div className={`${style.Card}  "card"`}>
            <div className={style.CoverWrap}>
              <a
                href={item.link}
                key={item._id}
                target="_blank"
                onClick={onView(item.title)}
              >
                <img
                  src={item.cover}
                  className={style.Cover}
                  alt={item.title}
                />
              </a>
            </div>
            <div className={style.Info}>
              <a
                href={item.link}
                key={item._id}
                rel="noopener noreferrer"
                target="_blank"
                className={style.Title}
                onClick={onView(item.title)}
              >
                {item.title}
              </a>
              <div className={style.Free}>免费</div>
              {item.hot && (
                <div className={style.Hot}>{numberFormat(item.hot)}</div>
              )}
              <a
                href={item.sourceLink}
                className={style.Source}
                onClick={onView(item.source)}
                target="_blank"
              >
                {item.source}
              </a>
              <div
                className={style.Intro}
                dangerouslySetInnerHTM={item.intro}
              />
            </div>
          </div>
        ))(reslut)}

        {searching && (
          <div className={style.Loader}>
            <div className={"ball-triangle-path"}>
              <div />
              <div />
              <div />
            </div>
          </div>
        )}

        {!searching && isEmpty(reslut) && (
          <div className={style.NoReslut}>
            很抱歉，没有找到与“
            <span className={style.HighlightKeyword}>{keyword}</span>
            ”相关的课程,请检查您的输入是否正确。
          </div>
        )}
      </div>
    </div>
    <footer className={style.Footer}>
      © 2019 搜课 Created by Andy | 蜀ICP备18015889号-1
    </footer>
  </div>
));
