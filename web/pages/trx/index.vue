<template>
    <div>
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ name }} </h2>
            <div class="switch"><Switcher v-if="name === 'Transactions'" :tabs="trxTabs" :active="activeTab" /></div>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :head="tableHeader" :data="data" :clickable="true" @click="click"/>
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
    import { showListNames } from '~/lib/util';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('showlist');

    import Table from '~/components/Table';
    import Switcher from '~/components/Switcher';

    export default {
        name: "List",
        data () {
            let cb = this.changeEndpoint.bind(this);
            return {
                trxTabs: {
                    all: { name: "All", endpoint: "transaction", callback: cb },
                    everipay: { name: "Pay", endpoint: "everipay", callback: cb },
                    everipass: { name: "Pass", endpoint: "everipass", callback: cb },
                },
            }
        },
        created() { this.resetData(this.$route.path); return this.refreshData(); },
        components: { Table, Switcher },
        computed: mapState(['tableHeader', 'name', 'endpoint', 'data', 'page', 'activeTab', 'dataLink']),
        methods: {
            click(i) { this.$router.push(this.dataLink[i]); },
            ...mapMutations(['resetData']),
            ...mapActions(['refreshData', 'more', 'changeEndpoint']),
        },
        beforeRouteEnter (to, from, next) {
            if (from.name && showListNames.includes(to.name)) {
                next(vm => {
                    vm.resetData(to.name);
                    vm.refreshData();
                });
            } else {
                next();
            }
        },
        beforeRouteLeave(to, from, next) {
            if (showListNames.includes(to.name)) {
                next();
                this.resetData(to.name);
                this.refreshData();
            } else {
                next();
            }
        }
    }
</script>

<style lang='scss' scoped>

    @import "@/assets/components/tablePage.scss";
    
</style>