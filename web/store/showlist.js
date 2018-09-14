import { getRecent } from '~/lib/api';
import Util from '~/lib/util';

export const state = () => ({
    tableHeader: ['Transaction ID', 'Block Num', 'Pending', 'Timestamp'],
    name: "Transactions",
    endpoint: "/transaction",
    data: null,
    page: 0,
    activeTab: 'all',
    dataLink: [],
});

export const mutations = {
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
    resetData: (state, path) => {
        let tableHeader = ['Transaction ID', 'Block Num', 'Pending', 'Timestamp'];
        let name = "Transactions";
        if (path === '/block') {
            tableHeader = ['Block Num', 'Block ID', 'Producer', 'Timestamp'];
            name = "Blocks";
        } else if (path === '/fungible') {
            tableHeader = ['Name', 'Sym ID', 'Creator', 'Timestamp'];
            name = "Fungibles";
        } else if (path === '/domain') {
            tableHeader = ['Name', 'Creator', 'Timestamp'];
            name = "Domains";
        }
        state.tableHeader = tableHeader;
        state.name = name;
        state.endpoint = "/" + name.substr(0, name.length - 1).toLocaleLowerCase();
        state.data = null;
        state.page = 0;
        state.dataLink = [];
    },
};

export const actions = {
    async refreshData({ commit, state }) {
        let recvData = (await getRecent(state.endpoint, state.page, 20)).data.data;
        console.log(`tablize${state.name}`)
        commit('refreshDataMut', Util[`tablize${state.name}`](recvData));
    }, 
    async more({ commit, dispatch, state }, adder) {
        if (!adder) return;
        if (state.data.length < 20 && adder > 0) return;
        if (state.page + adder < 0) return;  
        commit('updatePageMut', state.page + adder);
        await dispatch('refreshData');
    },
    async changeEndpoint({ commit, dispatch }, updateInfo) {
        commit('changeEndpointMut', updateInfo);
        await dispatch('refreshData');
    },
};