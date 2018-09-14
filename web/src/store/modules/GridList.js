import { getRecent } from '@/lib/api';

export default () => ({
    namespaced: true,
    state: {
        items: {},
    },
    mutations: {
        flushDataMut: (state, endpoint) => {
            state.items[endpoint] = null;
            state.items = Object.assign({}, state.items);
        },
        getDataListMut: (state, {endpoint, items}) => {
            state.items[endpoint] = items;
            state.items = Object.assign({}, state.items);
        },
    },
    actions: {
        getDataList({ commit, state }, endpoint) {
            commit('flushDataMut', endpoint);
            return getRecent(endpoint)
                .then(data => {
                    let items = data.data.data;
                    commit('getDataListMut', {endpoint, items});
                    //(this.items || []).concat(rev)
                    // let i = 0;
                    // let inv = setInterval(() => {
                    //     if (i >= rev.length) clearInterval(inv);
                    //     else {
                    //         this.items.unshift(rev.pop())
                    //     }
                    // }, 100);
                    return Promise.resolve(true);
                })
                .catch(err => { console.error(err); })
        }
    }
})