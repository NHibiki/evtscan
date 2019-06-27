const postgres = require('../lib/postgres.js');

const fungiblesInfo = {
    value: 0,
    updated: 0,
};

const transactionsInfo = {
    value: 0,
    updated: 0,
};

const getInfoWrapper = fn => async (ctx, next) => {

    // set return content of query
    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, OPTION');
    
    let result = {
        state: 1,
        data: await fn(ctx, next)
    };

    if (!result.data) result = { state: 0, error: "resource not found" }
    ctx.body = result;
    
}

// get current chainInfo
const getChainInfo = async () => {

    const now = Date.now();
    // freeze for 5 min
    if (fungiblesInfo.updated + 300 * 1000 < now) {
        const res = await postgres.db(async db => {
            return (await db.query(`SELECT COUNT(*) FROM fungibles`)).rows[0];
        });
        fungiblesInfo.updated = now;
        fungiblesInfo.value = parseInt((res[1] || {}).count, 10) || 0;
    }

    // freeze for 1 min
    if (transactionsInfo.updated + 60 * 1000 < now) {
        const res = await postgres.db(async db => {
            return (await db.query(`SELECT COUNT(*) FROM transactions WHERE timestamp>=$1`, [new Date(now - 24 * 3600 * 1000)])).rows[0];
        });
        transactionsInfo.updated = now;
        transactionsInfo.value = parseInt((res[1] || {}).count, 10) || 0;
    }

    return {
        tps: {
            fungibles: fungiblesInfo,
            top: {
                id: "0152b436040b9ec7025f7c53cbf9e3ee1ffb78891482b323caef6616cf95cab1",
                num: 22197302,
                value: 10018
            }
        },
        trx: transactionsInfo,
    }

}

const searchAddress = async ctx => {

    let {keyword} = (ctx.query || {});
    if (!keyword) return [];

    const res = await postgres.db(async db => {
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