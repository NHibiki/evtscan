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
    import { showListIds } from '~/lib/util';
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
        created() { return this.softRefresh(this.$route.name.replace('lang-', '')); },
        components: { Table, Switcher },
        computed: mapState(['tableHeader', 'name', 'endpoint', 'data', 'page', 'activeTab', 'dataLink']),
        methods: {
            click(i) { this.$router.push(this.$i18n.path(this.dataLink[i])); },
            //...mapMutations(['resetData']),
            ...mapActions(['softRefresh', 'more', 'changeEndpoint']),
        },
        beforeRouteEnter (to, from, next) {
            const name = (to.name || '').replace('lang-', '');
            if (from.name && showListIds.includes(name)) {
                next(vm => {
                    vm.softRefresh(name);
                });
            } else {
                next();
            }
        },
        beforeRouteLeave(to, from, next) {
            const name = (to.name || '').replace('lang-', '');
            if (showListIds.includes(name)) {
                next();
                this.softRefresh(name);
            } else {
                next();
            }
        }
    }
</script>

<style lang='scss' scoped>

    @import "@/assets/components/tablePage.scss";
    
</style>