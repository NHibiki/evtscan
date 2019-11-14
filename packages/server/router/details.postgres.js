const postgres = require('../lib/postgres.js');
const evtnet = require('../lib/evtnet.js');
const Utils = require('../lib/utils');
const Axios = require('axios');

Array.prototype.forEachAsync = async function (fn) {
    for (let i in this) Number.isInteger(parseInt(i, 10)) && await fn(this[i], i);
}

Array.prototype.mapAsync = async function (fn) {
    let newArr = [];
    for (let i in this) Number.isInteger(parseInt(i, 10)) && (newArr.push(await fn(this[i], i)));
    return newArr;
}

// get details of blocks or transactions
const getDetail = fn => async (ctx, next) => {

    let {
        id
    } = ctx.params;

    // check params of input
    if (!id) {
        ctx.body = {
            state: 0,
            error: "invalid id",
        };
        return;
    }


    const startTime = Date.now();

    // set return content of query
    ctx.type = 'application/json';
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, OPTION');

    let result = {
        state: 0,
        error: 'Internal Server Error!'
    };
    try {
        result = {
            state: 1,
            data: await fn(id, ctx.query || {})
        };
    } catch (err) {
        Utils.logWithType('Error', err);
    }

    if (!result.error && !result.data || !Object.keys(result.data).length) result = {
        state: 0,
        error: "Resource Not Found!"
    }
    if (result.data && result.data.evtscan_raw) {
        result = result.data.data || 'none';
        ctx.type = 'text/plain';
    }
    Utils.log(`D|TimeUsing: ${Date.now() - startTime}`, ctx.request.path, ctx.request.querystring);

    ctx.body = result;

}

