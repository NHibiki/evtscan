<template>
    <div class='switcher'>
        <div class='switcher-wrapper'>
            <span :class="{active: activeTab === i, switch: true}" @click="onclick(i, tab)" :key="tab.id || i"  v-for="(tab, i) in tabs || {}">
                {{ tab.name }}
            </span>
        </div>
    </div>
</template>

<script>
    import { getRecent } from '~/lib/api';
    import { LineScalePulseOutRapidLoader } from 'vue-loaders';

    export default {
        name: 'GridList',
        props: ['tabs', 'active'],
        data () {
            let keys = Object.keys(this.tabs);
            return {
                activeTab: this.active || (keys.length && keys[0]) || null
            }
        },
        created() {},
        methods: {
            onclick(id, tab) {
                tab.callback && tab.callback({id, tab});
            }
        },
        watch: {
            'active' () {
                this.activeTab = this.active || this.activeTab;
            }
        },
        components: {}
    }
</script>

<style lang='scss' scoped>
    
    .switcher {

        display: relative;

        font-weight: 600;
        font-family: "Quicksand";
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;

        .switcher-wrapper {
            margin: 2px 0;
            padding: 0px 0px;
            background: #FFF;
            border-radius: 40px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, .1);

            span.switch {
                font-size: 14px;
                padding: 4px 10px;
                border-radius: 40px;
                font-weight: 600;
                width: 32px;
                text-align: center;
                display: inline-block;
                cursor: pointer;
                transition: .3s ease;

                &.active {
                    background: #e6a938;
                    color: #EEE;
                    transform: scale(1.05);
                    box-shadow: 2px 5px 10px rgba(0, 0, 0, .1);
                }

                &:hover {
                    background: #EEE;
                
                    &.active {
                        box-shadow: 2px 5px 5px rgba(0, 0, 0, .15);
                        background: #f6b948;
                        /* transform: scale(1.02); */
                    }
                
                }

            }

        }
        
    }

</style>
