<template>
    <div>
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ name }} </h2>
            <div class="switch"><Switcher v-if="name === 'Transactions'" :tabs="trxTabs" :active="activeTab" /></div>
            <a class="sidebtn" href="javascript:history.back()">Back</a>
            <Table :head="tableHeader" :data="data" :clickable="true" @click="click"/>
            <div class="pager">
                <a class="btn" href="javascript:;" @click="more(-1)"><fa icon="angle-left"/></a>
                <span> Page {{ page + 1 }} </span>
                <a class="btn" href="javascript:;" @click="more(1)"><fa icon="angle-right"/></a>
            </div>
        </div>
    </div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers('ShowList');
    const showListNames = ['Transactions', 'Blocks', 'Fungibles', 'Domains'];

    import Table from '@/components/subcomponents/Table';
    import Switcher from '@/components/subcomponents/Switcher';

    export default {
        name: "List",
        data () {
            let cb = this.changeEndpoint.bind(this);
            return {
                trxTabs: {
                    all: { name: "All", endpoint: "transaction", callback: cb },
                    everipay: { name: "Pay", endpoint: "everipay", callback: cb },
                    everipass: { name: "Pass", endpoint: "everipass", callback: cb },
                },
            }
        },
        created() { this.resetData(this.$route.name); return this.refreshData(); },
        components: { Table, Switcher },
        computed: mapState(['tableHeader', 'name', 'endpoint', 'data', 'page', 'activeTab', 'dataLink']),
        methods: {
            click(i) { this.$router.push(this.dataLink[i]); },
            ...mapMutations(['resetData']),
            ...mapActions(['refreshData', 'more', 'changeEndpoint']),
        },
        beforeRouteEnter (to, from, next) {
            if (from.name && showListNames.includes(to.name)) {
                next(vm => {
                    vm.resetData(to.name);
                    vm.refreshData();
                });
            } else {
                next();
            }
        },
        beforeRouteLeave(to, from, next) {
            if (showListNames.includes(to.name)) {
                next();
                this.resetData(to.name);
                this.refreshData();
            } else {
                next();
            }
        }
    }
</script>

<style lang='scss' scoped>

    .grid {
        background: #FFF;
        width: calc(100% - 40px);
        margin: 32px auto;
        max-width: 1080px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, .05);
        position: relative;

        .pager {

            margin: 24px;
            text-align: right;

            span {
                margin: 0 20px;
            }

        }

        .switch {
            position: absolute;
            right: 122px; top: 26px;
        }

        .sidebtn {
            font-family: "Quicksand";
            font-weight: 500;
            margin: 2px 0;
            padding: 6px 20px;
            display: block;
            position: absolute;
            right: 20px;
            top: 22px;
            color: #e6a938;
            /* border: 1px solid #e6a938; */
            box-shadow: 0 5px 15px rgba(0, 0, 0, .1);
            border-radius: 40px;

            &:hover {
                background: #e6a938;
                color: #FFF;
                box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            }

        }

        * {
            font-weight: 300;
        }

        a {
            transition: .2s linear;
            text-decoration: none;
            outline: none;
            color: #999;

            &:hover {
                color: #e6a938;
            }

            &.btn {
                padding: 8px 20px;
                display: inline-block;
                color: #FFF;
                background: #e6a938;
                border-radius: 6px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, .05);

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 25px rgba(0, 0, 0, .2);
                }
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
            padding-left: 6px;
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: 'Quicksand';
        }

    }

</style>