const mongo = require('../lib/mongo.js');
const Axios = require('axios');

// get details of blocks or transactions
const getDetail = fn => async (ctx, next) => {

    let {id} = ctx.params;

    // check params of input
    if (!id) {
        ctx.body = {
            state: 0,
            error: "invalid id",
        };
        return;
    }

    // set return content of query
    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    
    let result = {
        state: 1,
        data: await fn(id)
    };

    if (!result.data || !Object.keys(result.data).length) result = { state: 0, error: "resource not found" }
    ctx.body = result;
    
}

const getBlock = async id => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Blocks`);
        return await col.findOne({block_num: parseInt(id, 10) || 0});
    });
    return res[1] || [];
    
}

const getTransaction = async id => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Transactions`);
        return await col.findOne({trx_id: id || ""});
    });
    return res[1] || [];
}

const getFungible = async id => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Fungibles`);
        let fungible = await col.findOne({name: id || ""});
        if (fungible.metas) return fungible;
        try {
            let metas = (await Axios.post("https://mainnet1.everitoken.io/v1/evt/get_fungible", {id: fungible.sym_id})).data.metas || [];
            fungible.metas = metas;
        } catch (err) {}
        return fungible;
    });
    return res[1] || [];
}

const getDomain = async id => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Domains`);
        return await col.findOne({name: id || ""});
    });
    return res[1] || [];
}

const getGroup = async id => {
    let res = await mongo.db(async db => {
        let col = db.collection(`Groups`);
        return await col.findOne({name: id || ""});
    });
    return res[1] || [];
}

module.exports = [
    ['get', '/block/:id', getDetail(getBlock)],
    ['get', '/transaction/:id', getDetail(getTransaction)],
    ['get', '/fungible/:id', getDetail(getFungible)],
    ['get', '/domain/:id', getDetail(getDomain)],
    ['get', '/group/:id', getDetail(getGroup)],
];