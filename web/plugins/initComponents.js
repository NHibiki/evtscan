import Vue from 'vue';
import VueJsonPretty from '~/components/JsonPretty';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faTimes, faAngleLeft, faAngleRight, faBars, faHeart, faAngleDown, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'vue-js-toggle-button/dist/ssr.index'

library.add(faSearch);
library.add(faTimes);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(faBars);
library.add(faHeart);
library.add(faAngleDown);
library.add(faRedoAlt);

Vue.component('fa', FontAwesomeIcon);
Vue.component('vue-json-pretty', VueJsonPretty);

Vue.use(Button);

Vue.config.productionTip = false;