const fs = require('fs');
const { join } = require('path');

// copy frontend config file
fs.copyFileSync(
    join(__dirname, './config.js'),
    join(__dirname, '../web/addon.config.js')
);

// copy frontend style file
fs.copyFileSync(
    join(__dirname, './style.scss'),
    join(__dirname, '../web/assets/plugin.scss')
);