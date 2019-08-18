<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ $t('navigator.fungible') }} <img v-if="metaData && metaData['symbol-icon']" class="fungibleIcon" :src="metaData['symbol-icon'].value"/> <nuxt-link :to="$i18n.path('/fungible/' + id)" style="margin-left: 4px;">#{{ id }}</nuxt-link></h2>
            <a class="sidebtn" href="javascript:history.back()">{{ $t('system.info.back') }}</a>
            <Table :data="data"/>
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.detailedinfo') }}</h2>
            <Table :data="detailedData" :head="detailedHeaders" :clickable="true" @click="openDetailedModal" />
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.metadata') }}</h2>
            <Table :data="Object.keys(metaData || {}).map(k => [k, metaData[k].creator])" :head="metaDataHeaders" :clickable="true" @click="openMetaModal" />
        </div>

        <div v-if="showActions" class='grid'>
            <h2>{{ $t('evt.actions') }}</h2>
            <Table :data="actions" :head="actionHeaders" :clickable="true" @click="openActionModal" />
            <div class="pager">
                <a class="btn" href="javascript:;" @click="moreActions(-1)"><fa icon="angle-left"/></a>
                <span> {{ $t('page.before') }} {{ page + 1 }} {{ $t('page.after') }} </span>
                <a class="btn" href="javascript:;" @click="moreActions(1)"><fa icon="angle-right"/></a>
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
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('fungible');

    import Table from '~/components/Table';
    import Dialog from '~/components/Dialog';

    export default {
        name: 'Fungible',
        data () {
            return {
                detailedHeaders: [this.$t('evt.datatable.name'), this.$t('evt.datatable.threshold'), this.$t('evt.datatable.count')],
                metaDataHeaders: [this.$t('evt.datatable.key'), this.$t('evt.datatable.creator')],
                actionHeaders: [this.$t('evt.datatable.name'), this.$t('evt.datatable.domain'), this.$t('evt.datatable.key')],
            }
        },
        computed: mapState(['id', 'data', 'detailedData', 'detailedActions', 'metaData', 'showData', 'showModal', 'actions', 'page', 'showActions']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, res, env}) { store.commit('fungible/allowActions', env.showFungibleActions); store.commit('fungible/resetData', route.params.id); let promise = store.dispatch('fungible/updateData'); if (res) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openDetailedModal', 'openMetaModal', 'openActionModal']),
            ...mapActions(['updateData', 'moreActions']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";
    @import "@/assets/components/tablePager.scss";

</style>