const postgres = require('../lib/postgres.js');

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

    return {
        tps: {
            top: {
                id: 14925824,
                value: 7976
            }
        }
    }

}

const searchAddress = async ctx => {

    let {keyword} = (ctx.query || {});
    if (!keyword) return [];

    let res = await postgres.db(async db => {
        return (await db.query(`SELECT payer FROM transactions WHERE LOWER(payer) LIKE $1 LIMIT 20`, [`%${keyword.toLocaleLowerCase()}%`])).rows
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