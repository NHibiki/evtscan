export const state = () => ({
    open: false
});

export const mutations = {
    switchOpen: (state) => {
        state.open = !state.open;
    },
};

export const actions = {};