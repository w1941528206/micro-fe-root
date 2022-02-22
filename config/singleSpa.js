import * as singleSpa from 'single-spa';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({ basename: '/' });

/**
 * runScript 一个promise同步方法。可以代替创建一个script标签，然后加载服务
 */
const runScript = async (url) => {
  // 加载css同理
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    const firstScript = document.getElementsByTagName('script')[0];
    console.log(firstScript, 'this is');
    firstScript.parentNode.insertBefore(script, firstScript);
  });
};

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

// singleSpa.registerApplication(
//   'project01',
//   async () => {
//     console.log('ready');
//     let lifeCycles = await System.import('http://localhost:8088/project01.js');
//     console.log(lifeCycles, 'this is life');
//   },
//   (location) => location.pathname.startsWith('/react')
// );
singleSpa.registerApplication(
  'project01',
  async () => {
    let lifeCycles = await System.import('http://localhost:8088/project01.js');
    // let lifeCycles = await System.import('http://localhost:8089/fulllink-c2c7fb13d32497618ad8.js');
    console.log(lifeCycles);
    return lifeCycles;
  },
  (location) => location.pathname.startsWith('/react')
);

singleSpa.start(); // 启动