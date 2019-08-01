const fs = require('fs');
const colors = require('colors/safe');

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

const fillDigits = (n, k=2) => {
    const s = `${n}`;
    if (s.length < k) return '0'.repeat(k - s.length) + s;
    return s;
}

const getCurrentTime = () => {
    const d = new Date();
    return `${
        d.getFullYear()
    }/${
        fillDigits(d.getMonth()+1)
    }/${
        fillDigits(d.getDate())
    } ${
        fillDigits(d.getHours())
    }:${
        fillDigits(d.getMinutes())
    }:${
        fillDigits(d.getSeconds())
    }.${
        fillDigits(d.getMilliseconds(), 3)
    }`;
}

const logWithType = (type, ...args) => {
    console.info(
        colors.yellow(`[${type} `)
        + colors.green(`${getCurrentTime()}`)
        + colors.yellow(`]`),
        ...args);
}

const log = (...args) => {
    if (shared.debug) {
        console.info(
            colors.blue(`[Debug `)
            + colors.green(`${getCurrentTime()}`)
            + colors.blue(`]`),
            ...args);
    }
};

const shared = {
    debug: false
};

module.exports = {
    parseSiteInfo,
    log,
    logWithType,
    shared
}