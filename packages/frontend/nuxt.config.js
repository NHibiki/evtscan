const addons = require('./addon.config.js') || {};

let additionalCss = [{ href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Quicksand:100,300,400,700&amp;lang=zh-CN', rel: 'stylesheet' }];
if (addons.additionalCss && addons.additionalCss.length) {
  additionalCss = addons.additionalCss.map(link => ({
    href: link,
    rel: 'stylesheet'
  }));
}

let additionalScripts = [{ src: "https://www.everitoken.io/js/update-prompt.js", async: true }];
if (addons.additionalScripts && addons.additionalScripts.length) {
  additionalScripts = addons.additionalScripts.map(link => ({ src: link }));
}

module.exports = {
  /*
  ** Environment Variables
  */
  env: {
    localDEV: (process.env.NUXT_START_ENV || "").toLocaleUpperCase() === "DEV" || false,
    remoteDEV: (process.env.REMOTE_DEV || "").toLocaleUpperCase() === "DEV" || false,
    showFungibleActions: addons.showFungibleActions || false,
  },
  /*
  ** Headers of the page
  */
  head: {
    title: addons.appName || 'everiToken (EVT) Blockchain Explorer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0' },
      { hid: 'description', name: 'description', content: addons.appDesc || 'Explorer for everiToken, world’s first token-customized public chain for the token economy and for everyone.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' },
      ...additionalCss
    ],
    script: [ 
      ...additionalScripts
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: addons.appLoading || '#e6a938' },
  router: {
    middleware: 'i18n'
  },
  /*
  ** Plugins
  */
  plugins: ['~/plugins/initComponents', '~/plugins/i18n.js'],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

