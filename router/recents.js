const mongo = require('../lib/mongo.js');
const Axios = require('axios');

// get most recent transactions from mongo
const getRecent = fn => async (ctx, next) => {

    let {since, page, size, from, block_num, trx_id, trx_name, creator, key} = ctx.query;

    // check params of input
    if (!(since = Date.parse(since))) since = Date.now();
    if (!(from = Date.parse(from))) from = new Date(0).getTime();
    if (isNaN(page = parseInt(page, 0))) page = 0;
    else if (page < 0) page = 0;
    if (!(size = parseInt(size, 10))) size = 10;
    else if (size < 10) size = 10;
    if (!(block_num = parseInt(block_num, 10))) block_num = 0;
    if (!trx_id) trx_id = null;
    if (!trx_name) trx_name = null;
    if (!creator) creator = null;
    if (!key) key = null;

    // set return content of query
    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    
    let result = {
        state: 1,
        since, page, size, from,
        data: await fn(since, page, size, from, block_num || trx_id || trx_name || creator || key)
    };

    if (!result.data) result = { state: 0, error: "resource not found" }
    ctx.body = result;
    
}

const getBlocks = async (since, page, size, from, trx_id) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Blocks`);
            return await col.find({created_at: {'$lte': new Date(since), '$gte': new Date(from)}}).sort({block_num: -1}).skip(size * page).limit(size).toArray();
            // return await col.find({timestamp: {'$lte': new Date(since), '$gte': new Date(from)}}).sort({block_num: -1, timestamp: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
    
}

const getTransactions = async (since, page, size, from, block_num) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Transactions`);
        let schema = {created_at: {'$lte': new Date(since), '$gte': new Date(from)}};
        if (block_num) schema.block_num = block_num;
        return await col.find(schema).sort({created_at: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
}

const getActions = async (since, page, size, from, trx_id) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Actions`);
        let schema = {created_at: {'$lte': new Date(since), '$gte': new Date(from)}};
        if (trx_id) schema.trx_id = trx_id;
        return await col.find(schema).sort({created_at: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
}

const getTrxByName = async (since, page, size, from, trx_name="everipay") => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Actions`);
        let schema = {created_at: {'$lte': new Date(since), '$gte': new Date(from)}};
        if (trx_name) schema.name = trx_name;
        let actionsData = await col.find(schema).sort({created_at: -1}).skip(size * page).limit(size).toArray();

        let trxMap = {};
        actionsData.forEach(a => {
            a.data.key = a.data.link && a.data.link.keys && a.data.link.keys[0] || "";
            delete a.data.link;
            trxMap[a.trx_id] = a
        });
        let trxs = actionsData.map(a => a.trx_id);

        col = db.collection(`Transactions`);
        let ans = await col.find({trx_id: {'$in': trxs}}).sort({created_at: -1}).toArray();

        return ans.map(a => ({...a, data: trxMap[a.trx_id].data, domain: trxMap[a.trx_id].domain}));
    });
    return res[1] || [];
}

const getFungibles = async (since, page, size, from, creator) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Fungibles`);
        let schema = {created_at: {'$lte': new Date(since), '$gte': new Date(from)}};
        if (creator) schema.creator = creator;
        // return await col.find(schema).sort({created_at: -1}).skip(size * page).limit(size).toArray();
        return await Promise.all((await col.find(schema).sort({created_at: -1}).skip(size * page).limit(size).toArray()).map(async d => {
            try {
                let metas = (await Axios.post("https://mainnet1.everitoken.io/v1/evt/get_fungible", {id: d.sym_id})).data.metas || [];
                d.metas = metas;
                return d;
            } catch (err) { return d; }
        }));
    });
    return res[1] || [];
}

const getDomains = async (since, page, size, from, creator) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Domains`);
        let schema = {created_at: {'$lte': new Date(since), '$gte': new Date(from)}};
        if (creator) schema.creator = creator;
        return await col.find(schema).sort({created_at: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
}

const getGroups = async (since, page, size, from, key) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Groups`);
        let schema = {created_at: {'$lte': new Date(since), '$gte': new Date(from)}};
        if (key) schema.def = { key };
        return await col.find(schema).sort({created_at: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
}

const getNonfungibles = async (since, page, size, from, key) => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Tokens`);
        let schema = {created_at: {'$lte': new Date(since), '$gte': new Date(from)}};
        return await col.aggregate([{$sort: {created_at: -1}}, {$group: {_id: '$domain', count: { $sum: 1 }}}, {$skip: size * page}, {$limit: size}]).toArray();
        // col.distinct('domain', schema).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];
}

module.exports = [
    ['get', '/block', getRecent(getBlocks)],
    ['get', '/transaction', getRecent(getTransactions)],
    ['get', '/action', getRecent(getActions)],
    ['get', '/trxByName', getRecent(getTrxByName)],
    ['get', '/fungible', getRecent(getFungibles)],
    ['get', '/domain', getRecent(getDomains)],
    ['get', '/group', getRecent(getGroups)],
    ['get', '/nonfungible', getRecent(getNonfungibles)],
];