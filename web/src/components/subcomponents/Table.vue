<template>
    <table class="table">
        <thead>
            <TableRow :items="head" v-if="head"/>
        </thead>
        <tbody>
            <TableRow :items="col" :key="col[0]" v-for="col in data" v-if="data && data.length"/>
            <tr v-if="!data || !data.length && head && head.length"><th class="mid" :colspan="head.length">No Data</th></tr>
        </tbody>
    </table>
</template>

<script>
    import TableRow from '@/components/subcomponents/TableRow';
    export default {
        name: 'Table',
        props: ['head', 'data'],
        data () {
            return {}
        },
        components: { TableRow }
    }
</script>

<style lang='scss'>

    .table {

        width: calc(100% - 10px);
        margin: 24px 0;
        padding: 0 5px;
        overflow-x: hidden;

        th {
            font-weight: 300;
            padding: 10px 20px;
            text-align: left;
            font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            overflow-x: scroll;
            word-break: break-all;
            text-overflow: ellipsis;
            white-space: nowrap;

            &.mid {
                text-align: center;
            }
        }

        thead {
            th {
                font-weight: 600;
            }
        }

    }

</style>