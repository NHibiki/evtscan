import { getDetail, getActionOnFungible } from '~/lib/api';
import { tablizeFungible, tablizeTrxAction } from '~/lib/util';

export const state = () => ({
    id: "",
    page: 0,
    pagesize: 15,
    actions: null,
    actionsData: [],
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
    openActionModal(state, i) {
        state.showData = state.actionsData[i || 0] || {}
        state.showModal = true
    },
    updateDataMut: (state, thing={}) => {
        Object.keys(thing).forEach(k => {
            state[k] = thing[k];
        });
    },
    updateActionsMut: (state, {page, actions=null, actionsData=null}) => {
        state.page = page;
        state.actions = actions;
        state.actionsData = actionsData;
    }
};

export const actions = {
    async updateData({ commit, state, dispatch }) {
        let recvData = (await getDetail("fungible", state.id)).data.data;
        let [data, detailedData, detailedActions, metaData] = tablizeFungible(recvData);
        commit('updateDataMut', {data, detailedData, detailedActions, metaData});
        return dispatch('updateActionData');
    },
    async moreActions({ commit, dispatch, state }, adder) {
        if (!adder) return;
        if (state.actions && state.actions.length < state.pagesize && adder > 0) return;
        if (state.page + adder < 0) return;  
        commit('updateActionsMut', {page: state.page + adder});
        await dispatch('updateActionData');
    },
    async updateActionData ({ commit, state }) {
        let data = await getActionOnFungible(state.id, state.page, state.pagesize);
        let [actions, actionsData] = tablizeTrxAction(data.data.data);
        commit('updateActionsMut', {page: state.page, actions, actionsData});
    }
};