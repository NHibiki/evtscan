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
            <Table :data="distributeData ? distributeData.map(k => [k.name, k.owner && k.owner[0] ? k.owner[0] : 'None', k.created_at]) : null" :head="distributeDataHeaders" :clickable="true" @click="openDistributeModal" />
            <div class="pager">
                <a class="btn" href="javascript:;" @click="more(-1)"><fa icon="angle-left"/></a>
                <span> Page {{ page + 1 }} </span>
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
                detailedHeaders: ['Name', 'Threshold', 'Count'],
                distributeDataHeaders: ['Name', 'To', 'Timestamp'],
            }
        },
        computed: mapState(['id', 'data', 'detailedData', 'detailedActions', 'distributeData', 'showData', 'showModal', 'page']),
        components: { Table, Dialog },
        // created() { this.resetData(this.$route.params.id); return this.updateData(); },
        asyncData({store, route, isServer}) { store.commit('nonfungible/resetData', route.params.id); let promise = store.dispatch('nonfungible/updateData'); if (isServer) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openDetailedModal', 'openDistributeModal']),
            ...mapActions(['updateData', 'more']),
        }
    }
</script>

<style lang='scss'>

    @import "@/assets/components/detailPage.scss";

    .grid {
        .pager {
            margin: 24px;
            text-align: right;
            span {
                font-family: 'Quicksand';
                font-weight: 400;
                margin: 0 20px;
            }
        }
        a.btn {
            padding: 8px 20px;
            display: inline-block;
            color: #FFF;
            background: #e6a938;
            border-radius: 36px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, .25);
            &:hover {
                color: white;
                transform: translateY(1px);
                box-shadow: 0 5px 5px rgba(0, 0, 0, .3);
            }
        }
    }

    .grid-light .grid {
        .pager {
            margin: 12px 0;
            text-align: center;
            font-size: 13px;
        }
        a.btn {
            padding: 5px 25px;
            line-height: 12px;
            display: inline-block;
            color: blue;
            background: transparent;
            border: 1px solid blue;
            border-radius: 2px;
            box-shadow: none;
            &:hover {
                color: blue;
                transform: none;
                box-shadow: none;
            }
        }
        .loader > div {
            background: blue !important;
        }
    }

</style>