<template>
    <div class='grid'>
        <div class='grid-wrapper'>
            <h2>{{ title }}</h2>
            <div class="switch"><Switcher v-if="hasTab" :tabs="tabs" :active="activeTab" /></div>
            <div class="trans"></div>
            <div class='grid-inner'>
                <LineScalePulseOutRapidLoader v-if="!items[endpoint]" color="#e6a938" size="40px" class="loader"/> 
                <component :key="item._id" :item="item" :endpoint="endpoint" :is="SubView" v-if="items[endpoint]" v-for="item in items[endpoint] || []"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapActions } = createNamespacedHelpers('GridList');
    
    import { LineScalePulseOutRapidLoader } from 'vue-loaders';
    import Switcher from '@/components/subcomponents/Switcher';

    export default {
        name: 'GridList',
        props: ['title', 'endpoint', 'for', 'tabs', 'activeTab'],
        data () {
            return {
                hasTab: this.tabs && Object.keys(this.tabs).length,
                SubView: this.for
            }
        },
        computed: mapState(['items']),
        created() { return this.getDataList(this.endpoint); },
        watch: {
            'endpoint' () { this.getDataList(this.endpoint); }
        },
        methods: mapActions(['getDataList']),
        components: { LineScalePulseOutRapidLoader, Switcher }
    }
</script>

<style lang='scss' scoped>
    
    /* $GridHeight: 580px; */
    $GridHeight: 100%;
    
    .grid {
        background: #FFF;
        width: calc(100% - 40px);
        margin: 20px;
        max-width: 490px;
        /* min-height: 400px; */
        height: min-content;
        max-height: calc(80px + #{$GridHeight});
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, .05);
        position: relative;

        .trans {
            position: absolute;
            pointer-events: none;
            height: 38px;
            width: 100%;
            left: 0;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
            z-index: 1;
        }

        .loader {
            margin: 120px auto;
            display: block;
            position: relative;
            text-align: center;
        }

        .switch {
            position: absolute;
            right: 32px; top: 24px;
            z-index: 2;
        }

        .grid-wrapper {
            /* overflow-x: hidden; */
            overflow: hidden;
            height: 100%;
        }

        .grid-inner {
            overflow-x: hidden;
            overflow-y: auto;
            height: 100%;
            max-height: $GridHeight;
            margin: 0 auto;
            max-width: 430px;
            position: relative;
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
            margin-bottom: 12px;
            padding-left: 6px;
            font-family: "Quicksand";
        }


    }
</style>
