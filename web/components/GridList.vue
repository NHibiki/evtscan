<template>
    <div class='grid' :style="{'max-height': $store.state.indexs.minHeight < 580 ? '' : $store.state.indexs.minHeight + 80 + 'px'}">
        <div class='grid-wrapper'>
            <h2>{{ title }}</h2>
            <div class="switch"><Switcher v-if="hasTab" :tabs="tabs" :active="activeTab" /><a class="btn" @click="onRefresh"><fa icon="redo-alt"/></a></div>
            <div class="trans"></div>
            <div class='grid-inner' @scroll.self="onScroll" :style="{'max-height': $store.state.indexs.minHeight < 580 ? '' : $store.state.indexs.minHeight + 'px'}">
                <LineScalePulseOutRapidLoader v-if="!items[endpoint]" color="#e6a938" size="40px" class="loader"/>
                <div class="noData" v-if="items[endpoint] && !items[endpoint][0]">No Data!</div>
                <component :key="item._id" :item="item" :endpoint="endpoint" :is="SubView" v-if="items[endpoint]" v-for="item in items[endpoint] || []"/>
                <BallPulseLoader v-if="items[endpoint] && loading[endpoint]" color="#e6a938" size="12px" class="loader2"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapActions } = createNamespacedHelpers('gridlist');
    
    import { LineScalePulseOutRapidLoader, BallPulseLoader } from 'vue-loaders';
    import Switcher from '~/components/Switcher';

    export default {
        name: 'GridList',
        props: ['title', 'endpoint', 'for', 'tabs', 'activeTab'],
        data () {
            return {
                hasTab: this.tabs && Object.keys(this.tabs).length,
                SubView: this.for
            }
        },
        computed: mapState(['items', 'loading', 'nomoreLoading']),
        created() { return this.onRefresh(); },
        watch: {
            'endpoint' () { this.getDataList({endpoint:this.endpoint}); }
        },
        methods: {
            ...mapActions(['getDataList']),
            onScroll(event) {
                try { window } catch(err) {return;}
                let trdM = this.$store.state.indexs.minHeight < 580 ? 580 : this.$store.state.indexs.minHeight;
                let threshold = Math.max(15, (this.items[this.endpoint] || []).length) * 120 - trdM; // - 560 - 20;
                let {target} = event;
                if (target.scrollTop > threshold && !this.loading[this.endpoint] && !this.nomoreLoading[this.endpoint]) {
                    this.getDataList({endpoint:this.endpoint, more:true});
                }
            },
            async onRefresh() {
                await this.getDataList({endpoint:this.endpoint});
                this.$store.commit('app/updateCurrentTime');
            }
        },
        components: { LineScalePulseOutRapidLoader, BallPulseLoader, Switcher }
    }
</script>

<style lang='scss' scoped>
    
    /* $GridHeight: 580px; */
    $GridHeight: 580px;
    
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

        .loader, .loader2 {
            margin: 120px auto;
            display: block;
            position: relative;
            text-align: center;
            user-select: none;
            &.loader2 {margin: 60px auto;}
        }

        .btn {
            font-size: 12px;
            line-height: 24px;
            text-align: center;
            color: #333;
            height: 24px;
            width: 24px;
            vertical-align: bottom;
            padding: 3px;
            margin-left: 18px;
            border-radius: 30px;
            background: #EAEAEA;
            cursor: pointer;
            transition: .3s linear;

            &:hover {
                background-color: #e6a938;
                color: #FFF;
            }
        }

        .switch {
            position: absolute;
            right: 24px; top: 24px;
            z-index: 2;

            & > * {
                display: inline-block;
            }
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

            .noData {
                text-align: center;
                font-weight: 400;
                color: #999;
                font-size: 28px;
                font-family: "Quicksand", sans-serif;
                margin: 115px 0 138px 0;
                cursor: default;
                user-select: none;
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
            margin-bottom: 12px;
            padding-left: 6px;
            font-family: "Quicksand";
        }


    }
</style>
