const mongo = require('../lib/mongo.js');

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

    let res = await mongo.db(async db => {
        let col = db.collection(`Transactions`);
        let regp = RegExp(keyword, "i");
        return (await col.aggregate([
            {'$match': {payer: regp}},
            {'$group': {_id: "$payer",payer: {$first: "$payer"}}},
            {'$project': {_id: 0}},
        ]).toArray()).map(d => d.payer).sort((a, b) => {
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