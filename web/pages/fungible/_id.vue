<template>
    <div>
        <div class='grid'>
            <h2 style="margin-right: 120px;">Fungible <img v-if="metaData && metaData['symbol-icon']" class="fungibleIcon" :src="metaData['symbol-icon'].value"/> <router-link :to="'/fungible/' + id" style="margin-left: 4px;">#{{ id }}</router-link></h2>
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
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('fungible');

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
        asyncData({store, route, isServer}) { store.commit('fungible/resetData', route.params.id); let promise = store.dispatch('fungible/updateData'); if (isServer) return promise; },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openDetailedModal', 'openMetaModal']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss' scoped>

    .grid {
        background: #FFF;
        width: calc(100% - 40px);
        margin: 32px auto;
        max-width: 1080px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, .05);
        position: relative;

        .sidebtn {
            font-family: "Quicksand";
            font-weight: 500;
            margin: 2px 0;
            padding: 6px 20px;
            display: block;
            position: absolute;
            right: 20px;
            top: 22px;
            color: #e6a938;
            /* border: 1px solid #e6a938; */
            box-shadow: 0 5px 15px rgba(0, 0, 0, .1);
            border-radius: 40px;

            &:hover {
                background: #e6a938;
                color: white;
                box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            }

        }

        * {
            font-weight: 300;
        }

        a {
            transition: .1s linear;
            text-decoration: none;
            outline: none;
            color: #999;

            &:hover {
                color: #e6a938;
            }

        }

        h1, h2, h3, h4, h5, p, span {
            font-weight: 300;
            font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }

        h2 {
            font-weight: 400;
            margin: 24px 18px;
            padding-left: 6px;
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: 'Quicksand';

            .fungibleIcon {
                display: inline-block;
                position: relative;
                height: 30px;
                width: auto;
                vertical-align: bottom;
            }

        }

    }

</style>