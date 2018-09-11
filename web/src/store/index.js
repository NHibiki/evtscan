import Vue from 'vue'
import Vuex from 'vuex'

import Index from './modules/Index';
import Block from './modules/Block';
import Trx from './modules/Trx';
import ShowList from './modules/ShowList';
import GridList from './modules/GridList';

Vue.use(Vuex)
let stateStore = null;

export function resetStore() {
    return stateStore = new Vuex.Store({
        modules: {
            Index: Index(),
            Block: Block(),
            Trx: Trx(),
            ShowList: ShowList(),
            GridList: GridList(),
        },
    });
}

if (!stateStore) resetStore();
export default stateStore;