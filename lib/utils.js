const fs = require('fs');

const parseSiteInfo = (siteInfo='') => {
    if (!siteInfo) return {};
    let d = null;
    let isFile = false;

    // treat siteInfo as file data
    try {
        if (fs.existsSync(siteInfo)) {
            d = JSON.parse(fs.readFileSync(siteInfo).toString());
            isFile = true;
        }
    } catch (err) {}

    // treat siteInfo as string data
    try {
        d = JSON.parse(siteInfo);
    } catch (err) {}

    try {
        const locales = Object.keys(d);
        if (!locales.length) return {};
        if (!d.default) {
            if (d.en) d.default = d.en;
            else if (d.zh) d.default = d.zh;
            else d.default = d[locales[0]];
        } 
        return d;
    } catch (err) {
        if (isFile) {
            return {};
        } else {
            return { default: siteInfo };
        }
    }
}

module.exports = {
    parseSiteInfo
}