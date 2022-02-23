import React, {
  useState
} from 'react';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom';
import {
  RightOutlined,
  LeftOutlined,
  DribbbleOutlined,
  SketchOutlined
} from '@ant-design/icons';
import {
  Layout,
  Menu
} from 'antd';
import styles from './index.less';

const {
  Header,
  Sider,
  Content,
  Footer
} = Layout;
const { SubMenu } = Menu;

const App = () => {
  const [collapsed, setCollapse] = useState(true);

  return (
    <Layout className={styles.app}>
      <Sider
        className={styles.sider}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div className={styles.logo}>
          <span>root</span>
        </div>
        <Router>
          <Menu
            className={styles.menuContent}
            mode="inline"
          >
            <Menu.Item
              key="1"
              icon={<DribbbleOutlined />}
              title="子应用01"
            >
              <Link to="/tool">react 子应用-01</Link>
            </Menu.Item>
            <Menu.Item
              key="2"
              icon={<SketchOutlined />}
              title="子应用02"
            >
              <Link to="/delve">react 子应用-02</Link>
            </Menu.Item>
          </Menu>
        </Router>
        <div
          className={styles.siderFooter}
          onClick={() => { setCollapse(!collapsed) }}
        >
          {
            collapsed ? <RightOutlined /> : <LeftOutlined />
          }
        </div>
      </Sider>
      <Layout>
        <Header className={styles.header} style={{ padding: 0 }}>

        </Header>
        <Content className={styles.content}>
          <div id="micro-project-content" />
        </Content>
      </Layout>
    </Layout >
  )
};

export default App;
