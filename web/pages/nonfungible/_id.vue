<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ $t('navigator.nonfungible') }} <nuxt-link :to="$i18n.path('/nonfungible/' + id)" style="margin-left: 4px;">#{{ id }}</nuxt-link></h2>
            <a class="sidebtn" href="javascript:history.back()">{{ $t('system.info.back') }}</a>
            <Table :data="data"/>
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.detailedinfo') }}</h2>
            <Table :data="detailedData" :head="detailedHeaders" :clickable="true" @click="openDetailedModal" />
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.distributions') }}</h2>
            <Table :data="distributeData ? distributeData.map(k => [k.name, k.owner && k.owner[0] ? k.owner[0] : 'None', k.timestamp]) : null" :head="distributeDataHeaders" :clickable="true" @click="goDistribution" />
            <div class="pager">
                <a class="btn" href="javascript:;" @click="more(-1)"><fa icon="angle-left"/></a>
                <span> {{ $t('page.before') }} {{ page + 1 }} {{ $t('page.after') }} </span>
                <a class="btn" href="javascript:;" @click="more(1)"><fa icon="angle-right"/></a>
            </div>
        </div>

        <Dialog v-if="showModal" @close="closeModal">
            <div slot="body">
                <vue-json-pretty
                    :path="'res'"
                    :data="showData">
                </vue-json-pretty>
            </div>
        </Dialog>

    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('nonfungible');

    import Table from '~/components/Table';
    import Dialog from '~/components/Dialog';

    export default {
        name: 'NonFungible',
        data () {
            return {
                detailedHeaders: [this.$t('evt.datatable.name'), this.$t('evt.datatable.threshold'), this.$t('evt.datatable.count')],
                distributeDataHeaders: [this.$t('evt.datatable.name'), this.$t('evt.datatable.to'), this.$t('evt.datatable.timestamp')],
            }
        },
        computed: mapState(['id', 'data', 'detailedData', 'detailedActions', 'distributeData', 'showData', 'showModal', 'page']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, isServer}) { store.commit('nonfungible/resetData', route.params.id); let promise = store.dispatch('nonfungible/updateData'); if (isServer) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openDetailedModal']),
            ...mapActions(['updateData', 'more']),
            goDistribution(i) {
                const d = (this.distributeData || [])[i] || {};
                if (d.id) {
                    this.$router.push(this.$i18n.path(`/nonfungible/token/${d.id}`));
                }
            }
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";
    @import "@/assets/components/tablePager.scss";

</style>