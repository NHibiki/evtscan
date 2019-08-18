<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ $t('navigator.transaction') }} <nuxt-link :to="$i18n.path('/trx/' + id)" style="margin-left: 4px;">#{{ id }}</nuxt-link></h2>
            <a class="sidebtn" href="javascript:history.back()">{{ $t('system.info.back') }}</a>
            <Table :data="data"/>
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.actions') }}</h2>
            <Table :data="actions" :head="actionHeaders" :clickable="true" @click="openModal" />
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.publickeys') }}</h2>
            <Table :data="keys" :head="keyHeaders"/>
        </div>

        <div class='grid'>
            <h2>{{ $t('evt.signatures') }}</h2>
            <Table :data="sigs" :head="sigHeaders"/>
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
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('trx');

    import Table from '~/components/Table';
    import Dialog from '~/components/Dialog';

    export default {
        name: 'Trx',
        data () {
            return {
                actionHeaders: [this.$t('evt.datatable.sequencenum'), this.$t('evt.datatable.name'), this.$t('evt.datatable.domain'), this.$t('evt.datatable.key')],
                keyHeaders: [this.$t('evt.datatable.publickey')],
                sigHeaders: [this.$t('evt.datatable.signature')],
            }
        },
        computed: mapState(['id', 'data', 'keys', 'sigs', 'actions', 'trxData', 'actionsData', 'showData', 'showModal']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, res}) { store.commit('trx/resetData', route.params.id); let promise = store.dispatch('trx/updateData'); if (res) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openModal']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";

</style>