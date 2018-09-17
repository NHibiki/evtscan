import { getDetail } from '~/lib/api';
import { tablizeDomain } from '~/lib/util';

export const state = () => ({
    id: "",
    data: null,
    detailedData: null,
    detailedActions: [],
    metaData: null,
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
    openMetaModal(state, i) {
        state.showData = state.metaData[Object.keys(state.metaData)[i || 0]] || {}
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
        let [data, detailedData, detailedActions, metaData] = tablizeDomain(recvData);
        commit('updateDataMut', {data, detailedData, detailedActions, metaData});
    }
};
