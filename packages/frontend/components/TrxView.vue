<template>
  <div class="item">
    <div class="blockspec">
      <span>
        <i>{{ parseFeKey('trx_id') }}:</i>
        <nuxt-link
          :to="$i18n.path('/trx/' + item.trx_id)"
        >{{ "0x" + item.trx_id }}</nuxt-link>
      </span>
      <span>
        <i>{{ parseFeKey('payer') }}:</i>
        <span class="shortspan">
          <span :title="item.payer">{{ item.payer }}</span>
        </span>
        &nbsp;&nbsp;{{ parseFeKey('pay_on') }}&nbsp;&nbsp;&nbsp;
        <nuxt-link :to="$i18n.path('/block/' + item.block_id)">
          <span class="shortspan">
            <span :title="'0x' + item.block_id">{{ "0x" + item.block_id }}</span>
          </span>
        </nuxt-link>
      </span>
      <span v-if="endpoint === 'transaction'">
        <i>{{ parseFeKey('trace') }}:</i>
        <b>{{ (item.trace || item).charge / 100000.0 }}</b>
        {{ parseFeKey('charged') }}
        <!-- &nbsp;<b>{{ (item.trace || item).elapsed }} us</b> elapsed -->
      </span>
      <span v-if="endpoint === 'everipay'">
        <i>{{ parseFeKey('pay') }}:</i>
        <b>{{ item.data.number }}</b> &nbsp;
        <i>{{ parseFeKey('pay_to') }}</i>
        <span class="shortspan">
          <span
            :title="item.data.payee"
          >{{ item.data.payee }}</span>
        </span>
      </span>
      <span v-if="endpoint === 'everipass'">
        <i>{{ parseFeKey('domain') }}:</i>
        <span class="shortspan">
          <span>
            <b>{{ item.domain }}</b>
          </span>
        </span> &nbsp;
        <i>{{ parseFeKey('with_key') }}</i>
        <span class="shortspan">
          <span
            :title="(item.data.key || 'NONE')"
          >{{ (item.data.key || 'NONE') }}</span>
        </span>
      </span>
    </div>
    <Timer :timestamp="new Date(item.timestamp || item.updated_at).getTime()" />
  </div>
</template>

<script>
import Timer from "~/components/Timer";
import { parseFeKey } from "~/lib/util";

export default {
  name: "TrxView",
  props: ["item", "endpoint"],
  data() {
    return {};
  },
  methods: {
    parseFeKey
  },
  components: { Timer }
};
</script>

<style lang='scss' scoped>
.item {
  background: #eee;
  width: calc(100% - 40px);
  margin: 20px;
  height: 100px;
  border-radius: 5px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  display: flex;
  white-space: between;
  flex-direction: row;
  position: relative;
  transition: 0.3s linear;

  &:hover {
    box-shadow: 0 5px 35px rgba(0, 0, 0, 0.15);
  }

  * {
    font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial,
      "Microsoft YaHei", "Helvetica Neue", sans-serif;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }

  .blockspec {
    margin: 20px;
    font-weight: 300;
    font-size: 14px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    overflow-x: hidden;

    span {
      overflow-x: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;

      a {
        transition: 0.1s linear;
        text-decoration: #27a4ff underline;
        outline: none;
        color: #27a4ff;
        font-weight: 700;

        &:hover {
          color: #127cef;
        }
      }

      &.shortspan {
        display: inline-flex;
        max-width: 30%;
      }
    }

    span > b {
      color: #002cd9;
    }

    i {
      font-style: normal;
      font-weight: 500;
      margin-right: 6px;
    }
  }
}
</style>
