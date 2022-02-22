import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './app'

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: (props: any) => {
    return <App {...props} />;
  },
  domElementGetter: () => document.getElementById('react-content')
});

export const bootstrap = [reactLifecycles.bootstrap];

export const mount = [reactLifecycles.mount];

export const unmount = [reactLifecycles.unmount];
