<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ $t('navigator.token') }} <nuxt-link :to="$i18n.path('/nonfungible/token/' + id)" style="margin-left: 4px;">#{{ id }}</nuxt-link></h2>
            <a class="sidebtn" href="javascript:history.back()">{{ $t('system.info.back') }}</a>
            <Table :data="data"/>
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.metadata') }}</h2>
            <Table :data="metas" :head="metaHeaders" :clickable="true" @click="openModal" />
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
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('nonfungibletoken');

    import Table from '~/components/Table';
    import Dialog from '~/components/Dialog';

    export default {
        name: 'NonfungibleToken',
        data () {
            return {
                metaHeaders: [this.$t('evt.datatable.id'), this.$t('evt.datatable.key'), this.$t('evt.datatable.creator'), this.$t('evt.datatable.createdAt')],
            }
        },
        computed: mapState(['id', 'data', 'metas', 'showData', 'showModal']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, res}) { store.commit('nonfungibletoken/resetData', route.params.id); let promise = store.dispatch('nonfungibletoken/updateData'); if (res) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openModal']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";

</style>