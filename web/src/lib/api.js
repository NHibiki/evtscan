import Axios from 'axios';

const LOCALDEV = true;

let endPoint = LOCALDEV ? 
                    "http://localhost:8080/api" :
                    "https://evtscan.io/api";

export const get = async (uri, params={}, headers={}) => Axios.get(endPoint + uri, { params, headers });

export const getRecent = async (thing, page=0, size=15, since=null) => {
    return get(thing.startsWith('/') ? thing : "/" + thing,
        { page, size, since }, {});
}