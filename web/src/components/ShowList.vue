<template>
    <div>
        <div class='grid'>
            <h2 style="margin-right: 120px;">{{ name }} </h2>
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
    import Table from '@/components/subcomponents/Table';
    import { getRecent } from '@/lib/api';
    import Util from '@/lib/util';

    export default {
        name: "List",
        data () {
            return this.resetData()
        },
        created() {
            this.refreshData()
        },
        components: { Table },
        methods: {
            click(i) {
                this.$router.push(this.dataLink[i]);
            },
            resetData() {
                let tableHeader = ['Transaction ID', 'Block Num', 'Pending', 'Timestamp'];
                if (this.$route.name !== 'Transactions') {
                    tableHeader = ['Block Num', 'Block ID', 'Producer', 'Timestamp'];
                }
                return {
                    tableHeader,
                    name: this.$route.name,
                    endpoint: "/" + this.$route.name.substr(0, this.$route.name.length - 1).toLocaleLowerCase(),
                    data: null,
                    page: 0,
                    dataLink: []
                }
            },
            refreshData() {
                getRecent(this.endpoint, this.page, 20)
                    .then(data => {
                        [this.data, this.dataLink] = Util[`tablize${this.name}`](data.data.data);
                    })
                    .catch(err => { console.error(err); })
            }, 
            more(adder) {
                if (!adder) return;
                if (this.data.length < 20 && adder > 0) return;
                if (this.page + adder < 0) return;  
                this.page += adder;
                this.data = null;
                this.dataLink = null;
                this.refreshData();
            }
        },
        beforeRouteEnter (to, from, next) {
            if (from.name && to.name === 'Transactions' || to.name === 'Blocks') {
                next(vm => {
                    let newData = vm.resetData();
                    for (let k in newData) {
                        vm[k] = newData[k];
                    }
                    vm.refreshData();
                });
            } else {
                next();
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'Transactions' || to.name === 'Blocks') {
                next();
                let newData = this.resetData();
                for (let k in newData) {
                    this[k] = newData[k];
                }
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

        .sidebtn {
            font-family: "Roboto";
            padding: 6px 20px;
            display: block;
            position: absolute;
            right: 20px;
            top: 22px;
            color: #e6a938;
            border: 1px solid #e6a938;
            border-radius: 8px;

            &:hover {
                background: #e6a938;
                color: white;
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