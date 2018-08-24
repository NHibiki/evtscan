<template>
    <div class='item'>
        <div class='blockspec'>
            <span><i>TX#:</i> <router-link :to="'/trx/' + item.trx_id">{{ "0x" + item.trx_id.toLocaleUpperCase() }}</router-link></span>
            <span><i>Payer:</i> <span class="shortspan"><span>{{ "0x" + item.payer.toLocaleUpperCase() }}</span></span>
                  &nbsp;&nbsp;on&nbsp;&nbsp;&nbsp; <router-link :to="'/block/' + item.block_num"><span class="shortspan"><span>{{ "0x" + item.block_id.toLocaleUpperCase() }}</span></span></router-link></span>
            <span><i>Trace:</i> <b>{{ item.trace.charge }}</b> charged <b>{{ item.trace.elapsed }}</b> elapsed</span>
        </div>
        <div class='timer'> &lt; {{ since(item.updated_at) }} secs </div>
    </div>
</template>

<script>
    export default {
        name: 'TrxView',
        props: ['item'],
        data () {
            return {
            }
        },
        methods: {
            since(time) {
                return Math.round((new Date().getTime() - new Date(time).getTime()) / 10) / 100;
            }
        },
        created() {}
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

        .timer {
            position: absolute;
            font-size: 14px;
            right: 8px;
            bottom: 8px;
            font-weight: 300;
            color: #666;
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

                a {
                    transition: .1s linear;
                    text-decoration: none;
                    outline: none;
                    color: #59E;

                    &:hover {
                        color: #e6a938;
                    }

                }

                &.shortspan {
                    display: inline-flex;
                    max-width: 35%;
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
