<template>
    <section class="main-section">
        <Grid id="timeSync" :style="{'border-radius': '16px'}">
            <div class="container">
                <b :style="{'margin-right': '12px', 'background': timeSync ? '#e5a637' : null}" class='pill'>LAST SYNC TIME</b>
                <b class='hidden'>Now:&nbsp;</b>
                <span class="show-time">{{new Date($store.state.app.time).toLocaleTimeString()}}</span>
                <u :style="{'margin-left': '8px'}">{{new Date($store.state.app.time).toDateString()}}</u>
                <toggle-button :style="{'float': 'right', 'font-size': '9px'}" v-model="timeSync" :width="70" color="#e5a637" :labels="{checked:'Sync On', unchecked:'Sync Off'}" />
            </div>
        </Grid>
        <Grid id="tpsPanel" :style="{'border-radius': '16px', 'margin-top': '-16px'}">
            <div class="container">
                <b :style="{'margin-right': '12px', 'background': '#e5a637'}" class='pill'>PEAK TPS <b :style="{'color': '#d80000'}">{{tps && tps.top && tps.top.value || "---"}}</b></b>
                <router-link :style="{'float': 'right'}" :to="`/block/${tps && tps.top && tps.top.id || 'None'}`" class="pill-btn"><b class='hidden'>Block</b>#{{tps && tps.top && tps.top.id || "None"}}</router-link>
            </div>
        </Grid>
        <div class='dualList' :style="{'min-height': minHeight + 'px'}">
            <GridList title="Blocks" endpoint="block" :for="BlockView" />
            <GridList title="Transactions" :endpoint="trxEndpoint" :activeTab="activeTab" :tabs="trxTabs" :for="TrxView" />
        </div>
    </section>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations } = createNamespacedHelpers('indexs');

    import Grid from '~/components/Grid';
    import GridList from '~/components/GridList';
    import TrxView from '~/components/TrxView';
    import BlockView from '~/components/BlockView';

    export default {
        name: 'Index',
        data () {
            let cb = this.changeEndpoint.bind(this);
            let timeSync = true;
            return {
                trxTabs: {
                    all: { name: "All", endpoint: "transaction", callback: cb },
                    everipay: { name: "Pay", endpoint: "everipay", callback: cb },
                    everipass: { name: "Pass", endpoint: "everipass", callback: cb },
                },
                TrxView, BlockView, timeSync
            }
        },
        computed: {
            ...mapState(['minHeight', 'trxEndpoint', 'activeTab', 'chain']),
            tps() { return this.chain && this.chain.tps || null; }
        },
        components: { GridList, Grid },
        mounted () {
            this.$store.dispatch("indexs/updateChainInfo")
            try {
                if (!window) return;
            } catch(error) { return; }
            window.onresize = function() {
                this.changeMinHeight(window.innerHeight - 385);
            }.bind(this);
            window.onresize();

            // Update Sync Timer
            let updateInterval = 1000;
            this.updatingTimer = setInterval(() => {
                if (this.timeSync) this.$store.commit('app/updateCurrentTime');
            }, updateInterval);
        },
        beforeDestroy() {
            if (this.updatingTimer) clearInterval(this.updatingTimer);
            this.updatingTimer = null;
        },
        methods: mapMutations(['changeEndpoint', 'changeMinHeight'])
    }
</script>

<style lang='scss' scoped>

    #timeSync .container {

        b.hidden {display: none;}

        @media only screen and (max-width: 540px) {
            u {display: none;}
        }

        @media only screen and (max-width: 445px) {
            b.pill {display: none;}
            b.hidden {display: inline;}
        }
    }

    #tpsPanel .container {

        b.hidden {display: inline;}

        @media only screen and (max-width: 445px) {
            b.hidden {display: none;}
        }
    }

    .dualList {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        max-width: 1100px;
        position: relative;
        padding: 0 20px;
        margin: 0 auto;

        @media only screen and (max-width: 960px) {
            
            flex-direction: column;
            & > div {
                margin: 20px auto;
            }

        }

        @media only screen and (max-width: 440px) {
            
            padding: 0;

        }

    }
    .dualList > div {
        flex: 1;
    }
</style>
