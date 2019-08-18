<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ $t('navigator.address') }} <nuxt-link :to="$i18n.path('/address/' + id)" style="margin-left: 4px;">#{{ id }}</nuxt-link></h2>
            <a class="sidebtn" href="javascript:history.back()">{{ $t('system.info.back') }}</a>
            <Table :data="data"/>
        </div>
        <div class='grid'>
            <h2>{{ $t('evt.assets') }}</h2>
            <Table :head="assetsHead" :data="assets" :clickable="true" @click="clickAssets"/>
        </div>
        <div class='grid'>
            <h2>{{ $t('evt.history') }}</h2>
            <div class="switch-container"><Switcher :tabs="filterTabs" :active="activeTab" /></div>
            <Table :head="historyHead" :data="historyData" :clickable="true" @click="click"/>
            <div class="pager">
                <a class="btn" href="javascript:;" @click="more(-1)"><fa icon="angle-left"/></a>
                <span> {{ $t('page.before') }} {{ page + 1 }} {{ $t('page.after') }} </span>
                <a class="btn" href="javascript:;" @click="more(1)"><fa icon="angle-right"/></a>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('address');

    import Table from '~/components/Table';
    import Switcher from '~/components/Switcher';

    export default {
        name: 'Address',
        data () {
            let cb = this.changeFilter.bind(this);
            return {
                filterTabs: {
                    all: { name: this.$t('evt.filter.all'), filter: "", callback: cb },
                    send: { name: this.$t('evt.filter.send'), filter: "send", callback: cb },
                    receive: { name: this.$t('evt.filter.receive'), filter: "receive", callback: cb },
                    issue: { name: this.$t('evt.filter.issue'), filter: "issue", callback: cb },
                },
                historyHead: [this.$t('evt.datatable.type'), this.$t('evt.datatable.domain'), this.$t('evt.datatable.key'), this.$t('evt.datatable.transactionid'), this.$t('evt.datatable.timestamp')],
                assetsHead: [this.$t('evt.datatable.name'), this.$t('evt.datatable.symbolid'), this.$t('evt.datatable.amount')],
            }
        },
        computed: mapState(['id', 'data', 'assets', 'historyData', 'historyDataDetail', 'page', 'activeTab']),
        components: { Table, Switcher },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, res}) { store.commit('address/resetData', route.params.id); let promise = store.dispatch('address/updateData'); if (res) return promise; },
        methods: {
            click(i) { this.$router.push(this.$i18n.path("/trx/" + this.historyDataDetail[i].trx_id)) },
            clickAssets(i) { this.$router.push("/fungible/" + this.assets[i][1]) },
            ...mapMutations(['resetData']),
            ...mapActions(['updateData', 'more', 'changeFilter']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";
    @import "@/assets/components/tablePager.scss";

    .switch-container {
        display: block;
        position: absolute;
        right: 20px;
        top: 25px;
    }

    .grid-light {
        .switch-container {
            top: 8px;
        }
    }

</style>