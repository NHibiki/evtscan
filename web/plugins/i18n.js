import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default ({ app, store }) => {

    // Set i18n instance on app
    // This way we can use it in middleware and pages asyncData/fetch
    const langs = {
        'en': 'English',
        'zh': '中文',
    };

    const messages = {};
    Object.keys(langs).forEach(key => {
        messages[key] = require(`~/locales/${key}.json`);
    });

    app.i18n = new VueI18n({
        locale: store.state.locale,
        fallbackLocale: 'en',
        messages
    });

    app.i18n.path = (link) => {
        if (app.i18n.locale === app.i18n.fallbackLocale) {
        return `${link}`;
        }

        return `/${app.i18n.locale}${link}`;
    }

    app.i18n.switch = (lang) => {
        let l = lang;
        if (!(l in langs)) l = 'en';
        let fullPath = app.router.history.current.fullPath;
        const firstSlot = fullPath.split('/')[1];
        if (firstSlot in langs) {
            fullPath = fullPath.substr(1 + firstSlot.length);
        }
        return '/' + lang + fullPath;
    }

    app.i18n.translate = langs;
}
