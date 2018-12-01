<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2>Address <router-link :to="'/address/' + id" style="margin-left: 4px;">#{{ id }}</router-link></h2>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :data="data"/>
        </div>
        <div class='grid'>
            <h2>History</h2>
            <Table :head="historyHead" :data="historyData" :clickable="true" @click="click"/>
            <div class="pager">
                <a class="btn" href="javascript:;" @click="more(-1)"><fa icon="angle-left"/></a>
                <span> Page {{ page + 1 }} </span>
                <a class="btn" href="javascript:;" @click="more(1)"><fa icon="angle-right"/></a>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('address');

    import Table from '~/components/Table';

    export default {
        name: 'Address',
        data () {
            return {
                historyHead: ["Type", "Domain", "Key", "Trx ID", "Timestamp"],
            }
        },
        computed: mapState(['id', 'data', 'historyData', ,'historyDataDetail', 'page']),
        components: { Table },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, isServer}) { store.commit('address/resetData', route.params.id); let promise = store.dispatch('address/updateData'); if (isServer) return promise; },
        methods: {
            click(i) { this.$router.push("/trx/" + this.historyDataDetail[i].trx_id) },
            ...mapMutations(['resetData']),
            ...mapActions(['updateData', 'more']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";
    @import "@/assets/components/tablePager.scss";

</style>