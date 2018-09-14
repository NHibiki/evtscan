export const state = () => ({
    minHeight: 0,
    trxEndpoint: 'transaction',
    activeTab: 'all',
});

export const mutations = {
    changeMinHeight: (state, height) => {
        state.minHeight = height;
    },
    changeEndpoint: (state, {id, tab}) => {
        state.activeTab = id;
        state.trxEndpoint = tab.endpoint;
    },
};

export const actions = {};