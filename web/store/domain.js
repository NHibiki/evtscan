import { getDetail } from '~/lib/api';
import { tablizeDomain } from '~/lib/util';

export const state = () => ({
    id: "",
    data: null,
    detailedData: null,
    detailedActions: [],
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
    openModal(state, i) {
        state.showData = state.detailedActions[i || 0] || {}
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
        let recvData = (await getDetail("domain", state.id)).data.data;
        let [data, detailedData, detailedActions] = tablizeDomain(recvData);
        commit('updateDataMut', {data, detailedData, detailedActions});
    }
};
