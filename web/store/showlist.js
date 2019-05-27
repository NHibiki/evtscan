import { getRecent } from '~/lib/api';
import Util from '~/lib/util';

export const state = () => ({
    tableHeader: ['Transaction ID', 'Block Num', 'Pending', 'Timestamp'],
    name: "Transactions",
    tid: "trx",
    endpoint: "/transaction",
    data: null,
    filter: null,
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
    updateFilterMut: (state, filter) => {
        state.filter = filter;
    },
    changeEndpointMut: (state, {id, tab}) => {
        state.activeTab = id;
        state.endpoint = tab.endpoint;
        state.page = 0;
        state.filter = null;
        state.data = null;
        state.dataLink = null;
    },
    resetData: (state, path) => {
        let tableHeader = ['Transaction ID', 'Block Num', 'Pending', 'Timestamp'];
        let name = "Transactions";
        let id = path;
        if (path === 'block') {
            tableHeader = ['Block Num', 'Block ID', 'Producer', 'Timestamp'];
            name = "Blocks";
        } else if (path === 'fungible') {
            tableHeader = ['Name', 'Sym ID', 'Creator', 'Timestamp'];
            name = "Fungibles";
        } else if (path === 'domain') {
            tableHeader = ['Name', 'Creator', 'Timestamp'];
            name = "Domains";
        } else if (path === 'group') {
            tableHeader = ['Name', 'Key', 'Threshold'];
            name = "Groups";
        } else if (path == 'nonfungible') {
            tableHeader = ['Domain', 'Count', 'Latest Issued'];
            name = "Non-Fungibles";
        } else {
            id = "trx";
        }
        state.tableHeader = tableHeader;
        state.name = name;
        state.tid = id;
        state.endpoint = "/" + name.substr(0, name.length - 1).toLocaleLowerCase().replace(/-/g, "");
        state.data = null;
        state.filter = null;
        state.page = 0;
        state.dataLink = [];
    },
};

export const actions = {
    async softRefresh({ commit, dispatch, state }, path) {
        if (path === state.tid) return;
        commit('resetData', path);
        await dispatch('refreshData');
    },
    async refreshData({ commit, state }, { filter=null, page=null } = {}) {
        if (page !== null) commit('updatePageMut', page);
        if (filter !== state.filter) commit('updateFilterMut', filter);
        let recvData = (await getRecent(state.endpoint, page || state.page, 20, null, filter)).data.data;
        commit('refreshDataMut', Util[`tablize${state.name.replace(/-/g, "")}`](recvData));
    }, 
    async more({ commit, dispatch, state }, adder) {
        if (!adder) return;
        if (state.data.length < 20 && adder > 0) return;
        if (state.page + adder < 0) return;  
        commit('updatePageMut', state.page + adder);
        await dispatch('refreshData', { filter: state.filter });
    },
    async changeEndpoint({ commit, dispatch }, updateInfo) {
        commit('changeEndpointMut', updateInfo);
        await dispatch('refreshData');
    },
};