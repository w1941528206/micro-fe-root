import * as singleSpa from 'single-spa';

/**
 * 加载css
 */
function createStylesheetLink(ident, href) {
  const headEle = document.getElementsByTagName('head')[0];
  const linkEle = document.createElement('link');
  linkEle.id = `${ident}-stylesheet`;
  linkEle.rel = 'stylesheet';
  linkEle.href = href;
  headEle.append(linkEle);
}

/**
 * 移除css
 */
function getStylesheetLink(ident) {
  return document.getElementById(`${ident}-stylesheet`);
}

function removeStylesheetLink(ident) {
  const linkEle = getStylesheetLink(ident);
  if (linkEle) linkEle.remove();
}

// 注册微前端服务
/* 
    注册所用函数;
    return 一个模块对象（singleSpa），模块对象来自于要加载的js导出（子项目）;
    如果这个函数不需要在线引入，只需要本地引入一块加载：
    () => import('xxx/main.js')
*/
singleSpa.registerApplication(
  'layout',
  () => import('../src/index'),
  (location) => location.pathname.startsWith('/')
);

singleSpa.registerApplication(
  'tool',
  async () => {
    let lifeCycles01 = await System.import('http://120.25.224.38/tool/tool.js');
    // let lifeCycles01 = await System.import('http://0.0.0.0:8089/fulllink-412ddd2af6359085e1f5.js');
    console.log(lifeCycles01);
    return lifeCycles01;
  },
  (location) => location.pathname.startsWith('/tool')
);

singleSpa.registerApplication(
  'delve',
  async () => {
    let lifeCycles02 = await System.import('http://120.25.224.38/delve/delve.js');
    // let lifeCycles02 = await System.import('http://localhost:8088/delve.js');
    const { mount, unmount } = lifeCycles02;
    mount.unshift(async () => {
      createStylesheetLink('delve', 'http://120.25.224.38/delve/delve.css');
      return Promise.resolve();
    });
    unmount.unshift(() => {
      removeStylesheetLink('delve');
      return Promise.resolve();
    });
    return lifeCycles02;
  },
  (location) => location.pathname.startsWith('/delve')
);

singleSpa.start(); // 启动