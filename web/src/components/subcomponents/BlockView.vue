<template>
    <div class='item'>
        <router-link class='blocknum' :to="'/block/' + item.block_num"><span>Block</span> <span>#{{ item.block_num }}</span></router-link>
        <div class='blockspec'>
            <span><i>Produced By:</i> <b>#{{ item.producer }}</b></span>
            <span><i>Block ID:</i> <router-link :title="item.block_id" :to="'/block/' + item.block_num">{{ item.block_id }}</router-link></span>
            <span><i>Trxes:</i> <b>{{ item.trx_count }}</b> &nbsp;&nbsp; Pending: <b :style="`color:${item.pending ? 'green' : 'red'}`">{{ item.pending }}</b></span>
        </div>
        <div class='timer'> &gt; {{ since(item.timestamp) }} </div>
    </div>
</template>

<script>
    import { msToTimeStr } from '@/lib/util';

    export default {
        name: 'BlockView',
        props: ['item'],
        data () {
            return {
            }
        },
        methods: {
            since(time) {
                return msToTimeStr(new Date().getTime() - new Date(time).getTime());
            }
        }
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
            & .blocknum {
                background: #e6a938;
                color: #FFF;
            }
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
            margin: 20px 0px;
            font-weight: 300;
            font-size: 14px;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            overflow-x: hidden;
            margin-right: 15px;

            span {
                overflow-x: hidden;
                word-break: break-all;
                text-overflow: ellipsis;
                white-space: nowrap;

                a {
                    transition: .1s linear;
                    text-decoration: none;
                    outline: none;
                    color: #26E;

                    &:hover {
                        color: #e6a938;
                    }

                }
            }

        }

        .blocknum {
            text-decoration: none;
            outline: none;
            font-weight: 600;
            text-align: center;
            margin: 20px 20px;
            color: #EEE;
            background: #8c5b00;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            line-height: 14px;
            font-size: 14px;
            padding: 8px 25px;
            border-radius: 5px;
            cursor: pointer;
            transition: .3s linear;
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
</style>
