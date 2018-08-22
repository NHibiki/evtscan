<template>
    <div class='dualList'>
        <GridList title="Blocks" endpoint="block" :for="BlockView" />
        <GridList title="Transactions" endpoint="transaction" :for="TrxView" />
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
                TrxView, BlockView
            }
        },
        components: { GridList }
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
