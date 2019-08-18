import { getRecent } from '~/lib/api';

export const state = () => ({
    items: {},
    loading: {},
    nomoreLoading: {},
});

export const mutations = {
    flushDataMut: (state, endpoint) => {
        state.items[endpoint] = null;
        state.nomoreLoading[endpoint] = null;
        state.items = Object.assign({}, state.items);
    },
    getDataListMut: (state, {endpoint, items, start=false}) => {
        if (!start) state.items[endpoint] = state.items[endpoint] ? [...state.items[endpoint], ...items] : items;
        else state.items[endpoint] = state.items[endpoint] ? [...items, ...state.items[endpoint]] : items;
        state.items = Object.assign({}, state.items);
    },
    setLoadingState: (state, {endpoint, isOrNot, noMore}) => {
        state.loading[endpoint] = isOrNot;
        state.loading = Object.assign({}, state.loading);
        if (noMore) state.nomoreLoading[endpoint] = true;
    }
};

export const actions = {
    async getDataList({ commit, state }, {endpoint, more}) {
        if (!more) commit('flushDataMut', endpoint);
        commit('setLoadingState', {endpoint, isOrNot:true});
        let since = null;
        if (more && state.items[endpoint] && state.items[endpoint].length) {
            since = state.items[endpoint][state.items[endpoint].length-1].timestamp || null;
            if (since) since = new Date(new Date(since).getTime() - 1).toISOString();
        }
        let items = (await getRecent(endpoint, 0, 15, since)).data.data;
        let noMore = items ? (items.length < 15) : true;
        commit('getDataListMut', {endpoint, items});
        commit('setLoadingState', {endpoint, isOrNot:false, noMore});
    },
    async syncDataList({ commit, state }, {endpoint}) {
        commit('setLoadingState', {endpoint, isOrNot:true});
        let from = null;
        if (state.items[endpoint] && state.items[endpoint].length) {
            from = state.items[endpoint][0].timestamp || null;
            if (from) from = new Date(new Date(from).getTime() + 1).toISOString();
        }
        let items = (await getRecent(endpoint, 0, 15, null, null, from)).data.data;
        commit('getDataListMut', {endpoint, items, start: true});
        commit('setLoadingState', {endpoint, isOrNot:false});
    }
};