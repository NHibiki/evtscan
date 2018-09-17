export const msToTimeStr = function (time=0) {

    let timeStr = 's';
    time = parseInt(time, 10) || 0;

    // show percent of time if time is less than 60s
    if (time < 60 * 1000) return `${Math.floor(time / 10) / 100} secs`;
    else time = Math.floor(time / 1000);
    
    // show hhmmss of time
    timeStr = (time % 60) + timeStr;
    time = Math.floor(time / 60);
    if (time <= 0) return timeStr;
    else timeStr = "m " + timeStr;
    // else timeStr = "mins";

    timeStr = (time % 60) + timeStr;
    time = Math.floor(time / 60);
    if (time <= 0) return timeStr;
    else timeStr = time + "h " + timeStr;
    // else timeStr = time + "hours";

    return timeStr;

}

export const tablizeBlock = function (data={}) {

    let res = [];
    delete data._id;
    delete data.timestamp;

    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    return  res;

}

export const tablizeBlockTrx = function (data=[]) {

    let res = [];

    data.forEach(d => {
        res.push([d.trx_id, d.pending, d.created_at]);
    });

    return  res;

}

export const tablizeTrx = function (data={}) {

    let res = [];
    delete data._id;
    delete data.created_at;
    delete data.expiration;
    delete data.seq_num;
    delete data.action_count;

    let trace = data.trace;
    delete data.trace;
    if (trace) {
        data["Trace.Elapsed"] = trace.elapsed + " us";
        data["Trace.Charge"]  = trace.charge / 10e4 + " EVT/PEVT";
    }

    let { keys, signatures } = data;
    delete data.keys;
    delete data.signatures;

    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    keys = (keys || []).map(k => [k]);
    signatures = (signatures || []).map(k => [k]);

    return [res, keys, signatures];

}

export const tablizeTrxAction = function (data=[]) {

    let res = [];
    let resData = [];

    data.forEach(d => {
        res.push([d.name, d.domain, d.key]);
        resData.push(d.data);
    });

    return [res, resData];

}

export const tablizeFungible = function (data={}) {

    let res = [];
    delete data._id;

    if (data.created_at) data.timestamp = data.created_at;
    delete data.created_at;

    let detailedData = [];
    let detailedActions = [];
    [data.issue || [], data.manage || []].forEach(d => {
        if (!d.length) return;
        detailedData.push([d.name, d.threshold, d.authorizers ? (d.authorizers.length || 0) : 0]);
        detailedActions.push(d);
    });
    delete data.issue;
    delete data.manage;

    let metaData = {};
    if (!data.metas || !data.metas.length) metaData = null;
    else (data.metas || []).forEach(m => {
        metaData[m.key] = m;
    });
    delete data.metas;

    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    return [res, detailedData, detailedActions, metaData];

}

export const tablizeDomain = function (data={}) {

    let res = [];
    delete data._id;

    if (data.created_at) data.timestamp = data.created_at;
    delete data.created_at;

    let detailedData = [];
    let detailedActions = [];
    [data.issue || [], data.transfer || [], data.manage || []].forEach(d => {
        if (!d.length) return;
        detailedData.push([d.name, d.threshold, d.authorizers ? (d.authorizers.length || 0) : 0]);
        detailedActions.push(d);
    });
    delete data.issue;
    delete data.manage;
    delete data.transfer;

    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    return [res, detailedData, detailedActions];

}

export const tablizeBlocks = function (data=[]) {

    let res = [];
    let resData = [];

    data.forEach(d => {
        res.push([d.block_num, d.block_id, d.producer, d.timestamp]);
        resData.push('/block/' + d.block_num);
    });

    return [res, resData];

}

export const tablizeTransactions = function (data=[]) {

    let res = [];
    let resData = [];

    data.forEach(d => {
        res.push([d.trx_id, d.block_num, d.pending, d.created_at]);
        resData.push('/trx/' + d.trx_id);
    });

    return [res, resData];

}

export const tablizeFungibles = function (data=[]) {

    let res = [];
    let resData = [];

    data.forEach(d => {
        res.push([d.name, d.sym_id, d.creator, d.created_at]);
        resData.push('/fungible/' + d.name);
    });

    return [res, resData];

}

export const tablizeDomains = function (data=[]) {

    let res = [];
    let resData = [];

    data.forEach(d => {
        res.push([d.name, d.creator, d.created_at]);
        resData.push('/domain/' + d.name);
    });

    return [res, resData];

}

export default {
    msToTimeStr,

    tablizeBlock,
    tablizeBlockTrx,
    tablizeTrx,
    tablizeTrxAction,
    tablizeFungible,
    tablizeDomain,
    tablizeBlocks,
    tablizeTransactions,
    tablizeFungibles,
    tablizeDomains,
}