const mongo = require('../lib/mongo.js');

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

module.exports = [
    ['get', '/chainInfo', getInfoWrapper(getChainInfo)],
];