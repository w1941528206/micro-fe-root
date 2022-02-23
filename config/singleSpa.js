import * as singleSpa from 'single-spa';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory({ basename: '/' });

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
  'project01',
  async () => {
    let lifeCycles01 = await System.import('http://120.25.224.38/tool/tool.js');
    console.log(lifeCycles01);
    return lifeCycles01;
  },
  (location) => location.pathname.startsWith('/tool')
);

singleSpa.registerApplication(
  'project02',
  async () => {
    let lifeCycles02 = await System.import('http://120.25.224.38/delve/delve.js');
    console.log(lifeCycles02);
    return lifeCycles02;
  },
  (location) => location.pathname.startsWith('/delve')
);

singleSpa.start(); // 启动