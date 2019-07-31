import React from "react";
import {
  compose,
  setDisplayName,
  withHandlers,
  lifecycle,
  withState
} from "recompose";
import QueryString from "query-string";
import {
  Tabs,
  DragTabList,
  DragTab,
  PanelList,
  Panel
} from "react-tabtab/lib/";
import { simpleSwitch } from "react-tabtab/lib/helpers/move";
import * as customStyle from "react-tabtab/lib/themes/material-design";

import Search from "./search";
import logo from "../static/logo-white.png";
import style from "./index.less";
import Header from "./header";
import { links, tabs } from "./config";

const keywordLength = str => str && str.trim() && str.trim().length;

const createPanel = (url, title) => (
  <Panel>
    <iframe title={title} src={url} width="100%" height="800" frameborder="0" />
  </Panel>
);

export default compose(
  setDisplayName(__filename),
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
    onSearch: ({ setKeyword, setSearching }) => value => {
      const q = value;
      setKeyword(q);

      if (keywordLength(q)) {
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
  })
)(
  ({
    onSearch,
    keyword,
    setKeyword,
    height,
    searching,
    activeIndex,
    setActiveIndex,
    handleTabSequenceChange
  }) =>
    keyword ? (
      <div>
        <div className={style.Header}>
          <Header
            onSearch={onSearch}
            keyword={keyword}
            setKeyword={setKeyword}
          />
        </div>
        <div className={style.Content} style={{ minHeight: height || 420 }}>
          <div className={style.LinkWrap}>
            {links(keyword).map(({ link, title }) => (
              <a
                title={title}
                key={link}
                href={link}
                target="blank"
                className={style.Link}
              >
                {title}
              </a>
            ))}
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
                {tabs().map(({ title }) => (
                  <DragTab key={title}>{title}</DragTab>
                ))}
              </DragTabList>
              <PanelList>
                {tabs(keyword).map(({ title, link }) => (
                  <Panel key={link}>
                    <iframe
                      title={title}
                      src={link}
                      width="100%"
                      height="800"
                      frameBorder="0"
                    />
                  </Panel>
                ))}
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
          backgroundImage:
            "url(https://cn.bing.com/th?id=OHR.TrilliumLake_EN-CN1200736040_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp)"
        }}
      >
        <div className={style.SearchBar}>
          <div className={style.LogoWrap}>
            <img className={style.Logo} src={logo} alt="" />
          </div>
          <Search onSearch={onSearch} placeholder="javascript" />
        </div>
      </div>
    )
);
