const mongo = require('../lib/mongo.js');
const Axios = require('axios');

Array.prototype.forEachAsync = async function (fn) {
    for (let i in this) Number.isInteger(parseInt(i, 10)) && await fn(this[i], i);
}

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
        data: await fn(id, ctx.query || {})
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
        let fungible = await col.findOne({sym_id: parseInt(id || "")});
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

const getNonfungible = async (id, {page=0, size=15}) => {

    page = parseInt(page, 10); if (!page || page < 0) page = 0;
    size = parseInt(size, 10); if (!size || size < 5) size = 5;

    let res = await mongo.db(async db => {
        let col = db.collection(`Tokens`);
        let distributes = await col.find({domain: id}).sort({created_at: -1, name: -1}).skip(size * page).limit(size).toArray();

        col = db.collection(`Actions`);
        let returnData = await col.findOne({domain: id, name: "newdomain", key: ".create"});

        return {...returnData, distributes};
    });
    return res[1] || [];
}

const getAddress = async (id) => {

    let schemas = {
        "send": {"data.from": id}, //transferft
        "receive": {"data.to": id}, //transferft
        "domain": {"data.creator": id}, //newdomain
        "issue-token": {"data.owner": id}, //issuetoken
        "issue-fungible": {"data.address": id, "name": "issuefungible"}, //issuefungible
        "pay-charge": {"paycharge": id} //paycharge
    };

    let res = await mongo.db(async db => {
        let col = db.collection(`Actions`);
        await Object.keys(schemas).forEachAsync(async key => {
            schemas[key] = await col.find(schemas[key]).count();
        });
        
        return schemas;
    });
    return res[1] || [];

}

const getAddressHistory = async (id, {page=0, size=15, type="all", domain=null}) => {

    page = parseInt(page, 10); if (!page || page < 0) page = 0;
    size = parseInt(size, 10); if (!size || size < 5) size = 5;

    let schema = {};
    if (type === "from") schema["data.from"] = id;
    else if (type === "to") schema["data.to"] = id;
    else if (type === "issue") schema["data.owner"] = id;
    else schema = {'$or': [{"data.from": id}, {"data.to": id}, {"data.owner": id}]};

    if (domain) schema = {"$and": [schema, {"domain": domain}]};

    let res = await mongo.db(async db => {
        let col = db.collection(`Actions`);
        return await col.find(schema).sort({created_at: -1, name: -1}).skip(size * page).limit(size).toArray();
    });
    return res[1] || [];

}

module.exports = [
    ['get', '/block/:id', getDetail(getBlock)],
    ['get', '/transaction/:id', getDetail(getTransaction)],
    ['get', '/fungible/:id', getDetail(getFungible)],
    ['get', '/domain/:id', getDetail(getDomain)],
    ['get', '/group/:id', getDetail(getGroup)],
    ['get', '/nonfungible/:id', getDetail(getNonfungible)],
    ['get', '/address/:id', getDetail(getAddress)],
    ['get', '/addressHistory/:id', getDetail(getAddressHistory)],
];