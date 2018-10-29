import Axios from 'axios';

let LOCALDEV = false;
let endPoint = "http://localhost/api";
try {
    LOCALDEV = process.env.NUXT_START_ENV === "dev" ? true : false;
    endPoint = LOCALDEV ? "http://localhost:8080/api" : "http://localhost/api";
} catch (error) {}
try {
    LOCALDEV = window.location.host.startsWith("localhost");
    endPoint = LOCALDEV ? 
                    "http://localhost:8080/api" :
                    ((window.location.protocol || "https:") + "//" + (window.location.host || "evtscan.io") + "/api");
} catch (error) {}

export const get = async (uri, params={}, headers={}) => Axios.get(endPoint + uri, { params, headers });

export const getRecent = async (thing, page=0, size=15, since=null) => {
    if (['everipay', 'everipass'].includes(thing)) return getTrxByName(thing, page, size, since);
    return get(thing.startsWith('/') ? thing : "/" + thing,
        { page, size, since }, {});
}

export const getTrxByName = async (name, page=0, size=15, since=null) => {
    return get(`/trxByName`, { trx_name: name, page, size, since });
}

export const getDetail = async (thing, id) => {
    return get(( thing.startsWith('/') ? thing : "/" + thing ) + "/" + id);
}

export const getDetailWithPage = async (thing, id, page=0, size=15) => {
    return get(( thing.startsWith('/') ? thing : "/" + thing ) + "/" + id, {page, size});
}

export const getTrxOnBlock = async (id, page=0, size=30, since=null) => {
    return get(`/transaction`, {block_num: id, page, size, since});
}

export const getActionOnTrx = async (id, page=0, size=30, since=null) => {
    return get(`/action`, {trx_id: id, page, size, since});
}

export const getChainInfo = async () => {
    return get(`/chainInfo`);
}

export default {
    LOCALDEV,
    endPoint,
    get,
    getChainInfo,
    getRecent,
    getTrxByName,
    getDetail,
    getDetailWithPage,
    getTrxOnBlock,
    getActionOnTrx,
}