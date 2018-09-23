<template>
    <div>
        <div class='grid'>
            <h2 style="margin-right: 120px;">Domain <router-link :to="'/domain/' + id" style="margin-left: 4px;">#{{ id }}</router-link></h2>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :data="data"/>
        </div>

        <div class='grid'>
            <h2>Detailed Info</h2>
            <Table :data="detailedData" :head="detailedHeaders" :clickable="true" @click="openDetailedModal" />
        </div>

        <div class='grid'>
            <h2>MetaData</h2>
            <Table :data="Object.keys(metaData || {}).map(k => [k, metaData[k].creator])" :head="metaDataHeaders" :clickable="true" @click="openMetaModal" />
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
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('domain');

    import Table from '~/components/Table';
    import Dialog from '~/components/Dialog';

    export default {
        name: 'Fungible',
        data () {
            return {
                detailedHeaders: ['Name', 'Threshold', 'Count'],
                metaDataHeaders: ['Key', 'Creator'],
            }
        },
        computed: mapState(['id', 'data', 'detailedData', 'detailedActions', 'metaData', 'showData', 'showModal']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, isServer}) { store.commit('domain/resetData', route.params.id); let promise = store.dispatch('domain/updateData'); if (isServer) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openDetailedModal', 'openMetaModal']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss' scoped>

    @import "@/assets/components/detailPage.scss";

</style>