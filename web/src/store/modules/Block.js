import { getDetail, getTrxOnBlock } from '@/lib/api';
import { tablizeBlock, tablizeBlockTrx } from '@/lib/util';

export default () => ({
    namespaced: true,
    state: {
        id: "",
        data: null,
        trxData: null,
        ssr: false,
    },
    mutations: {
        isSSR: (state, isOrNot=true) => { state.ssr = isOrNot },
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
            return Promise.all([getDetail("block", state.id)
                    .then(data => {
                        commit('updateDataMut', {data: tablizeBlock(data.data.data)});
                        return Promise.resolve(true);
                    }),
                getTrxOnBlock(state.id)
                    .then(data => {
                        commit('updateDataMut', {trxData: tablizeBlockTrx(data.data.data)});
                        return Promise.resolve(true);
                    })])
                .catch(err => { console.error(err); })
        }
    }
})