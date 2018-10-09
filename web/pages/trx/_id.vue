<template>
    <div :class="$store.state.app.theme === 'light' ? 'grid-light' : 'grid-normal'">
        <div class='grid'>
            <h2 style="margin-right: 120px;">Transaction <router-link :to="'/trx/' + id" style="margin-left: 4px;">#{{ id }}</router-link></h2>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :data="data"/>
        </div>

        <div class='grid'>
            <h2>Actions in this Transaction</h2>
            <Table :data="actions" :head="actionHeaders" :clickable="true" @click="openModal" />
        </div>

        <div class='grid'>
            <h2>Public Keys signed this Transaction</h2>
            <Table :data="keys" :head="keyHeaders"/>
        </div>

        <div class='grid'>
            <h2>Signatures in this Transaction</h2>
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
        name: 'Block',
        data () {
            return {
                keyHeaders: ['Public Key'],
                sigHeaders: ['Signature'],
                actionHeaders: ['Name', 'Domain', 'Key'],
            }
        },
        computed: mapState(['id', 'data', 'keys', 'sigs', 'actions', 'trxData', 'actionsData', 'showData', 'showModal']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, isServer}) { store.commit('trx/resetData', route.params.id); let promise = store.dispatch('trx/updateData'); if (isServer) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openModal']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";

</style>