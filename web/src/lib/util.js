export const tablizeBlock = function (data) {

    let res = [];
    delete data._id;
    delete data.timestamp;

    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    return  res;

}

export const tablizeBlockTrx = function (data) {

    let res = [];
    delete data._id;

    data.forEach(d => {
        res.push([d.trx_id, d.pending, d.updated_at]);
    });

    return  res;

}

export const tablizeTrx = function (data) {

    let res = [];
    delete data._id;
    delete data.created_at;
    delete data.expiration;
    delete data.seq_num;
    delete data.action_count;

    let trace = data.trace;
    delete data.trace;
    data["Trace.Elapsed"] = trace.elapsed + " us";
    data["Trace.Charge"]  = trace.charge / 10e4 + " EVT/PEVT";

    let { keys, signatures } = data;
    delete data.keys;
    delete data.signatures;

    for (let key in data) {
        res.push([key.split("_").map(it => it[0].toLocaleUpperCase() + it.substr(1)).join(" "), data[key]]);
    }

    keys = keys.map(k => [k]);
    signatures = signatures.map(k => [k]);

    return [res, keys, signatures];

}

export const tablizeTrxAction = function (data) {

    let res = [];
    let resData = [];
    delete data._id;

    data.forEach(d => {
        res.push([d.name, d.domain, d.key]);
        resData.push(d.data);
    });

    return [res, resData];

}