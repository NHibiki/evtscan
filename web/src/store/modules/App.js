export default () => ({
    namespaced: true,
    state: {
        open: false
    },
    mutations: {
        switchOpen: (state) => {
            state.open = !state.open;
        },
    },
})