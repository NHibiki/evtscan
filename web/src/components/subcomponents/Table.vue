<template>
    <table class="table">
        <thead>
            <TableRow :items="head" v-if="head"/>
        </thead>
        <tbody>
            <TableRow :clickable="clickable" :items="col" :key="i" v-for="(col, i) in data" v-if="data && data.length" @click="click(i)"/>
            <tr v-if="!data || !data.length && head && head.length"><th class="mid" :colspan="head.length">No Data</th></tr>
        </tbody>
    </table>
</template>

<script>
    import TableRow from '@/components/subcomponents/TableRow';
    export default {
        name: 'Table',
        props: ['head', 'data', 'clickable'],
        data () {
            return {
                that: this
            }
        },
        components: { TableRow },
        methods: {
            click: function(i) {
                this.clickable ? this.$emit('click', i) : null;
            }
        }
    }
</script>

<style lang='scss'>

    .table {

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
            overflow-x: scroll;
            word-break: break-all;
            text-overflow: ellipsis;
            white-space: nowrap;

            &.mid {
                text-align: center;
            }

            span {
                display: inline-block;
                white-space: normal;
                min-width: 100px;

            }
        }

        thead {
            th {
                font-weight: 600;
            }
        }

    }

</style>