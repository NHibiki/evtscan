<template>
    <section class="main-section">
        <Grid :style="{'border-radius': '16px'}">
            <div id="trxCount" class="container">
                <b :style="{'margin-right': '12px', 'background': '#e5a637'}" class='pill'>{{ $t('index.dailytransaction') }} <b :style="{'color': '#d80000'}">{{trx && trx.value || "0"}}</b></b>
            </div>
            <div id="tpsPanel" class="container" :style="{'margin-top': '-12px'}">
                <b :style="{'margin-right': '12px', 'background': '#e5a637'}" class='pill'>{{ $t('index.peaktps') }} <b :style="{'color': '#d80000'}">{{tps && tps.top && tps.top.value || "---"}}</b></b>
                <nuxt-link :style="{'float': 'right'}" :to="$i18n.path(`/block/${tps && tps.top && tps.top.id || ''}`)" class="pill-btn"><b class='hidden'>{{ $t('navigator.block') }}</b>#{{tps && tps.top && tps.top.num || "None"}}</nuxt-link>
            </div>
            <div id="timeSync" class="container" :style="{'margin-top': '-12px'}">
                <b :style="{'margin-right': '12px', 'background': timeSync ? '#e5a637' : null}" class='pill'>{{ $t('index.autosync') }}</b>
                <!--<b class='hidden'>Now:&nbsp;</b>
                <span class="show-time">{{new Date($store.state.app.time).toLocaleTimeString()}}</span>
                <u :style="{'margin-left': '8px'}">{{new Date($store.state.app.time).toDateString()}}</u>-->
                <toggle-button :style="{'float': 'right', 'font-size': '9px'}" v-model="timeSync" :width="70" color="#e5a637" :labels="{checked: $t('index.syncon'), unchecked: $t('index.syncoff')}" />
            </div>
        </Grid>
        <Grid :style="{'border-radius': '16px', 'margin-top': '-12px'}">
            <div class="container">
                <input v-model="search" @input="searchAddress" @keyup.enter="goAddress" :placeholder="$t('index.search')" />
                <a :style="{'top': '15px', 'right': '20px', 'position': 'absolute'}" @click="goAddress" class="pill-btn">{{$t('index.searchsumbit')}}</a>
                <div :class='{"search-result": true, "show": searchData && searchData.length}' :style="{'height': searchHeight + 'px'}">
                    <a class="small-btn" @click="searchClick(i)" :key="d" v-for="(d, i) in searchData">{{d}}</a>
                </div>
            </div>
        </Grid>
        <div class='dualList' :style="{'min-height': minHeight + 'px'}">
            <GridList :title="$t('navigator.blocks')" :sync="timeSync" endpoint="block" :for="BlockView" />
            <GridList :title="$t('navigator.transactions')" :sync="timeSync" :endpoint="trxEndpoint" :activeTab="activeTab" :tabs="trxTabs" :for="TrxView" />
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

    import { searchAddress as searchAddressAPI } from '~/lib/api';
    import { debounce } from 'lodash';

    export default {
        name: 'Index',
        data () {
            let cb = this.changeEndpoint.bind(this);
            let timeSync = false;
            return {
                search: "",
                searchData: [],
                trxTabs: {
                    all: { name: this.$t('evt.filter.all'), endpoint: "transaction", callback: cb },
                    everipay: { name: this.$t('evt.filter.everipay'), endpoint: "everipay", callback: cb },
                    everipass: { name: this.$t('evt.filter.everipass'), endpoint: "everipass", callback: cb },
                },
                TrxView, BlockView, timeSync
            }
        },
        computed: {
            ...mapState(['minHeight', 'trxEndpoint', 'activeTab', 'chain']),
            tps() { return this.chain && this.chain.tps || null; },
            trx() { return this.chain && this.chain.trx || null; },
            searchHeight() { return Math.min(this.searchData.length * 28, 140 + 14); }
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
            // let updateInterval = 1000;
            // this.updatingTimer = setInterval(() => {
            //     if (this.timeSync) this.$store.commit('app/syncData');
            // }, updateInterval);
        },
        // beforeDestroy() {
        //     if (this.updatingTimer) clearInterval(this.updatingTimer);
        //     this.updatingTimer = null;
        // },
        methods: {
            ...mapMutations(['changeEndpoint', 'changeMinHeight']),
            searchAddress: debounce(async function () {
                let data = (await searchAddressAPI(this.search)).data;
                if (data.data && data.data.length) this.searchData = data.data;
                else this.searchData = [];
            }, 200),
            goAddress() { this.$router.push(this.$i18n.path(`/address/` + this.search)); },
            searchClick(i) { this.search = this.searchData[i] || ""; this.searchData = []; }
        }
    }
</script>

<style lang='scss' scoped>

    .container {
        
        input +a {
            box-shadow: none;
        }

        input:focus +a {
            color: #666;
        }

        .search-result {

            &.show{
                height: 124px;
                margin-top: 8px;
            }

            height: 0px;
            overflow-y: auto;
            transition: .3s linear;

            a.small-btn {
                display: block;
                overflow-x: hidden;
                text-overflow: ellipsis;
                margin: 0 auto;
                margin-top: 4px;
            }

        }

    }

    #tpsPanel.container {

        b.hidden {display: inline;}

        @media only screen and (max-width: 445px) {
            b.hidden {display: none;}
        }
    }

    /*
    #timeSync.container {

        b.hidden {display: none;}

        @media only screen and (max-width: 540px) {
            u {display: none;}
        }

        @media only screen and (max-width: 445px) {
            b.pill {display: none;}
            b.hidden {display: inline;}
        }
    }*/

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
