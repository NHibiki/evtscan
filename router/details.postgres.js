const postgres = require('../lib/postgres.js');

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
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT * FROM blocks WHERE block_num=$1 LIMIT 1`, [parseInt(id, 10) || 0])).rows[0] || null;
    });
    return res[1] || [];
}

const getTransaction = async id => {
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT * FROM transactions WHERE trx_id=$1 LIMIT 1`, [id || ""])).rows[0] || null;
    });
    return res[1] || [];
}

const getFungible = async id => {
    let res = await postgres.db(async db => {
        let fungible = (await db.query(`SELECT * FROM fungibles WHERE sym_id=$1 LIMIT 1`, [parseInt(id, 10) || 0])).rows[0] || null;
        let metas = (await db.query(`SELECT * FROM metas WHERE id=$1`, [parseInt(id, 10) || 0])).rows || [];
        fungible.metas = metas;
        return fungible;
    });
    return res[1] || [];
}

const getDomain = async id => {
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT * FROM domains WHERE name=$1 LIMIT 1`, [id || ""])).rows[0] || null;
    });
    return res[1] || [];
}

const getGroup = async id => {
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT * FROM groups WHERE name=$1 LIMIT 1`, [id || ""])).rows[0] || null;
    });
    return res[1] || [];
}

const getNonfungible = async (id, {page=0, size=15}) => {
    page = parseInt(page, 10); if (!page || page < 0) page = 0;
    size = parseInt(size, 10); if (!size || size < 5) size = 5;
    let res = await postgres.db(async db => {
        let distributes = (await db.query(`SELECT * FROM tokens WHERE domain=$1 ORDER BY created_at DESC, name ASC LIMIT $2 OFFSET $3`, [id || "", size, size * page])).rows || [];
        let returnData = (await db.query(`SELECT * FROM actions WHERE domain=$1 AND name='newdomain' AND key='.create' LIMIT 1`, [id || ""])).rows[0] || null;
        return {...returnData, distributes};
    });
    return res[1] || [];
}

const getAddress = async (id) => {
    let schemas = {
        "send": "data->from=$1", //transferft
        "receive": "data->to=$1", //transferft
        "domain": "data->creator=$1", //newdomain
        "issue-token": "data->owner=$1", //issuetoken
        "issue-fungible": "name='issuefungible' AND data->address=$1", //issuefungible
        "pay-charge": "paycharge=$1", //paycharge
    };
    let res = await postgres.db(async db => {
        await Object.keys(schemas).forEachAsync(async key => {
            schemas[key] = ((await db.query(`SELECT COUNT(*) AS c FROM actions WHERE ${schemas[key]}`, [id || ""])).rows[0] || {}).c || 0;
        });
        return schemas;
    });
    return res[1] || [];
}

const getAddressHistory = async (id, {page=0, size=15, filter="all", domain=null}) => {
    page = parseInt(page, 10); if (!page || page < 0) page = 0;
    size = parseInt(size, 10); if (!size || size < 5) size = 5;

    let queries = [id || "", size, size * page];
    let schema = "";
    if (filter === "send") schema = "data->from=$1";
    else if (filter === "receive") schema = "data->to=$1";
    else if (filter === "domain") schema = "data->creator=$1";
    else if (filter === "issue-token") schema = "data->owner=$1";
    else if (filter === "issue-fungible") schema = "name='issuefungible' AND data->address=$1";
    else if (filter === "issue") schema = "data->owner=$1 OR (name='issuefungible' AND data->address=$1)";
    else if (filter === "pay-charge") schema = "paycharge=$1";
    else schema = "data->from=$1 OR data->to=$1 OR data->creator=$1 OR data->owner=$1 OR (name='issuefungible' AND data->address=$1) OR paycharge=$1";
    if (domain) { schema = `(${schema}) AND domain=$4`; queries.push(domain); }

    let res = await postgres.db(async db => {
        return (await db.query(`SELECT * FROM actions WHERE ${schema} ORDER BY created_at DESC, name ASC LIMIT $2 OFFSET $3`, queries)).rows || [];
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