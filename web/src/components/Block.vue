<template>
    <div>
        <div class='grid'>
            <h2>Block <router-link :to="'/block/' + id" style="margin-left: 4px;">#{{ id }}</router-link></h2>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :data="data"/>
        </div>
        <div class='grid'>
            <h2>Transactions</h2>
            <Table :head="trxHead" :data="trxData"/>
        </div>
    </div>
</template>

<script>
    import Table from '@/components/subcomponents/Table';
    import { getDetail, getTrxOnBlock } from '@/lib/api';
    import { tablizeBlock, tablizeBlockTrx } from '@/lib/util';

    export default {
        name: 'Block',
        data () {
            return {
                id: this.$route.params.id,
                data: [],
                trxHead: ["Trx ID", "Pending", "Timestamp"],
                trxData: [],
            }
        },
        components: { Table },
        created() {
            getDetail("block", this.$route.params.id)
                .then(data => {
                    this.data = tablizeBlock(data.data.data);
                })
                .catch(err => { console.error(err); })
            getTrxOnBlock(this.$route.params.id)
                .then(data => {
                    this.trxData = tablizeBlockTrx(data.data.data);
                })
                .catch(err => { console.error(err); })
        }
    }
</script>

<style lang='scss' scoped>

    .grid {
        background: #FFF;
        width: calc(100% - 40px);
        margin: 32px auto;
        max-width: 920px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, .05);
        position: relative;

        .sidebtn {
            font-family: "Roboto";
            padding: 6px 20px;
            display: block;
            position: absolute;
            right: 20px;
            top: 22px;
            color: #e6a938;
            border: 1px solid #e6a938;
            border-radius: 8px;

            &:hover {
                background: #e6a938;
                color: white;
            }

        }

        * {
            font-weight: 300;
        }

        a {
            transition: .1s linear;
            text-decoration: none;
            outline: none;
            color: #999;

            &:hover {
                color: #e6a938;
            }

        }

        h1, h2, h3, h4, h5, p, span {
            font-weight: 300;
            font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }

        h2 {
            font-weight: 400;
            margin: 24px 18px;
            padding-left: 6px;
        }

    }

</style>