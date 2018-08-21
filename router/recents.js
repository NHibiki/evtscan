const mongo = require('../lib/mongo.js');

// get most recent transactions from mongo
const getRecent = fn => async (ctx, next) => {

    let {since, page, size} = ctx.query;

    // check params of input
    if (!(since = Date.parse(since))) since = new Date().getTime();
    if (isNaN(page = parseInt(page, 0))) page = 0;
    else if (page < 0) page = 0;
    if (!(size = parseInt(size, 10))) size = 10;
    else if (size < 10) size = 10;

    // set return content of query
    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    
    let result = {
        state: 1,
        since, page, size,
        data: await fn(since, page, size)
    };

    if (!result.data) result = { state: 0, error: "resource not found" }
    ctx.body = result;
    
}

const getBlocks = async (since, page, size) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Blocks`);
        return await col.find({timestamp: {'$lte': new Date(since)}}).sort({timestamp: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
    
}

const getTransactions = async (since, page, size) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Transactions`);
        return await col.find({updated_at: {'$lte': new Date(since)}}).sort({updated_at: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
}

module.exports = [
    ['get', '/block', getRecent(getBlocks)],
    ['get', '/transaction', getRecent(getTransactions)],
];