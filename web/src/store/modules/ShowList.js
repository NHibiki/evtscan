import { getRecent } from '@/lib/api';
import Util from '@/lib/util';

export default () => ({
    namespaced: true,
    state: {
        tableHeader: ['Transaction ID', 'Block Num', 'Pending', 'Timestamp'],
        name: "Transactions",
        endpoint: "/transaction",
        data: null,
        page: 0,
        activeTab: 'all',
        dataLink: [],
    },
    mutations: {
        refreshDataMut: (state, [data, dataLink]) => {
            state.data = data;
            state.dataLink = dataLink;
        },
        updatePageMut: (state, page) => {
            state.page = page;
            state.data = null;
            state.dataLink = null;
        },
        changeEndpointMut: (state, {id, tab}) => {
            state.activeTab = id;
            state.endpoint = tab.endpoint;
            state.page = 0;
            state.data = null;
            state.dataLink = null;
        },
        resetData: (state, name) => {
            let tableHeader = ['Transaction ID', 'Block Num', 'Pending', 'Timestamp'];
            if (name === 'Blocks') {
                tableHeader = ['Block Num', 'Block ID', 'Producer', 'Timestamp'];
            } else if (name === 'Fungibles') {
                tableHeader = ['Name', 'Sym ID', 'Creator', 'Timestamp'];
            } else if (name === 'Domains') {
                tableHeader = ['Name', 'Creator', 'Timestamp'];
            }
            state.tableHeader = tableHeader;
            state.name = name;
            state.endpoint = "/" + name.substr(0, name.length - 1).toLocaleLowerCase();
            state.data = null;
            state.page = 0;
            state.dataLink = [];
        },
    },
    actions: {
        async refreshData({ commit, state }) {
            getRecent(state.endpoint, state.page, 20)
                .then(data => { commit('refreshDataMut', Util[`tablize${state.name}`](data.data.data)) })
                .catch(err => { console.error(err); })
        }, 
        more({ commit, dispatch, state }, adder) {
            if (!adder) return;
            if (state.data.length < 20 && adder > 0) return;
            if (state.page + adder < 0) return;  
            commit('updatePageMut', state.page + adder);
            return dispatch('refreshData');
        },
        changeEndpoint({ commit, dispatch }, updateInfo) {
            commit('changeEndpointMut', updateInfo);
            return dispatch('refreshData');
        },
    }
})