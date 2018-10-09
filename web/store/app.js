let theme = null;
try { theme = window.location.search.substr(1).split("&").reduce((p, c) => {return p || c.split("=")[0] === 'theme' ? c.split("=")[1] : ""},""); } catch (err) {};

export const state = () => ({
    open: false,
    theme,
});

export const mutations = {
    switchOpen: (state) => {
        state.open = !state.open;
    },
    setTheme: (state, theme) => {
        if (["light"].includes(theme)) state.theme = theme;
        else state.theme = null;
    }
};

export const actions = {};