import { getDetail } from '@/lib/api';
import { tablizeFungible } from '@/lib/util';

export default () => ({
    namespaced: true,
    state: {
        id: "",
        data: null,
        detailedData: null,
        detailedActions: [],
        showData: {},
        showModal: false
    },
    mutations: {
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
        updateDataMut: (state, thing) => {
            Object.keys(thing).forEach(k => {
                state[k] = thing[k];
            });
        }
    },
    actions: {
        updateData: ({ commit, state }) => {
            return getDetail("fungible", state.id)
                .then(recvData => {
                    let [data, detailedData, detailedActions] = tablizeFungible(recvData.data.data);
                    commit('updateDataMut', {data, detailedData, detailedActions});
                    return Promise.resolve(true);
                })
                .catch(err => { console.error(err); });
        }
    }
})