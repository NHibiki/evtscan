<template>
    <client-only placeholder="Loading Charts...">
        <e-chart :options="myOptions" autoresize />
    </client-only>
</template>

<script>
    import { makeLineConfig } from '~/lib/util';

    export default {
        name: 'LineChart',
        props: ['options', 'type', 'keyKey', 'valueKey'],
        data () { return {
            myOptions: makeLineConfig(this.type, this.options, d => [d[this.keyKey], d[this.valueKey]])
        } },
        watch: {
            options(v) {
                this.myOptions = makeLineConfig(this.type, this.options, d => [d[this.keyKey], d[this.valueKey]]);
            }
        }
    }
</script>

<style lang='scss'>
    #evtscan .echarts {
        position: relative;
        width: calc(100% - 88px);
        margin: 0 auto;
        height: 150px;
        background: #eee;
        // background: #00163e;
        box-shadow: 0 5px 13px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        padding: 20px;
    }
    .client-only-placeholder {
        font-weight: 400;
        margin: 24px 18px;
        padding-left: 6px;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: 'Quicksand';
    }
</style>