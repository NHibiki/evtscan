import { getRecent } from '~/lib/api';
import Util from '~/lib/util';

export const state = () => ({
    tableHeader: ['transactionid', 'blocknum', 'pending', 'timestamp'],
    name: "transactions",
    tid: "NULL",
    endpoint: "/transaction",
    data: null,
    filter: null,
    page: 0,
    activeTab: 'all',
    dataLink: [],
    updating: false
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
        let tableHeader = ['transactionid', 'blocknum', 'pending', 'timestamp'];
        let name = "transactions";
        let id = path;
        if (path === 'block') {
            tableHeader = ['blocknum', 'blockid', 'producer', 'timestamp'];
            name = "blocks";
        } else if (path === 'fungible') {
            tableHeader = ['name', 'symbolid', 'creator', 'timestamp'];
            name = "fungibles";
        } else if (path === 'domain') {
            tableHeader = ['name', 'creator', 'timestamp'];
            name = "domains";
        } else if (path === 'group') {
            tableHeader = ['name', 'key', 'threshold'];
            name = "groups";
        } else if (path == 'nonfungible') {
            tableHeader = ['domain', 'count', 'latestissued'];
            name = "nonfungibles";
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
    updating: (state, update) => {
        state.updating = update;
    }
};

export const actions = {
    async softRefresh({ commit, dispatch, state }, path) {
        if (path === state.tid && state.data && !state.updating) return;
        commit('resetData', path);
        await dispatch('refreshData');
    },
    async refreshData({ commit, state }, { filter=null, page=null } = {}) {
        if (state.updating) return;
        commit('updating', true);
        try {
            if (page !== null) commit('updatePageMut', page);
            if (filter !== state.filter) commit('updateFilterMut', filter);
            const recvData = (await getRecent(state.endpoint, page || state.page, 20, null, filter)).data.data;
            const tablizeName = `tablize${state.name[0].toLocaleUpperCase()}${state.name.substr(1)}`;
            commit('refreshDataMut', Util[tablizeName](recvData));
        } catch(err) {}
        commit('updating', false);
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