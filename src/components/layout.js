import React from 'react';
import {
  compose,
  setDisplayName,
} from 'recompose';
import Layout from 'antd/lib/layout';

import styles from "./style.module.less";
import HeaderBar from "./header";

const { Header, Content, Footer } = Layout;

export default compose(
  setDisplayName(__filename),
)(({
  className,
  children,
}) => (
    <Layout className={className}>
      <Header className={styles.Header}>
        <HeaderBar />
      </Header>
      <Content className={styles.Content}>
         {children}
      </Content>
      <Footer className={styles.Footer}>搜课 ©2019 Created by Andy | 蜀ICP备18015889号-1</Footer>
    </Layout>
));
