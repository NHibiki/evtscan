import Vue from 'vue'
import Vuex from 'vuex'

import App from './modules/App';
import Index from './modules/Index';
import Block from './modules/Block';
import Trx from './modules/Trx';
import Fungible from './modules/Fungible';
import Domain from './modules/Domain';
import ShowList from './modules/ShowList';
import GridList from './modules/GridList';

Vue.use(Vuex)

export function createStore() {
    return new Vuex.Store({
        modules: {
            App: App(),
            Index: Index(),
            Block: Block(),
            Trx: Trx(),
            Fungible: Fungible(),
            Domain: Domain(),
            ShowList: ShowList(),
            GridList: GridList(),
        },
    });
}