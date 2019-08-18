import { getDetail, getActionOnTrx } from '~/lib/api';
import { tablizeTrx, tablizeTrxAction } from '~/lib/util';

export const state = () => ({
    id: "",
    data: null,
    keys: null,
    sigs: null,
    actions: null,
    trxData: null,
    actionsData: [],
    showData: {},
    showModal: false
});

export const mutations = {
    resetData: (state, id) => {
        state.id = id;
        state.data = null;
        state.keys = null;
        state.sigs = null;
        state.actions = null;
        state.trxData = null;
    },
    closeModal(state) {
        state.showModal = false
    },
    openModal(state, i) {
        state.showData = state.actionsData[i || 0] || {}
        state.showModal = true
    },
    updateDataMut: (state, thing={}) => {
        Object.keys(thing).forEach(k => {
            state[k] = thing[k];
        });
    }
};

export const actions = {
    updateData: ({ commit, state }) => {
        return Promise.all([getActionOnTrx(state.id)
                .then(recvData => {
                    let [actions, actionsData] = tablizeTrxAction(recvData.data.data);
                    commit('updateDataMut', {actions, actionsData, showData: actionsData[0]});
                    return Promise.resolve(true);
                }),
            getDetail("transaction", state.id)
                .then(recvData => {
                    let [data, keys, sigs] = tablizeTrx(recvData.data.data);
                    commit('updateDataMut', {data, keys, sigs});
                    return Promise.resolve(true);
                })])
            .catch(err => { console.error(err); })
    }
};