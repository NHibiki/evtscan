<template>
    <section class="main-section">
        <!-- <Grid :style="{'border-radius': '16px'}">
            <div id="trxCount" class="container">
                <b :style="{'margin-right': '12px', 'background': '#2652FF'}" class='pill'>{{ $t('index.dailytransaction') }} <b :style="{'color': '#00ffae'}">{{trx && trx.value || "0"}}</b></b>
            </div>
            <div id="tpsPanel" class="container" :style="{'margin-top': '-12px'}">
                <b :style="{'margin-right': '12px', 'background': '#2652FF'}" class='pill'>{{ $t('index.peaktps') }} <b :style="{'color': '#00ffae'}">{{tps && tps.top && tps.top.value || "---"}}</b></b>
                <nuxt-link :style="{'float': 'right'}" :to="$i18n.path(`/block/${tps && tps.top && tps.top.id || ''}`)" class="pill-btn"><b class='hidden'>{{ $t('navigator.block') }}</b>#{{tps && tps.top && tps.top.num || "None"}}</nuxt-link>
            </div>
            <div id="timeSync" class="container" :style="{'margin-top': '-12px'}">
                <b :style="{'margin-right': '12px', 'background': timeSync ? '#2652FF' : null}" class='pill'>{{ $t('index.autosync') }}</b>
                <toggle-button :style="{'float': 'right', 'font-size': '9px'}" v-model="timeSync" :width="70" color="#2652FF" :labels="{checked: $t('index.syncon'), unchecked: $t('index.syncoff')}" />
            </div>
        </Grid> -->
        <Grid :style="{'border-radius': '16px'}">
            <div class="container">
                <input v-model="search" @input="searchAll" @keyup.enter="go" :placeholder="$t('index.search')" />
                <a :style="{'top': '15px', 'right': '20px', 'position': 'absolute'}" @click="go" class="pill-btn">{{$t('index.searchsumbit')}}</a>
                <div :class='{"search-result": true, "show": loading || (searchData && searchData.length)}' :style="{'height': (loading ? 120 : searchHeight) + 'px'}">
                    <vue-loaders-line-scale-pulse-out-rapid v-if="loading" color="#002cd9" size="40px" class="loader"/>
                    <a class="small-btn result-item-btn" @click="searchClick(i)" :key="i" v-for="(d, i) in searchData">
                      <p><b>{{ $t('index.searchtype') }}:</b>  {{ $t('index.t'+d.type) }}</p>
                      <p><b>{{ $t('index.searchvalue') }}:</b>  {{d.id}}</p>
                    </a>
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

    import { get } from '~/lib/util';
    import { searchOne, searchAll as searchAllAPI, getDonationUrl, VASTCHAIN_API } from '~/lib/api';
    import { debounce } from 'lodash';

    export default {
        name: 'Index',
        data () {
            let cb = this.changeEndpoint.bind(this);
            let timeSync = false;
            return {
                search: "",
                loading: 0,
                acceptData: {},
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
            searchHeight() { return Math.min(this.searchData.length * (52 + 4), 4 * 52); }
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
            searchAll: debounce(async function () {
                this.loading += 1;
                this.searchData = [];
                let data = (await searchAllAPI(this.search)).data;
                this.loading -= 1;
                if (data.data && data.data.length) {
                    this.searchData = data.data;
                }
            }, 400),
            goAddress() {
                if (this.acceptData.type === 'Token') {
                    getDonationUrl(this.search).then(data => {
                        if (data) window.open(VASTCHAIN_API+data, 'donation');
                    });
                } else {
                    this.$router.push(this.$i18n.path(
                        (this.acceptData.type === 'Transaction'
                        ? `/trx/`
                        : this.acceptData.type === 'Block'
                            ? `/block/`
                            : `/address/`)
                        + this.search));
                }
            },
            async go() {
                const data = get(await searchOne(this.search), 'data.data');
                if (data.type && data.id) {
                    this.acceptData = data;
                    this.search = this.acceptData.id;
                    this.goAddress();
                } else {
                    this.$router.push(this.$i18n.path('/404'));
                }
            },
            searchClick(i) {
                this.acceptData = this.searchData[i] || {};
                this.search = this.acceptData.id || '';
                this.searchData = [];
                this.goAddress();
            }
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

            a.result-item-btn {
                height: 32px;
                border-radius: 8px;
                text-align: left;
                padding: 10px 18px;
                p {
                    margin: 0;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: 400;
                }
                &:hover {
                  b {
                    color: white;
                  }
                }
            }

        }

    }

    .loader {
        margin-top: 38px;
        text-align: center;
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
