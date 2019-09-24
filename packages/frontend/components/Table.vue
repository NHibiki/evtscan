<template>
    <table class="table">
        <thead>
            <TableRow :items="head" v-if="head"/>
        </thead>
        <tbody>
            <template v-if="data && data.length">
                <TableRow :clickable="clickable" :items="col" :key="i" v-for="(col, i) in data" @click="click(i)"/>
            </template>
            <tr v-if="!data"><th class="mid" :colspan="head && head.length || 1"><vue-loaders-line-scale-pulse-out-rapid color="#e6a938" size="40px" class="loader"/></th></tr>
            <tr v-if="data && !data.length && head && head.length"><th class="mid" :colspan="head.length">No Data</th></tr>
        </tbody>
    </table>
</template>

<script>
    import TableRow from '~/components/TableRow';

    export default {
        name: 'Table',
        props: ['head', 'data', 'clickable'],
        data () { return {} },
        components: { TableRow },
        methods: {
            click: function(i) {
                this.clickable ? this.$emit('click', i) : null;
            }
        }
    }
</script>

<style lang='scss'>

    table.table {

        width: 100%;
        margin: 24px 0;
        padding: 0 15px;
        overflow-x: hidden;

        th {
            font-weight: 300;
            padding: 10px 10px;
            text-align: left;
            font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            overflow-x: auto;
            word-break: break-all;
            text-overflow: ellipsis;
            white-space: nowrap;

            &.mid {
                text-align: center;
            }

            span {
                display: inline-block;
                white-space: normal;
                min-width: 90px;

            }
        }

        thead {
            th {
                font-weight: 600 !important;
            }
        }

        .loader {
            margin: 120px auto;
            display: block;
            position: relative;
            text-align: center;
        }

    }

</style>