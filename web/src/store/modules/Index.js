export default () => ({
    namespaced: true,
    state: {
        minHeight: 0,
        trxEndpoint: 'transaction',
        activeTab: 'all',
    },
    mutations: {
        changeMinHeight: (state, height) => {
            state.minHeight = height;
        },
        changeEndpoint: (state, {id, tab}) => {
            state.activeTab = id;
            state.trxEndpoint = tab.endpoint;
        },
    },
    actions: {}
})