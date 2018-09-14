<template>
    <div>
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
        created() { this.resetData(this.$route.params.id); return this.updateData(); },
        methods: {
            ...mapMutations(['resetData', 'closeModal', 'openModal']),
            ...mapActions(['updateData']),
        }
    }
</script>

<style lang='scss' scoped>

    .grid {
        background: #FFF;
        width: calc(100% - 40px);
        margin: 32px auto;
        max-width: 920px;
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
        }

    }

</style>