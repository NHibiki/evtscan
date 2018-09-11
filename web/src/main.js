// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import VueJsonPretty from 'vue-json-pretty';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes);
library.add(faAngleLeft);
library.add(faAngleRight);

Vue.component('fa', FontAwesomeIcon);
Vue.component('vue-json-pretty', VueJsonPretty);

import '../node_modules/loaders.css/loaders.min.css';
import './global.scss';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
