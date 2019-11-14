// initialize theme
let theme = null;
try { theme = window.location.search.substr(1).split("&").reduce((p, c) => {return p || c.split("=")[0] === 'theme' ? c.split("=")[1] : ""},""); } catch (err) {};

export const state = () => ({
    theme,
    locales: ['zh', 'en'],
    locale: 'zh',
    defaultLocale: 'zh'
});

export const mutations = {
    setTheme: (state, theme) => {
        if (["light"].includes(theme)) state.theme = theme;
        else state.theme = null;
    },
    setLang: (state, locale) => {
        if (state.locales.indexOf(locale) !== -1) {
          state.locale = locale;
        }
    },
    setDefaultLang: (state, locale) => {
        if (state.locales.indexOf(locale) !== -1) {
            state.locale = locale;
            state.defaultLocale = locale;
        }
    }
};

export const actions = {
    nuxtServerInit: ({ commit }, { query }) => {
        if (query && query.theme) commit("setTheme", query.theme);
    }
};