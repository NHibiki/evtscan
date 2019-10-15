const fs = require('fs');
const colors = require('colors/safe');

const parseSiteInfo = (siteInfo = '') => {
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
            return {
                default: siteInfo
            };
        }
    }
}

const fillDigits = (n, k = 2) => {
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
        colors.yellow(`[${type} `) +
        colors.green(`${getCurrentTime()}`) +
        colors.yellow(`]`),
        ...args);
}

const log = (...args) => {
    if (shared.debug) {
        console.info(
            colors.blue(`[Debug `) +
            colors.green(`${getCurrentTime()}`) +
            colors.blue(`]`),
            ...args);
    }
};

const check = (data, type = 'string') => {
    return typeof data === type;
}

const shallowMerge = (a, b, keepDuplicated = false) => {
    const c = Object.assign({}, a);
    Object.keys(b).forEach(k => {
        if (k in c) {
            if (keepDuplicated || c[k] !== b[k]) {
                if (c[k] && c[k].__ismerged) {
                    if (keepDuplicated || c[k].indexOf(b[k]) === -1) c[k].push(b[k]);
                } else {
                    c[k] = [c[k], b[k]];
                    c[k].__ismerged = true;
                }
            }
        } else {
            c[k] = b[k];
        }
    });
    return c;
}

const shared = {
    debug: false,
    context: {}
};

module.exports = {
    parseSiteInfo,
    log,
    logWithType,
    check,
    shallowMerge,
    shared
}