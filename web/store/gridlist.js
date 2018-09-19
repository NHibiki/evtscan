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
    getDataListMut: (state, {endpoint, items}) => {
        state.items[endpoint] = state.items[endpoint] ? [...state.items[endpoint], ...items] : items;
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
            since = state.items[endpoint][state.items[endpoint].length-1].created_at || null;
            if (since) since = new Date(new Date(since).getTime() - 1).toISOString();
        }
        let items = (await getRecent(endpoint, 0, 15, since)).data.data;
        let noMore = items ? (items.length < 15) : true;
        commit('getDataListMut', {endpoint, items});
        commit('setLoadingState', {endpoint, isOrNot:false, noMore});
    }
};