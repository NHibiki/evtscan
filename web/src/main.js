import { createApp } from './app.js'

const appId = window.__INITIAL_STATE__ ? '#evtscan' : '#app';
const { app, store } = createApp(appId);

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}

app