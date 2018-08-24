import Axios from 'axios';

const LOCALDEV = false;

let endPoint = LOCALDEV ? 
                    "http://localhost:8080/api" :
                    ((window.location.protocol || "https:") + "//" + (window.location.host || "evtscan.io") + "/api");

export const get = async (uri, params={}, headers={}) => Axios.get(endPoint + uri, { params, headers });

export const getRecent = async (thing, page=0, size=15, since=null) => {
    return get(thing.startsWith('/') ? thing : "/" + thing,
        { page, size, since }, {});
}

export const getDetail = async (thing, id) => {
    return get(( thing.startsWith('/') ? thing : "/" + thing ) + "/" + id);
}

export const getTrxOnBlock = async (id, page=0, size=30, since=null) => {
    return get(`/transaction`, {block_num: id, page, size, since});
}

export const getActionOnTrx = async (id, page=0, size=30, since=null) => {
    return get(`/action`, {trx_id: id, page, size, since});
}

export default {
    LOCALDEV,
    endPoint,
    get,
    getRecent,
    getDetail,
    getTrxOnBlock,
    getActionOnTrx
}