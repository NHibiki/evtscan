import { getChainInfo } from '~/lib/api';

export const state = () => ({
    minHeight: 0,
    trxEndpoint: 'transaction',
    activeTab: 'all',
    chain: {}
});

export const mutations = {
    changeMinHeight: (state, height) => {
        state.minHeight = height;
    },
    changeEndpoint: (state, {id, tab}) => {
        state.activeTab = id;
        state.trxEndpoint = tab.endpoint;
    },
    updateChainInfoMut: (state, chain) => {
        state.chain = chain;
    },
};

export const actions = {
    async updateChainInfo({ commit }) {
        let recvData = (await getChainInfo()).data.data;
        commit('updateChainInfoMut', recvData);
    },
};