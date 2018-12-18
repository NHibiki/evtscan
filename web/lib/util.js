export const showListNames = ['Transactions', 'Blocks', 'Fungibles', 'Nonfungibles', 'Domains', 'Groups'];

export const msToTimeStr = function (time=0, fix=true) {

    let timeStr = 's';
    time = parseInt(time, 10) || 0;
    if (fix && time < 0) time = 0;

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
    } else if ('change' in data && 'elapsed' in data) {
        data["Trace.Elapsed"] = data.elapsed + " us";
        data["Trace.Charge"]  = data.charge / 10e4 + " EVT/PEVT";
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
    [data.issue || null, data.manage || null].forEach(d => {
        if (!d) return;
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

    if (data.total_supply) data.total_supply = (parseInt(data.total_supply, 10) || "N/A").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    return [res, detailedData, detailedActions, metaData];

}

export const tablizeNonFungible = function (data={}) {

    let res = [];
    delete data._id;

    if (data.data && data.data.name) data.name = data.data.name;
    if (data.data && data.data.creator) data.creator = data.data.creator;
    if (typeof data.seq_num !== "undefined") data.seq_num = `${data.seq_num} `;

    let detailedData = [];
    let detailedActions = [];
    let iData = data.data || {};
    [iData.issue || null, iData.transfer || null, iData.manage || null].forEach(d => {
        if (!d) return;
        detailedData.push([d.name, d.threshold, d.authorizers ? (d.authorizers.length || 0) : 0]);
        detailedActions.push(d);
    });
    delete data.data;

    let distributeData = data.distributes || null;
    delete data.distributes;

    data.created_by_trx = {
        hide: true,
        content: data.trx_id,
        type: "innerLink",
        data: `/trx/${data.trx_id}`
    };
    delete data.trx_id;

    if (data.created_at) data.timestamp = data.created_at;
    delete data.created_at;
    delete data.key;

    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    return [res, detailedData, detailedActions, distributeData];

}

export const tablizeDomain = function (data={}) {

    let res = [];
    delete data._id;

    if (data.created_at) data.timestamp = data.created_at;
    delete data.created_at;

    let detailedData = [];
    let detailedActions = [];
    [data.issue || null, data.transfer || null, data.manage || null].forEach(d => {
        if (!d) return;
        detailedData.push([d.name, d.threshold, d.authorizers ? (d.authorizers.length || 0) : 0]);
        detailedActions.push(d);
    });
    delete data.issue;
    delete data.manage;
    delete data.transfer;

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

export const tablizeGroup = function (data={}) {

    let res = [];
    delete data._id;

    if (data.created_at) data.timestamp = data.created_at;
    delete data.created_at;

    data = {...data, ...data.def};
    data.threshold = data.threshold || (data.root || {}).threshold || 0;
    delete data.def;

    let detailedData = [];
    let detailedActions = [];
    ((data.root || data).nodes || []).forEach(d => {
        if (!d || !d.weight) return;
        detailedData.push([d.weight, d.key || "Group"]);
        detailedActions.push(d);
    });
    delete data.root;
    data.nodes = detailedData.length;

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

export const tablizeAddress = function (data={}) {

    return Object.keys(data).map(key => {
        if (Number.isInteger(data[key])) {
            return [key.split("-").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]];
        }
        return null;
    }).filter(Boolean);

}

export const tablizeAddressAssets = function (data=[]) {

    return data.map(d => ([d.name, d.sym_id, d.amount])).filter(Boolean);

}

export const tablizeHistory = function (data=[]) {

    let res = [];

    res = data.map(d => {
        delete d._id;
        return [d.name, d.domain, d.key, d.trx_id, d.created_at];
    });

    return [res, data];

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
        res.push([d.trx_id, d.block_num, {content: `${d.pending}`, color:d.pending ? "green" : "red"}, d.created_at]);
        resData.push('/trx/' + d.trx_id);
    });

    return [res, resData];

}

export const tablizeFungibles = function (data=[]) {

    let res = [];
    let resData = [];

    data.forEach(d => {
        let firstEle = d.name;
        if (d.metas && Object.keys(d.metas).length) {
            Object.keys(d.metas).forEach(k => {
                if (d.metas[k] && d.metas[k].key === "symbol-icon") {
                    firstEle = {
                        content: d.name, 
                        type: "imageSrc", 
                        data: d.metas[k].value
                    };
                }
            })
            
        }
        res.push([firstEle, d.sym_id, d.creator, d.created_at]);
        resData.push('/fungible/' + d.sym_id);
    });

    return [res, resData];

}

export const tablizeNonFungibles = function (data=[]) {

    let res = [];
    let resData = [];

    data.forEach(d => {
        if (!d._id || !d.updated_at || typeof d.count === "undefined") return;
        res.push([d._id, d.count, d.updated_at]);
        resData.push('/nonfungible/' + d._id);
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

export const tablizeGroups = function (data=[]) {

    let res = [];
    let resData = [];
    data.forEach(d => {
        let def = d.def || {};
        res.push([d.name, d.key || "None", def.threshold || 0]);
        resData.push('/group/' + d.name);
    });

    return [res, resData];

}

export default {
    showListNames,
    msToTimeStr,

    tablizeBlock,
    tablizeBlockTrx,
    tablizeTrx,
    tablizeTrxAction,
    tablizeFungible,
    tablizeNonFungible,
    tablizeDomain,
    tablizeGroup,
    tablizeAddress,
    tablizeAddressAssets,
    tablizeHistory,
    tablizeBlocks,
    tablizeTransactions,
    tablizeFungibles,
    tablizeNonFungibles,
    tablizeDomains,
    tablizeGroups,
}