<template>
    <div class='dualList' :style="{'min-height': minHeight + 'px'}">
        <GridList title="Blocks" endpoint="block" :for="BlockView" />
        <GridList title="Transactions" :endpoint="trxEndpoint" :activeTab="activeTab" :tabs="trxTabs" :for="TrxView" />
    </div>
</template>

<script>
    import GridList from '@/components/subcomponents/GridList';
    import TrxView from '@/components/subcomponents/TrxView';
    import BlockView from '@/components/subcomponents/BlockView';

    export default {
        name: 'Index',
        data () {
            let cb = this.changeEndpoint.bind(this);
            return {
                minHeight: 0,
                msg: 'Welcome to Your Vue.js App',
                trxEndpoint: 'transaction',
                activeTab: 'all',
                trxTabs: {
                    all: { name: "All", endpoint: "transaction", callback: cb },
                    everipay: { name: "Pay", endpoint: "everipay", callback: cb },
                    everipass: { name: "Pass", endpoint: "everipass", callback: cb },
                },
                TrxView, BlockView
            }
        },
        components: { GridList },
        mounted () {
            if (!window) return;
            window.onresize = function() {
                this.minHeight = window.innerHeight - 385;
            }.bind(this);
            window.onresize();
        },
        methods: {
            changeEndpoint(id, tab) {
                this.activeTab = id;
                this.trxEndpoint = tab.endpoint;
            }
        }
    }
</script>

<style lang='scss' scoped>
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
