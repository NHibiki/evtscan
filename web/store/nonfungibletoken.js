import { getDetail } from '~/lib/api';
import { tablizeNonfungibleToken } from '~/lib/util';

export const state = () => ({
    id: "",
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
    }
};

export const actions = {
    updateData: ({ commit, state }) => {
        return getDetail("nonfungible/token", state.id)
            .then(recvData => {
                const [data, metas, metaData] = tablizeNonfungibleToken(recvData.data.data);
                commit('updateDataMut', {data, metas, metaData});
            })
            .catch(err => { console.error(err); })
    }
};