import Axios from 'axios';

let LOCALDEV = false;
let endPoint = "http://localhost/api";
try {
    LOCALDEV = process.env.PORT;
    endPoint = LOCALDEV ? `http://localhost:${LOCALDEV}/api` : "http://localhost/api";
} catch (error) {}
try {
    endPoint = (window.location.protocol || "https:") + "//" + (window.location.host || "evtscan.io") + "/api";
} catch (error) {}

// endPoint = "https://w.yuuno.cc:3000/api";
// endPoint = "https://evtscan.io/api";

export const get = async (uri, params={}, headers={}) => Axios.get(endPoint + uri, { params, headers });

export const getRecent = async (thing, page=0, size=15, since=null, filter=null, from=null) => {
    if (['everipay', 'everipass'].includes(thing)) return getTrxByName(thing, page, size, since, from);
    return get(thing.startsWith('/') ? thing : "/" + thing,
        { page, size, since, from, filter }, {});
}

export const getTrxByName = async (name, page=0, size=15, since=null, from=null) => {
    return get(`/trxByName`, { trx_name: name, page, size, since, from });
}

export const getDetail = async (thing, id) => {
    return get(( thing.startsWith('/') ? thing : "/" + thing ) + "/" + id);
}

export const getDetailWithPage = async (thing, id, page=0, size=15, addons={}) => {
    return get(( thing.startsWith('/') ? thing : "/" + thing ) + "/" + id, {page, size, ...addons});
}

export const getTrxOnBlock = async (id, page=0, size=15, since=null) => {
    return get(`/transaction`, {block_id: id, page, size, since});
}

export const getActionOnTrx = async (id, page=0, size=15, since=null) => {
    return get(`/action`, {trx_id: id, page, size, since});
}

export const getActionOnFungible = async (id, page=0, size=15, since=null) => {
    return get(`/action`, {sym_id: id, page, size, since});
}

export const getHistoryOnAddress = async (id, page=0, size=15, filter="") => {
    let addons = {};
    if (filter) addons = {filter};
    return getDetailWithPage(`addressHistory`, id, page, size, addons);
}

export const searchAddress = async (keyword=null) => {
    return get(`/searchAddress`,{keyword});
}

export const getChainInfo = async () => {
    return get(`/chainInfo`);
}

export const getSiteInfo = async () => {
    return get(`/info`);
}

export default {
    LOCALDEV,
    endPoint,
    searchAddress,
    get,
    getChainInfo,
    getSiteInfo,
    getRecent,
    getTrxByName,
    getDetail,
    getDetailWithPage,
    getTrxOnBlock,
    getActionOnTrx,
    getHistoryOnAddress,
}