<template>
    <div class='item'>
        <div class='blockspec'>
            <span><i>TX#:</i> <router-link :to="'/trx/' + item.trx_id">{{ "0x" + item.trx_id.toLocaleUpperCase() }}</router-link></span>
            <span><i>Payer:</i> <span class="shortspan"><span :title="item.payer.toLocaleUpperCase()">{{ item.payer.toLocaleUpperCase() }}</span></span>
                  &nbsp;&nbsp;on&nbsp;&nbsp;&nbsp; <router-link :to="'/block/' + item.block_id"><span class="shortspan"><span :title="'0x' + item.block_id.toLocaleUpperCase()">{{ "0x" + item.block_id.toLocaleUpperCase() }}</span></span></router-link></span>
            <span v-if="endpoint === 'transaction'"><i>Trace:</i> <b>{{ (item.trace || item).charge / 100000.0 }} EVT</b> charged <!-- &nbsp;<b>{{ (item.trace || item).elapsed }} us</b> elapsed --> </span>
            <span v-if="endpoint === 'everipay'"><i>Pay:</i> <b>{{ item.data.number }}</b> &nbsp;<i>To</i> <span class="shortspan"><span :title="item.data.payee.toLocaleUpperCase()">{{ item.data.payee.toLocaleUpperCase() }}</span></span></span>
            <span v-if="endpoint === 'everipass'"><i>Domain:</i> <span class="shortspan"><span><b>{{ item.domain }}</b></span></span> &nbsp;<i>with Key</i> <span class="shortspan"><span :title="(item.data.key || 'NONE').toLocaleUpperCase()">{{ (item.data.key || 'NONE').toLocaleUpperCase() }}</span></span></span>
        </div>
        <Timer :timestamp="new Date(item.timestamp || item.updated_at).getTime()"/>
    </div>
</template>

<script>
    import Timer from '~/components/Timer';

    export default {
        name: 'TrxView',
        props: ['item', 'endpoint'],
        data () { return {} },
        components: { Timer },
    }
</script>

<style lang='scss' scoped>
    .item {
        background: #EEE;
        width: calc(100% - 40px);
        margin: 20px;
        height: 100px;
        border-radius: 5px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, .05);
        display: flex;
        white-space: between;
        flex-direction: row;
        position: relative;
        transition: .3s linear;

        &:hover {
            box-shadow: 0 5px 35px rgba(0, 0, 0, .15);
        }

        * {
            font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
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
                    transition: .1s linear;
                    text-decoration: none;
                    outline: none;
                    color: #26E;

                    &:hover {
                        color: #e6a938;
                    }

                }

                &.shortspan {
                    display: inline-flex;
                    max-width: 30%;
                }
            }

            span > b {
                color: #e6a938;
            }

            i {
                font-style: normal;
                font-weight: 500;
                margin-right: 6px;
            }

        }

    }
</style>
