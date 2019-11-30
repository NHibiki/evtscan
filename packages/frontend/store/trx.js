import {
  getDetail,
  getActionOnTrx
} from '~/lib/api';
import {
  tablizeTrx,
  tablizeTrxAction
} from '~/lib/util';

export const state = () => ({
  id: "",
  data: null,
  keys: null,
  sigs: null,
  actions: null,
  trxData: null,
  actionsData: [],
  showData: {},
  showModal: false
});

export const mutations = {
  resetData: (state, id) => {
    state.id = id;
    state.data = null;
    state.keys = null;
    state.sigs = null;
    state.actions = null;
    state.trxData = null;
  },
  closeModal(state) {
    state.showModal = false
  },
  openModal(state, i) {
    state.showData = state.actionsData[i || 0] || {}
    state.showModal = true
  },
  updateDataMut: (state, thing = {}) => {
    Object.keys(thing).forEach(k => {
      state[k] = thing[k];
    });
  }
};

export const actions = {
  updateData: async ({
    commit,
    state
  }) => {
    const trx = await getDetail("transaction", state.id);
    const trxData = trx.data.data || {};
    const recvData = await getActionOnTrx(trxData.trx_num);
    const [data, keys, sigs] = tablizeTrx(trxData);
    const [actions, actionsData] = tablizeTrxAction(recvData.data.data);
    commit('updateDataMut', {
      data,
      keys,
      sigs
    });
    commit('updateDataMut', {
      actions,
      actionsData,
      showData: actionsData[0]
    });
  }
};