const getBlock = async id => {
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT * FROM blocks WHERE block_id=$1 LIMIT 1`, [id || ""])).rows[0] || null;
    });
    return res[1] || [];
}

const getTransaction = async id => {
    let res = await postgres.db(async db => {
        return (await db.query(`SELECT t.*, b.block_id FROM transactions t LEFT JOIN blocks b ON b.block_num=t.block_num WHERE trx_id=$1 LIMIT 1`, [id || ""])).rows[0] || null;
    });
    return res[1] || [];
}

const getFungible = async (id, {
    action = null
}) => {
    let res = await postgres.db(async db => {
        let fungible = (await db.query(`SELECT * FROM fungibles WHERE sym_id=$1 LIMIT 1`, [parseInt(id, 10) || 0])).rows[0] || null;

        if (!fungible) return null;

        /* return by action */
        if ('total_supply' === action && fungible.total_supply) {
            return {
                data: fungible.total_supply.split(' ')[0],
                evtscan_raw: true
            };
        }

        /* current supply */
        try {
            const node = evtnet.getRandomNode('AP');
            const chainData = (await Axios.post(node.addr + `/v1/evt/get_fungible`, {
                id
            })).data;
            if (chainData.current_supply) {
                fungible.current_supply = chainData.current_supply;
            }
            /* in case of the meta data is not saved in db */
            if (chainData.metas && !fungible.metas) {
                fungible.metas = chainData.metas;
            }
        } catch (err) {
            // console.log(err);
        }

        if ('current_supply' === action && fungible.current_supply) {
            return {
                data: fungible.current_supply.split(' ')[0],
                evtscan_raw: true
            };
        }

        /* get meta */
        if (fungible.metas && fungible.metas.length) {
            let params = fungible.metas.map((_, i) => `$${i+1}`);
            let metas = (await db.query(`SELECT * FROM metas WHERE id IN (${params.join(",")})`, fungible.metas)).rows || [];
            fungible.metas = metas;
        }

        return fungible;
    });
    return res[1] || [];
}

const getDomain = async id => {
    let res = await postgres.db(async db => {
        let domain = (await db.query(`SELECT * FROM domains WHERE name=$1 LIMIT 1`, [id || ""])).rows[0] || null;
        if (domain && domain.metas && domain.metas.length) {
            let params = domain.metas.map((_, i) => `$${i+1}`);
            let metas = (await db.query(`SELECT * FROM metas WHERE id IN (${params.join(",")})`, domain.metas)).rows || [];
            domain.metas = metas;
        }
        return domain;
    });
    return res[1] || [];
}

const getGroup = async id => {
    let res = await postgres.db(async db => {
        let group = (await db.query(`SELECT * FROM groups WHERE name=$1 LIMIT 1`, [id || ""])).rows[0] || null;
        if (group && group.metas && group.metas.length) {
            let params = group.metas.map((_, i) => `$${i+1}`);
            let metas = (await db.query(`SELECT * FROM metas WHERE id IN (${params.join(",")})`, group.metas)).rows || [];
            group.metas = metas;
        }
        return group;
    });
    return res[1] || [];
}

const getNonfungible = async (id, {
    page = 0,
    size = 15
}) => {
    page = parseInt(page, 10);
    if (!page || page < 0) page = 0;
    size = parseInt(size, 10);
    if (!size || size < 5) size = 5;
    let res = await postgres.db(async db => {
        let distributes = (await db.query(`SELECT tk.*, t.timestamp AS timestamp FROM tokens tk INNER JOIN transactions t ON tk.trx_num = t.trx_num WHERE domain=$1 ORDER BY t.timestamp DESC, name ASC LIMIT $2 OFFSET $3`, [id || "", size, size * page])).rows || [];
        let returnData = (await db.query(`SELECT * FROM actions WHERE domain=$1 AND name='newdomain' AND key='.create' LIMIT 1`, [id || ""])).rows[0] || null;
        await distributes.forEachAsync(async dis => {
            if (dis && dis.metas && dis.metas.length) {
                let params = dis.metas.map((_, i) => `$${i+1}`);
                let metas = (await db.query(`SELECT * FROM metas WHERE id IN (${params.join(",")})`, dis.metas)).rows || [];
                dis.metas = metas;
            }
        });
        return {
            ...returnData,
            distributes
        };
    });
    return res[1] || [];
}

const getNonfungibleDistribution = async (id, {
    page = 0,
    size = 15
}) => {
    page = parseInt(page, 10);
    if (!page || page < 0) page = 0;
    size = parseInt(size, 10);
    if (!size || size < 5) size = 5;
    let res = await postgres.db(async db => {
        let distribution = (await db.query(`SELECT * FROM tokens WHERE id=$1`, [id || ""])).rows[0] || {};
        // let distribution = (await db.query(`SELECT tk.*, t.timestamp AS timestamp FROM tokens tk INNER JOIN transactions t ON tk.trx_num = t.trx_num WHERE tk.id=$1`, [id || ""])).rows || {};
        if (distribution && distribution.metas && distribution.metas.length) {
            distribution.metas = distribution.metas.slice(page * size, (page+1) * size);
            let params = distribution.metas.map((_, i) => `$${i+1}`);
            let metas = (await db.query(`SELECT * FROM metas WHERE id IN (${params.join(",")})`, distribution.metas)).rows || [];
            distribution.metas = metas;
        }
        return distribution;
    });
    return res[1] || [];
}

const getAddress = async (id) => {
    id = (id || '').replace(/VCC/, 'EVT');
    const schemas = [
        `SELECT
            COUNT(*) FILTER(WHERE data->>'from'=$1) as send,
            COUNT(*) FILTER(WHERE data->>'to'=$1) as receive,
            COUNT(*) FILTER(WHERE data->>'payer'=$1) as paycharge
        FROM actions
        WHERE name = ANY ('{transferft,paycharge}')`,
    ];

    let res = await postgres.db(async db => {
        const assets = await Promise.all(schemas.map(async (schema) => {
            return (await db.query(schema, [id || ""])).rows[0] || {};
        }));
        return assets.reduce((prev, curr) => ({
            ...curr,
            ...prev,
        }), {});
    });
    return res[1] || [];
}

const getAssets = async (id) => {
    id = (id || '').replace(/VCC/, 'EVT');
    let node = evtnet.getRandomNode('AP');
    let ans = [];
    try {
        ans = (await Axios.post(node.addr + `/v1/history/get_fungibles_balance`, {
            addr: id
        })).data;
    } catch (err) {
        return null;
    }

    if (ans.code || !ans.length) return null;
    let assets = ans.map(a => ({
        sym_id: parseInt(a.split(" S#")[1], 10) || 0,
        amount: parseFloat(a.split(" S#")[0]) || 0,
    })).filter(a => a.sym_id && a.amount);

    return await assets.mapAsync(async a => ({
        ...(await getFungible(a.sym_id, {})),
        ...a,
    }));
}

const getAddressHistory = async (id, {
    page = 0,
    size = 15,
    filter = "all",
    domain = null
}) => {
    id = (id || '').replace(/VCC/, 'EVT');
    page = parseInt(page, 10);
    if (!page || page < 0) page = 0;
    size = parseInt(size, 10);
    if (!size || size < 5) size = 5;

    let queries = [id || "", size, size * page];
    let schema = "";
    if (filter === "send") schema = "a.data->>'from'=$1";
    else if (filter === "receive") schema = "a.data->>'to'=$1";
    else if (filter === "domain") schema = "a.data->>'creator'=$1";
    else if (filter === "issue-token") schema = "a.data->>'owner'=$1";
    else if (filter === "issue-fungible") schema = "a.name='issuefungible' AND a.data->>'address'=$1";
    else if (filter === "issue") schema = "a.data->>'owner'=$1 OR (a.name='issuefungible' AND a.data->>'address'=$1)";
    else if (filter === "pay-charge") schema = "a.data->>'payer'=$1";
    else schema = "a.data->>'from'=$1 OR a.data->>'to'=$1 OR a.data->>'creator'=$1 OR a.data->>'owner'=$1 OR (a.name='issuefungible' AND a.data->>'address'=$1) OR a.data->>'payer'=$1";
    if (domain) {
        schema = `(${schema}) AND a.domain=$4`;
        queries.push(domain);
    }

    let res = await postgres.db(async db => {
        const actions = (await db.query(`SELECT a.*, t.* FROM actions a LEFT JOIN transactions t ON a.trx_num = t.trx_num WHERE ${schema} ORDER BY a.global_seq DESC LIMIT $2 OFFSET $3`, queries)).rows || [];
        actions.forEach(a => {
            if (!a.timestamp) a.timestamp = a.created_at;
        });
        return actions;
    });
    return res[1] || [];
}

const getValidator = async id => {
    let res = await postgres.db(async db => {
        const validator = (await db.query(`SELECT * FROM validators WHERE id=$1 LIMIT 1`, [id || ""])).rows[0] || null;
        if (!validator) return null;
        const netvalues = (await db.query(`SELECT * FROM netvalues WHERE validator_id=$1`, [id || ""])).rows || [];
        const node = evtnet.getRandomNode('AP');
        let chainData = {};
        try {
            chainData = (await Axios.post(node.addr + `/v1/evt/get_validator`, {
                name: validator.name || ''
            })).data;
        } catch(err) {
            console.error('Query Error: Cannot get validator', validator.name);
        }
        return {
            validator: {
                ...validator,
                ...chainData
            },
            netvalues
        }
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
    ['get', '/nonfungible/token/:id', getDetail(getNonfungibleDistribution)],
    ['get', '/address/:id', getDetail(getAddress)],
    ['get', '/addressAssets/:id', getDetail(getAssets)],
    ['get', '/addressHistory/:id', getDetail(getAddressHistory)],
    ['get', '/validator/:id', getDetail(getValidator)]
];