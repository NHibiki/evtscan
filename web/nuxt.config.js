module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'everiToken (EVT) Blockchain Explorer',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0' },
      { hid: 'description', name: 'description', content: 'Explorer for everiToken, world’s first token-customized public chain for the token economy and for everyone.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,700|Quicksand:100,300,400,700&amp;lang=zh-CN', rel: 'stylesheet' }
    ],
    script: [ 
      { src: "https://www.everitoken.io/js/update-prompt.js", async: true }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#e6a938' },
  /*
  ** Plugins
  */
  plugins: ['~/plugins/initComponents'],
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

