import { getDetailWithPage } from '~/lib/api';
import { tablizeNonFungible } from '~/lib/util';

export const state = () => ({
    id: "",
    page: 0,
    pagesize: 15,
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
    },
    updatePageMut: (state, page) => {
        state.page = page;
        state.distributeData = null;
    }
};

export const actions = {
    async updateData({ commit, state }) {
        let recvData = (await getDetailWithPage("nonfungible", state.id, state.page, state.pagesize)).data.data;
        let [data, detailedData, detailedActions, distributeData] = tablizeNonFungible(recvData);
        commit('updateDataMut', {data, detailedData, detailedActions, distributeData});
    },
    async more({ commit, dispatch, state }, adder) {
        if (!adder) return;
        if (!state.distributeData) return;
        if (state.distributeData.length < state.pagesize && adder > 0) return;
        if (state.page + adder < 0) return;  
        commit('updatePageMut', state.page + adder);
        await dispatch('updateData');
    }
};