<template>
    <div>
        <div class='grid'>
            <h2>Block <router-link :to="'/block/' + id" style="margin-left: 4px;">#{{ id }}</router-link></h2>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :data="data"/>
        </div>
        <div class='grid'>
            <h2>Transactions</h2>
            <Table :head="trxHead" :data="trxData" :clickable="true" @click="click"/>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('block');

    import Table from '~/components/Table';

    export default {
        name: 'Block',
        data () {
            return {
                trxHead: ["Trx ID", "Pending", "Timestamp"],
            }
        },
        computed: mapState(['id', 'data', 'trxData', 'ssr']),
        components: { Table },
        created() { if (this.ssr) {this.isSSR(false); return;} this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route}) { store.commit('Block/isSSR'); store.commit('Block/resetData', route.params.id); return store.dispatch('Block/updateData'); },
        methods: {
            click(i) { this.$router.push("/trx/" + this.trxData[i][0]) },
            ...mapMutations(['resetData', 'isSSR']),
            ...mapActions(['updateData']),
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
            font-family: "Quicksand";
            font-weight: 500;
            margin: 2px 0;
            padding: 6px 20px;
            display: block;
            position: absolute;
            right: 20px;
            top: 22px;
            color: #e6a938;
            /* border: 1px solid #e6a938; */
            box-shadow: 0 5px 15px rgba(0, 0, 0, .1);
            border-radius: 40px;

            &:hover {
                background: #e6a938;
                color: white;
                box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
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
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: 'Quicksand';
        }

    }

</style>