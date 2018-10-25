import { getDetail } from '~/lib/api';
import { tablizeNonFungible } from '~/lib/util';

export const state = () => ({
    id: "",
    data: null,
    detailedData: null,
    detailedActions: [],
    distributeData: null,
    showData: {},
    showModal: false
});

export const mutations = {
    resetData: (state, id) => {
        state.id = id;
        state.data = null;
        state.detailedData = null;
    },
    closeModal(state) {
        state.showModal = false
    },
    openDetailedModal(state, i) {
        state.showData = state.detailedActions[i || 0] || {}
        state.showModal = true
    },
    openDistributeModal(state, i) {
        state.showData = state.distributeData[i] || {}
        state.showModal = true
    },
    updateDataMut: (state, thing={}) => {
        Object.keys(thing).forEach(k => {
            state[k] = thing[k];
        });
    }
};

export const actions = {
    async updateData({ commit, state }) {
        let recvData = (await getDetail("nonfungible", state.id)).data.data;
        let [data, detailedData, detailedActions, distributeData] = tablizeNonFungible(recvData);
        commit('updateDataMut', {data, detailedData, detailedActions, distributeData});
    }
};