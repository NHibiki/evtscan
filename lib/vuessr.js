const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');

const serverBundle = JSON.parse(fs.readFileSync('web/dist/vue-ssr-server-bundle.json').toString());
const clientManifest = JSON.parse(fs.readFileSync('web/dist/vue-ssr-client-manifest.json').toString());
const template = fs.readFileSync('web/index-ssr.html').toString();
const renderer = createBundleRenderer(serverBundle, { runInNewContext: false, basedir: './web/dist', template, clientManifest });

module.exports = renderer;