import { getDetail, getTrxOnBlock } from '~/lib/api';
import { tablizeBlock, tablizeBlockTrx } from '~/lib/util';

export const state = () => ({
    id: "",
    page: 0,
    pagesize: 15,
    data: null,
    trxData: null,
    // ssr: false,
});

export const mutations = {
    // isSSR: (state, isOrNot=true) => { state.ssr = isOrNot },
    resetData: (state, id) => {
        state.id = id;
        state.data = null;
        state.trxData = null;
    },
    updateDataMut: (state, thing={}) => {
        Object.keys(thing).forEach(k => {
            state[k] = thing[k];
        });
    },
    updatePageMut: (state, page) => {
        state.page = page;
        state.data = null;
    }
};

export const actions = {
    async updateData ({ commit, dispatch, state }) {
        await Promise.all([
                getDetail("block", state.id).then(data => {
                    commit('updateDataMut', {data: tablizeBlock(data.data.data)});
                }),
                dispatch("updateTrx")
            ]);
    },
    async more({ commit, dispatch, state }, adder) {
        if (!adder) return;
        if (state.data.length < state.pagesize && adder > 0) return;
        if (state.page + adder < 0) return;  
        commit('updatePageMut', state.page + adder);
        await dispatch('updateTrx');
    },
    async updateTrx ({ commit, state }) {
        let data = await getTrxOnBlock(state.id, state.page, state.pagesize);
        commit('updateDataMut', {trxData: tablizeBlockTrx(data.data.data)});
    }
};