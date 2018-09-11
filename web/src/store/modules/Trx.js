import { getDetail, getActionOnTrx } from '@/lib/api';
import { tablizeTrx, tablizeTrxAction } from '@/lib/util';

export default () => ({
    namespaced: true,
    state: {
        id: "",
        data: null,
        keys: null,
        sigs: null,
        actions: null,
        trxData: null,
        actionsData: [],
        showData: {},
        showModal: false
    },
    mutations: {
        resetData: (state, id) => {
            state.id = id;
        },
        closeModal(state) {
            state.showModal = false
        },
        openModal(state, i) {
            state.showData = state.actionsData[i || 0] || {}
            state.showModal = true
        },
        updateDataMut: (state, thing) => {
            Object.keys(thing).forEach(k => {
                state[k] = thing[k];
            });
        }
    },
    actions: {
        updateData: ({ commit, state }) => {
            getDetail("transaction", state.id)
                .then(recvData => {
                    let [data, keys, sigs] = tablizeTrx(recvData.data.data);
                    commit('updateDataMut', {data, keys, sigs});
                })
                .catch(err => { console.error(err); });
            getActionOnTrx(state.id)
                .then(recvData => {
                    let [actions, actionsData] = tablizeTrxAction(recvData.data.data);
                    commit('updateDataMut', {actions, actionsData, showData: actionsData[0]});
                })
                .catch(err => { console.error(err); });
        }
    }
})