import React from "react";
import { prop, trim, isEmpty } from "lodash/fp";
import {
  compose,
  setDisplayName,
  withHandlers,
  lifecycle,
  withState,
} from "recompose";
import QueryString from "query-string";
import {
  Tabs,
  DragTabList,
  DragTab,
  PanelList,
  Panel,
} from "react-tabtab/lib/";
import { simpleSwitch } from "react-tabtab/lib/helpers/move";
import * as customStyle from "react-tabtab/lib/themes/material-design";

import Search from "../components/search";
import { get } from "../../shared/request";
import logo from "../../static/logo-white.png";
import iconCircle from "../../static/info-circle.png";
import "./lib.css";
import style from "./index.less";

import Header from "../components/header";

const createPanel = (url, title) => (
  <Panel>
    <iframe
      title={title}
      src={url}
      width="100%"
      height="800"
      frameborder="0"
    />
  </Panel>
);


export default compose(
  setDisplayName(__filename),
  withState("cover", "setCover", {}),
  withState("activeIndex", "setActiveIndex", 0),
  withState("tabs", "setTabs", []),
  withState("result", "setResult", []),
  withState("keyword", "setKeyword", ""),
  withState("searching", "setSearching", false),
  withState("height", "setHeight", 420),
  withHandlers({
    onResize: ({ setHeight }) => () => {
      var height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      setHeight(height - 148);
    }
  }),

  withHandlers({
    onView: () => title => {
      if (_hmt) {
        _hmt.push(["_trackEvent", "搜索", "关键字", title, 1]);
      }
    }
  }),
  withHandlers({
    onSearch: ({ setKeyword, setSearching, onView }) => value => {
      const q = trim(value);
      setKeyword(q);

      if (!isEmpty(q)) {
        onView(value);
        document.title = value;
        setSearching(true);
      } else {
        document.title = "Research - 探索未知";
      }
    },
    handleTabSequenceChange: ({ setActiveIndex, tabs, setTabs }) => ({
      oldIndex,
      newIndex
    }) => {
      setActiveIndex(newIndex);
      setTabs(simpleSwitch(tabs, oldIndex, newIndex));
    }
  }),
  lifecycle({
    componentDidMount() {
      const { setCover } = this.props;
      get(`/cover`).then(({ data }) => {
        setCover(data);
      });
      const search = document.location.search.substring(1);
      const { onSearch, setSearching } = this.props;
      const keywords = QueryString.parse(search);

      onSearch(keywords.q);
      setSearching(true);
      this.props.onResize();
      window.onresize = this.props.onResize;
    }
  }),
  withHandlers({
    onSearch: ({ onSearch }) => q => {
      window.location.search = `?q=${q}`;
      onSearch(q);
    }
  }),
)(({ 
  cover, 
  onSearch, 
  keyword, 
  setKeyword,
  height,
  searching,
  activeIndex,
  setActiveIndex,
  handleTabSequenceChange,
 }) =>
  keyword ? (
    <div>
      <div className={style.Header}>
        <Header onSearch={onSearch} keyword={keyword} setKeyword={setKeyword} />
      </div>
      <div className={style.Content} style={{ minHeight: height || 420 }}>
        <div className={style.LinkWrap}>
          <a
            title="Github"
            href={`https://github.com/search?q=${keyword}`}
            target="blank"
            className={style.Link}
          >
            Github
          </a>
          <a
            title="知乎"
            href={`https://www.zhihu.com/search?type=content&q=${keyword}`}
            target="blank"
            className={style.Link}
          >
            知乎
          </a>
          <a
            title="微信"
            href={`https://weixin.sogou.com/weixin?p=01030402&query=${keyword}&type=2&ie=utf8`}
            target="blank"
            className={style.Link}
          >
            微信
          </a>
          <a
            title="Google"
            href={`https://www.google.com.hk/search?safe=strict&source=hp&q=${keyword}&oq=${keyword}`}
            target="blank"
            className={style.Link}
          >
            Google
          </a>
          <a
            title="简书"
            href={`https://www.jianshu.com/search?q=${keyword}`}
            target="blank"
            className={style.Link}
          >
            简书
          </a>
          <a
            title="掘金"
            href={`https://juejin.im/search?query=${keyword}&type=all`}
            target="blank"
            className={style.Link}
          >
            掘金
          </a>
        </div>
        {searching && (
          <Tabs
            activeIndex={activeIndex}
            onTabChange={setActiveIndex}
            onTabSequenceChange={handleTabSequenceChange}
            customStyle={customStyle}
            showModalButton={false}
          >
            <DragTabList>
              <DragTab>多吉</DragTab>
              <DragTab>百度</DragTab>
              <DragTab>微博</DragTab>
              <DragTab>SegmentFault</DragTab>
              <DragTab>翻译</DragTab>
              <DragTab>搜课</DragTab>
              <DragTab>Yarn</DragTab>
            </DragTabList>
            <PanelList>
              {createPanel(`https://dogedoge.com/results?q=${keyword}`, "多吉")}
              {createPanel(`https://www.baidu.com/s?wd=${keyword}`, "百度")}

              {createPanel(
                `https://s.weibo.com/weibo/${keyword}?topnav=1&wvr=6`,
                "微博"
              )}
              {createPanel(
                `https://segmentfault.com/search?q=${keyword}`,
                "SegmentFault"
              )}
              {createPanel(`https://fanyi.baidu.com/#en/zh/${keyword}`, "翻译")}

              {createPanel(`http://souke.xyz/result#q=${keyword}`, "搜课")}

              {createPanel(
                `https://www.yarnpkg.com/zh-Hans/packages?q=${keyword}`,
                "yarn"
              )}
            </PanelList>
          </Tabs>
        )}
      </div>
      <footer className={style.Footer}>
        © 2019 Research Created by Andy | 蜀ICP备18015889号-1
      </footer>
    </div>
  ) : (
    <div
      className={style.SearchPage}
      style={{
        backgroundImage: `url(${prop("link")(cover) ||
          "https://cn.bing.com/th?id=OHR.GodsGarden_EN-CN6732844646_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hpå"})`
      }}
    >
      <div className={style.SearchBar}>
        <div className={style.LogoWrap}>
          <img className={style.Logo} src={logo} alt="" />
          <a target="blank" href={prop("search")(cover)}>
            <img src={iconCircle} className={style.InfoIcon} />
          </a>
        </div>
        <Search onSearch={onSearch} placeholder="javascript" />
      </div>
    </div>
  )
);
