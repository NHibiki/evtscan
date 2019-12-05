import { getDetailWithPage } from '~/lib/api';
import { tablizeNonfungibleToken } from '~/lib/util';

export const state = () => ({
    id: "",
    page: 0,
    pagesize: 15,
    data: null,
    metas: null,
    metaData: [],
    showData: {},
    showModal: false
});

export const mutations = {
    resetData: (state, id) => {
        state.id = id;
        state.data = null;
        state.metas = null;
    },
    closeModal(state) {
        state.showModal = false;
    },
    openModal(state, i) {
        state.showData = state.metaData[i || 0] || {};
        state.showModal = true;
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
        let recvData = (await getDetailWithPage("nonfungible/token", state.id, state.page, state.pagesize)).data.data;
        const [data, metas, metaData] = tablizeNonfungibleToken(recvData);
        commit('updateDataMut', {data, metas, metaData});
    },
    async more({ commit, dispatch, state }, adder) {
        if (!adder) return;
        if (!state.metaData) return;
        if (state.metaData.length < state.pagesize && adder > 0) return;
        if (state.page + adder < 0) return;  
        commit('updatePageMut', state.page + adder);
        await dispatch('updateData');
    }
};