// initialize theme
let theme = null;
try { theme = window.location.search.substr(1).split("&").reduce((p, c) => {return p || c.split("=")[0] === 'theme' ? c.split("=")[1] : ""},""); } catch (err) {};

// initialize system time
let time = Date.now();

export const state = () => ({
    open: false,
    theme,
    time,
});

export const mutations = {
    switchOpen: (state) => {
        state.open = !state.open;
    },
    setTheme: (state, theme) => {
        if (["light"].includes(theme)) state.theme = theme;
        else state.theme = null;
    },
    updateCurrentTime: (state) => {
        state.time = Date.now();
    }
};

export const actions = {};