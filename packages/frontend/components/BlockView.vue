<template>
    <div class='item'>
        <nuxt-link class='blocknum' :to="$i18n.path('/block/' + item.block_id)"><span>Block</span> <span>#{{ item.block_num }}</span></nuxt-link>
        <div class='blockspec'>
            <span><i>Produced By:</i> <b>#{{ item.producer }}</b></span>
            <span><i>Block ID:</i> <nuxt-link :title="item.block_id" :to="$i18n.path('/block/' + item.block_id)">{{ item.block_id }}</nuxt-link></span>
            <span><i>Trxes:</i> <b>{{ item.trx_count }}</b> &nbsp;&nbsp; Pending: <b :style="`color:${item.pending ? 'green' : 'red'}`">{{ item.pending }}</b></span>
        </div>
        <Timer :timestamp="new Date(item.timestamp).getTime()"/>
    </div>
</template>

<script>
    import Timer from '~/components/Timer';

    export default {
        name: 'BlockView',
        props: ['item'],
        data () { return {} },
        components: { Timer },
    }
</script>

<style lang='scss' scoped>

    @import "@/assets/define.scss";

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
                background: $themeColor;
                color: #FFF;
            }
        }

        * {
            @include withRoboto(400);
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
                        color: $themeColor;
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
            background: darken($themeColor, 15);
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
            color: $themeColor;
        }

        i {
            font-style: normal;
            font-weight: 500;
            margin-right: 6px;
        }

    }
</style>
