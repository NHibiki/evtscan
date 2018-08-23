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