const postgres = require('../lib/postgres.js');

const fungiblesInfo = {
    value: 0,
    updated: 0,
}

const getInfoWrapper = fn => async (ctx, next) => {

    // set return content of query
    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    
    let result = {
        state: 1,
        data: await fn(ctx, next)
    };

    if (!result.data) result = { state: 0, error: "resource not found" }
    ctx.body = result;
    
}

// get current chainInfo
const getChainInfo = async () => {

    if (fungiblesInfo.updated + 300 * 1000 < Date.now()) {
        const res = await postgres.db(async db => {
            return (await db.query(`SELECT COUNT(*) FROM fungibles`)).rows[0];
        });
        fungiblesInfo.updated = Date.now();
        fungiblesInfo.value = parseInt((res[1] || {}).count, 10) || 0;
    }

    return {
        tps: {
            fungibles: fungiblesInfo,
            top: {
                id: "0152b436040b9ec7025f7c53cbf9e3ee1ffb78891482b323caef6616cf95cab1",
                num: 22197302,
                value: 10018
            }
        }
    }

}

const searchAddress = async ctx => {

    let {keyword} = (ctx.query || {});
    if (!keyword) return [];

    let res = await postgres.db(async db => {
        return (await db.query(`SELECT DISTINCT payer FROM transactions WHERE LOWER(payer) LIKE $1 LIMIT 20`, [`%${keyword.toLocaleLowerCase()}%`])).rows
            .map(d => d.payer).sort((a, b) => {
                try {
                    return regp.exec(a).index < regp.exec(b).index ? -1 : 1;
                } catch(err) {return 0}
            });
    });

    return res[1] || [];

}

module.exports = [
    ['get', '/chainInfo', getInfoWrapper(getChainInfo)],
    ['get', '/searchAddress', getInfoWrapper(searchAddress)]
];