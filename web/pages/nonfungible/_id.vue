<template>
    <div :class="$store.state.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2 style="margin-right: 120px;">Non-Fungible <router-link :to="'/nonfungible/' + id" style="margin-left: 4px;">#{{ id }}</router-link></h2>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :data="data"/>
        </div>

        <div class='grid'>
            <h2>Detailed Info</h2>
            <Table :data="detailedData" :head="detailedHeaders" :clickable="true" @click="openDetailedModal" />
        </div>

        <div class='grid'>
            <h2>Distributions</h2>
            <Table :data="(distributeData || []).map(k => [k.name, k.owner && k.owner[0] ? k.owner[0] : 'None', k.created_at])" :head="distributeDataHeaders" :clickable="true" @click="openDistributeModal" />
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
                detailedHeaders: ['Name', 'Threshold', 'Count'],
                distributeDataHeaders: ['Name', 'To', 'Timestamp'],
            }
        },
        computed: mapState(['id', 'data', 'detailedData', 'detailedActions', 'distributeData', 'showData', 'showModal']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, isServer}) { store.commit('nonfungible/resetData', route.params.id); let promise = store.dispatch('nonfungible/updateData'); if (isServer) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openDetailedModal', 'openDistributeModal']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";

</style>