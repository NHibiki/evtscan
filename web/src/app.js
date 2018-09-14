// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'

import VueJsonPretty from './components/subcomponents/JsonPretty';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faAngleLeft, faAngleRight, faBars, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(faBars);
library.add(faHeart);

Vue.component('fa', FontAwesomeIcon);
Vue.component('vue-json-pretty', VueJsonPretty);

import '../node_modules/loaders.css/loaders.min.css';
import './global.scss';

Vue.config.productionTip = false

/* eslint-disable no-new */
export function createApp(el='#app') {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    el,
    router,
    store,
    render: h => h(App), // Important
  });
  return { app, router, store };
}

export function injectedApp(router, store, el='#app') {
  return new Vue({
    el,
    router,
    store,
    render: h => h(App), // Important
  });
}