import { getDetail } from '@/lib/api';
import { tablizeDomain } from '@/lib/util';

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
            getDetail("domain", state.id)
                .then(recvData => {
                    let [data, detailedData, detailedActions] = tablizeDomain(recvData.data.data);
                    commit('updateDataMut', {data, detailedData, detailedActions});
                })
                .catch(err => { console.error(err); });
        }
    }
})