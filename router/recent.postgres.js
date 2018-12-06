const postgres = require('../lib/postgres.js');

// lower priority of Test Fungibles
// const lowerTest = true;

Array.prototype.mapAsync = async function (fn) {
    let newArr = [];
    for (let i in this) Number.isInteger(parseInt(i, 10)) && (newArr.push(await fn(this[i], i)));
    return newArr;
}

// get most recent transactions from mongo
const getRecent = fn => async (ctx, next) => {

    let {since, page, size, from, block_num, trx_id, trx_name, creator, key, name, sym_id, filter} = ctx.query;

    // check params of input
    if (!(since = Date.parse(since))) since = Date.now();
    if (!(from = Date.parse(from))) from = new Date(0).getTime();
    if (isNaN(page = parseInt(page, 10))) page = 0;
    else if (page < 0) page = 0;
    if (!(size = parseInt(size, 10))) size = 10;
    else if (size < 10) size = 10;
    if (!(block_num = parseInt(block_num, 10))) block_num = 0;
    if (!trx_id) trx_id = null;
    if (!trx_name) trx_name = null;
    if (!creator) creator = null;
    if (!key) key = null;
    if (!name) name = null;
    if (isNaN(sym_id = parseInt(sym_id, 10))) sym_id = -1;
    if (!filter) filter = null;

    // set return content of query
    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    
    let result = {
        state: 1,
        since, page, size, from,
        data: await fn(since, page, size, from, {block_num, trx_id, trx_name, creator, key, name, sym_id, filter})
    };

    if (!result.data) result = { state: 0, error: "resource not found" }
    ctx.body = result;
    
}

const getBlocks = async (since, page, size, from, {trx_id}) => {
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT * FROM blocks WHERE created_at<=$1 AND created_at>=$2 ORDER BY block_num DESC LIMIT $3 OFFSET $4`, [new Date(since), new Date(from), size, size * page])).rows || [];
    });
    return res[1] || [];
}

const getTransactions = async (since, page, size, from, {block_num}) => {
    let res = await postgres.db(async db => {
        let addons = "";
        let queries = [new Date(since), new Date(from), size, size * page];
        if (block_num) { addons = `AND block_num=$5`; queries.push(block_num); }
        return (await db.query(`SELECT * FROM transactions WHERE created_at<=$1 AND created_at>=$2 ${addons} ORDER BY created_at DESC LIMIT $3 OFFSET $4`, queries)).rows || [];
    });
    return res[1] || [];
}

const getActions = async (since, page, size, from, {trx_id}) => {
    let res = await postgres.db(async db => {
        let addons = "";
        let queries = [new Date(since), new Date(from), size, size * page];
        if (trx_id) { addons = `AND trx_id=$5`; queries.push(trx_id); }
        return (await db.query(`SELECT * FROM actions WHERE created_at<=$1 AND created_at>=$2 ${addons} ORDER BY created_at DESC LIMIT $3 OFFSET $4`, queries)).rows || [];
    });
    return res[1] || [];
}

const getTrxByName = async (since, page, size, from, {trx_name="everipay"}) => {
    let res = await postgres.db(async db => {
        let addons = "";
        let queries = [new Date(since), new Date(from), size, size * page];
        if (trx_name) { addons = `AND name=$5`; queries.push(trx_name); }
        let actionsData = (await db.query(`SELECT * FROM actions WHERE created_at<=$1 AND created_at>=$2 ${addons} ORDER BY created_at DESC LIMIT $3 OFFSET $4`, queries)).rows || [];

        let trxMap = {};
        actionsData.forEach(a => {
            a.data.key = a.data.link && a.data.link.keys && a.data.link.keys[0] || "";
            delete a.data.link;
            trxMap[a.trx_id] = a
        });
        let trxs = actionsData.map(a => a.trx_id);
        let params = trxs.map((_, i) => `$${i+1}`);
        let ans = (await db.query(`SELECT * FROM transactions WHERE trx_id IN (${params.join(",")}) ORDER BY created_at DESC`, trxs)).rows || [];
        return ans.map(a => ({...a, data: trxMap[a.trx_id].data, domain: trxMap[a.trx_id].domain}));
    });
    return res[1] || [];
}

const getFungibles = async (since, page, size, from, {creator, filter}) => {
    let res = await postgres.db(async db => {
        let addons = "";
        let queries = [new Date(since), new Date(from), size, size * page];
        let startIndex = 5;
        if (creator) { addons = `AND creator=$5`; queries.push(creator); startIndex += 1; }
        if (filter) {
            addons += ` AND (LOWER(name) LIKE $${startIndex} OR LOWER(sym_name) LIKE $${startIndex} OR sym_id=$${startIndex+1})`;
            queries.push(`%${filter.trim().toLocaleLowerCase()}%`);
            queries.push(parseInt(filter, 10) || -1);
        }
        let schemaResult = (await db.query(`SELECT * FROM fungibles WHERE created_at<=$1 AND created_at>=$2 ${addons} ORDER BY created_at DESC LIMIT $3 OFFSET $4`, queries)).rows || [];
        return await schemaResult.mapAsync(async d => {
            if (d && d.metas && d.metas.length) {
                let params = d.metas.map((_, i) => `$${i+1}`);
                let metas = (await db.query(`SELECT * FROM metas WHERE id IN (${params.join(",")})`, d.metas)).rows || [];
                d.metas = metas;
            }
            return d;
        });
    });
    return res[1] || [];
}

const getDomains = async (since, page, size, from, {creator}) => {
    let res = await postgres.db(async db => {
        let addons = "";
        let queries = [new Date(since), new Date(from), size, size * page];
        if (creator) { addons = `AND creator=$5`; queries.push(creator); }
        return (await db.query(`SELECT * FROM domains WHERE created_at<=$1 AND created_at>=$2 ${addons} ORDER BY created_at DESC LIMIT $3 OFFSET $4`, queries)).rows || [];
    });
    return res[1] || [];
}

const getGroups = async (since, page, size, from, {key}) => {
    let res = await postgres.db(async db => {
        let addons = "";
        let queries = [new Date(since), new Date(from), size, size * page];
        if (key) { addons = `AND def=$5`; queries.push(key); }
        return (await db.query(`SELECT * FROM groups WHERE created_at<=$1 AND created_at>=$2 ${addons} ORDER BY created_at DESC LIMIT $3 OFFSET $4`, queries)).rows || [];
    });
    return res[1] || [];
}

const getNonfungibles = async (since, page, size, from) => {
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT domain AS _id, COUNT(*) AS count, MAX(created_at) AS updated_at FROM tokens WHERE created_at<=$1 AND created_at>=$2 GROUP BY _id ORDER BY updated_at DESC LIMIT $3 OFFSET $4`, [new Date(since), new Date(from), size, size * page])).rows || [];
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