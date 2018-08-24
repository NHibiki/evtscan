<template>
    <div class='grid'>
        <div class='grid-wrapper'>
            <h2>{{ title }}</h2>
            <div class="trans"></div>
            <div class='grid-inner'>
                <LineScalePulseOutRapidLoader v-if="!items" color="#e6a938" size="40px" class="loader"/> 
                <component :key="item._id" :item="item" :is="SubView" v-if="items" v-for="item in items || []"/>
            </div>
        </div>
    </div>
</template>

<script>
    import { getRecent } from '@/lib/api';
    import { LineScalePulseOutRapidLoader } from 'vue-loaders';

    export default {
        name: 'GridList',
        props: ['title', 'endpoint', 'for'],
        data () {
            return {
                items: null,
                SubView: this.for
            }
        },
        created() {
            getRecent(this.endpoint)
                .then(data => {
                    let rev = data.data.data;
                    this.items = (this.items || []).concat(rev)
                    // let i = 0;
                    // let inv = setInterval(() => {
                    //     if (i >= rev.length) clearInterval(inv);
                    //     else {
                    //         this.items.unshift(rev.pop())
                    //     }
                    // }, 100);
                })
                .catch(err => { console.error(err); })
        },
        components: { LineScalePulseOutRapidLoader }
    }
</script>

<style lang='scss' scoped>
    .grid {
        background: #FFF;
        width: calc(100% - 40px);
        margin: 20px;
        max-width: 490px;
        /* min-height: 400px; */
        height: min-content;
        max-height: 640px;
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

        .grid-wrapper {
            overflow-x: hidden;
        }

        .grid-inner {
            overflow-x: hidden;
            overflow-y: scroll;
            height: 100%;
            max-height: 560px;
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
