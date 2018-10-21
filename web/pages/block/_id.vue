<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
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
        computed: mapState(['id', 'data', 'trxData']),
        components: { Table },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, isServer}) { store.commit('block/resetData', route.params.id); let promise = store.dispatch('block/updateData'); if (isServer) return promise; },
        methods: {
            click(i) { this.$router.push("/trx/" + this.trxData[i][0]) },
            ...mapMutations(['resetData']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";

</style>