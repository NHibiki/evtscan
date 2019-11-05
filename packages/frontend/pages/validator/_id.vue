<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2>{{ $t('navigator.validator') }} <nuxt-link :to="$i18n.path('/validator/' + id)" style="margin-left: 4px;">#{{ id }}</nuxt-link></h2>
            <a class="sidebtn" href="javascript:history.back()">{{ $t('system.info.back') }}</a>
            <LineChart v-if="netValues && netValues.length" type="time" keyKey="timestamp" valueKey="net_value" :options="netValues" />
            <Table :data="data"/>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('validator');

    import Table from '~/components/Table';
    import LineChart from '~/components/Line';

    export default {
        name: 'Validator',
        data () {
            return {
                trxHead: [this.$t('evt.datatable.transactionid'), this.$t('evt.datatable.pending'), this.$t('evt.datatable.timestamp')],
            }
        },
        computed: mapState(['id', 'data', 'netValues']),
        components: { LineChart, Table },
        asyncData({store, route, res}) { store.commit('validator/resetData', route.params.id); let promise = store.dispatch('validator/updateData'); if (res) return promise; },
        methods: {
            ...mapMutations(['resetData']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";
    @import "@/assets/components/tablePager.scss";

</style>