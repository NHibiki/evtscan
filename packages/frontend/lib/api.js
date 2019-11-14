import Axios from 'axios';
import {
  shared
} from './util';

export const VASTCHAIN_API = 'https://v1.api.tc.vastchain.ltd';

let LOCALDEV = false;
let endPoint = "http://localhost/api";
try {
  LOCALDEV = process.env.PORT;
  endPoint = LOCALDEV ? `http://localhost:${LOCALDEV}/api` : "http://localhost/api";
} catch (error) {}
try {
  endPoint = (window.location.protocol || "https:") + "//" + (window.location.host || "evtscan.io") + "/api";
} catch (error) {}

// endPoint = "http://server:3000/api";
// endPoint = "https://explorer.vastchain.cn/api";

export const get = async (uri, params = {}, headers = {}) => {
  const res = await Axios.get(endPoint + uri, {
    params,
    headers
  });
  if (res.data && res.data.context) {
    shared.context = res.data.context;
  }
  return res;
}

export const getRecent = async (thing, page = 0, size = 15, before = null, filter = null, from = null) => {
  if (['everipay', 'everipass'].includes(thing)) return getTrxByName(thing, page, size, before, from);
  return get(thing.startsWith('/') ? thing : "/" + thing, {
    page,
    size,
    before,
    from,
    filter
  }, {});
}

export const getTrxByName = async (name, page = 0, size = 15, before = null, from = null) => {
  return get(`/trxByName`, {
    trx_name: name,
    page,
    size,
    before,
    from
  });
}

export const getDetail = async (thing, id) => {
  return get((thing.startsWith('/') ? thing : "/" + thing) + "/" + id);
}

export const getDetailWithPage = async (thing, id, page = 0, size = 15, addons = {}) => {
  return get((thing.startsWith('/') ? thing : "/" + thing) + "/" + id, {
    page,
    size,
    ...addons
  });
}

export const getTrxOnBlock = async (id, page = 0, size = 15, before = null) => {
  return get(`/transaction`, {
    block_id: id,
    page,
    size,
    before
  });
}

export const getActionOnTrx = async (num, page = 0, size = 15, before = null) => {
  return get(`/action`, {
    trx_num: num,
    page,
    size,
    before
  });
}

export const getActionOnFungible = async (id, page = 0, size = 15, before = null) => {
  return get(`/action`, {
    sym_id: id,
    page,
    size,
    before
  });
}

export const getHistoryOnAddress = async (id, page = 0, size = 15, filter = "") => {
  let addons = {};
  if (filter) addons = {
    filter
  };
  return getDetailWithPage(`addressHistory`, id, page, size, addons);
}

export const searchAddress = async (keyword = null) => {
  return get(`/searchAggregate`, {
    keyword
  });
}

export const searchAll = async (keyword = null) => {
  return get(`/searchAll`, {
    keyword
  });
}

export const searchOne = async (keyword = null) => {
  return get(`/searchOne`, {
    keyword
  });
}

export const getChainInfo = async () => {
  return get(`/chainInfo`);
}

export const getSiteInfo = async () => {
  return get(`/info`);
}

export const getDonationUrl = async onChainId => {
  const [domain, token] = onChainId.split(':');
  try {
    const res = await Axios.get(`${VASTCHAIN_API}/common-chain-upload/blockchain-explorer/fromChainData?domain=${domain}&token=${token}`);
    return res.data.path || '';
  } catch (err) {
    console.error(err);
    return '';
  }
}

export default {
  VASTCHAIN_API,
  LOCALDEV,
  endPoint,
  searchAddress,
  searchAll,
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
  getDonationUrl,
}
