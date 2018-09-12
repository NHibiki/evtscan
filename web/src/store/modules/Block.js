import { getDetail, getTrxOnBlock } from '@/lib/api';
import { tablizeBlock, tablizeBlockTrx } from '@/lib/util';

export default () => ({
    namespaced: true,
    state: {
        id: "",
        data: null,
        trxData: null,
    },
    mutations: {
        resetData: (state, id) => {
            state.id = id;
            state.data = null;
            state.trxData = null;
        },
        updateDataMut: (state, thing) => {
            Object.keys(thing).forEach(k => {
                state[k] = thing[k];
            });
        }
    },
    actions: {
        updateData: ({ commit, state }) => {
            getDetail("block", state.id)
                .then(data => {
                    commit('updateDataMut', {data: tablizeBlock(data.data.data)});
                })
                .catch(err => { console.error(err); })
            getTrxOnBlock(state.id)
                .then(data => {
                    commit('updateDataMut', {trxData: tablizeBlockTrx(data.data.data)});
                })
                .catch(err => { console.error(err); })
        }
    }
})