const postgres = require('../lib/postgres.js');
const Utils = require('../lib/utils');

const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

const TYPE_PLAIN = 'text/plain';
const TYPE_CSV = 'text/csv';
const TYPE_JSON = 'application/json';

const pick = (origin={}, target=[], defaultValue='', flat=true) => {
    const res = {};
    target.forEach(k => {
        res[k] = typeof origin[k] === 'undefined'
            ? defaultValue
            : origin[k];
        if (flat) {
            if (typeof res[k] === 'array' || res[k].__ismerged) {
                res[k] = res[k].join(',');
            } else if (res[k] instanceof Date) {
                res[k] = res[k].toISOString();
            } else if (typeof res[k] !== 'string') {
                res[k] = JSON.stringify(res[k]);
            }
        }
    });
    return res;
}

// get details of blocks or transactions
const exportFile = fn => async (ctx, next) => {

    let {type, id} = ctx.params;

    // check params of input
    if (!id) {
        ctx.body = {
            state: 0,
            error: "invalid id",
        };
        return;
    }

    if (!['csv', 'json'].includes(type)) {
        type = 'csv';
    }

    const startTime = Date.now();

    // set return content of query
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, OPTION');
    
    let result = { state: 0, error: 'Internal Server Error!' };
    try {
        result = {
            state: 1,
            data: await fn(id, ctx.query || {})
        };
    } catch(err) {
        Utils.logWithType('Error', err);
    }
    if (!result.error && !result.data || !Object.keys(result.data).length) result = { state: 0, error: "Resource Not Found!" };

    if (result.state) {
        let entries = (ctx.query.entries || '').split(',').filter(Boolean);
        if (!entries.length) entries = Object.keys(result.data[0]);
        const data = result.data.map(d => pick(d, entries, ""));
        if (type === 'csv') {
            const csvStringifier = createCsvStringifier({
                header: entries.map(e => ({id: e, title: e}))
            });
            ctx.set('Content-disposition', `attachment; filename=${id}.csv`);
            ctx.type = TYPE_CSV;
            ctx.body = csvStringifier.getHeaderString()
                + csvStringifier.stringifyRecords(data);
        } else {
            ctx.set('Content-disposition', `attachment; filename=${id}.json`);
            ctx.type = TYPE_JSON;
            ctx.body = data;
        }
    } else {
        ctx.status = 400;
        ctx.type = TYPE_PLAIN;
        ctx.body = result.error;
    }

    Utils.log(`E|TimeUsing: ${Date.now() - startTime}`, ctx.request.path, ctx.request.querystring);
    
}

const getActions = async (id, {from, to, actions}) => {
    [from, to] = [parseInt(from, 10), parseInt(to, 10)];
    if (!to) to = Date.now();
    if (!from) from = to - 7 * 24 * 3600 * 1000;
    if (!Number.isInteger(to) || !Number.isInteger(from)) {
        return [];
    }

    if (!actions) actions = 'everipay,transferft';
    actions = actions.split(',');

    const addons = actions.map((_, i) => `$${4+i}`).join(',');
    let res = await postgres.db(async db => {
        const res = (await db.query(`SELECT a.*, t.* FROM actions a INNER JOIN transactions t ON a.trx_num = t.trx_num WHERE t.timestamp>=$1 AND t.timestamp<=$2 AND key=$3 AND a.name IN (${addons})`, [new Date(from), new Date(to), id, ...actions])).rows || [];
        return res.map(r => ({...r, ...r.data, data: undefined}));
    });
    return res[1] || [];
}

const getTrx = async (id, {from, to, actions, with: w=''}) => {
    if (!actions) actions = 'everipay,transferft';
    actions = actions.split(',');
    w = w.split(',').filter(Boolean);
    w.forEach(k => {
        if (actions.indexOf(k === -1)) {
            actions.push(k);
        }
    });
    const target = (1 << w.length) - 1;
    const act = await getActions(id, {from, to, actions: actions.join(',')});
    const actMap = {};
    const res = [];
    
    act.forEach(a => {
        if (actMap[a.trx_num]) {
            actMap[a.trx_num].trx = Utils.shallowMerge(actMap[a.trx_num].trx, a);
        } else {
            actMap[a.trx_num] = {
                trx: a,
                name: 0
            }
        }
        actMap[a.trx_num].name |= Math.max(1 << w.indexOf(a.name), 0);
        if (actMap[a.trx_num].name === target) {
            res.push(actMap[a.trx_num]);
            actMap[a.trx_num].name += 1;
        }
    });

    return res.map(r => r.trx);
}

module.exports = [
    ['get', '/export/actions/:type/:id', exportFile(getActions)],
    ['get', '/export/trx/:type/:id', exportFile(getTrx)]
];
