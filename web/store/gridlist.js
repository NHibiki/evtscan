import { getRecent } from '~/lib/api';

export const state = () => ({
    items: {},
});

export const mutations = {
    flushDataMut: (state, endpoint) => {
        state.items[endpoint] = null;
        state.items = Object.assign({}, state.items);
    },
    getDataListMut: (state, {endpoint, items}) => {
        state.items[endpoint] = items;
        state.items = Object.assign({}, state.items);
    },
};

export const actions = {
    async getDataList({ commit, state }, endpoint) {
        commit('flushDataMut', endpoint);
        let items = (await getRecent(endpoint)).data.data;
        commit('getDataListMut', {endpoint, items});
    }
};