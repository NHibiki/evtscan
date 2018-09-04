<template>
    <div class='dualList'>
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
            return {
                msg: 'Welcome to Your Vue.js App',
                trxEndpoint: 'transaction',
                activeTab: 'all',
                trxTabs: {
                    all: {
                        name: "All",
                        callback: this.changeEndpoint.bind(this, 'transaction', 'all'),
                    },
                    everipay: {
                        name: "Pay",
                        callback: this.changeEndpoint.bind(this, 'everipay', 'everipay'),
                    },
                    everipass: {
                        name: "Pass",
                        callback: this.changeEndpoint.bind(this, 'everipass', 'everipass'),
                    },
                },
                TrxView, BlockView
            }
        },
        components: { GridList },
        methods: {
            changeEndpoint(endpoint, id) {
                this.activeTab = id;
                this.trxEndpoint = endpoint;
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
