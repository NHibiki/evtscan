import { getDetail } from '~/lib/api';
import { tablizeValidator } from '~/lib/util';

export const state = () => ({
    id: "",
    // page: 0,
    // pagesize: 15,
    data: null,
    netValues: []
});

export const mutations = {
    resetData: (state, id) => {
        state.id = id;
        state.data = null;
        state.netValues = [];
    },
    updateDataMut: (state, thing={}) => {
        Object.keys(thing).forEach(k => {
            state[k] = thing[k];
        });
    },
    // updatePageMut: (state, page) => {
    //     state.page = page;
    //     state.trxData = null;
    // }
};

export const actions = {
    async updateData ({ commit, state }) {
        const rawData = await getDetail("validator", state.id);
        const [data, netValues] = tablizeValidator(rawData.data.data);
        commit('updateDataMut', {
            data,
            netValues
        });
    },
    // async more({ commit, dispatch, state }, adder) {
    //     if (!adder) return;
    //     if (state.trxData && state.trxData.length < state.pagesize && adder > 0) return;
    //     if (state.page + adder < 0) return;  
    //     commit('updatePageMut', state.page + adder);
    //     await dispatch('updateTrx');
    // }
};