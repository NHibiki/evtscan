<template>
    <div class='siteinfo-wrapper' v-if="show && siteInfo">
        <span>
            <b style="margin-right: 8px; margin-left: 2px;">SITEINFO</b> {{ siteInfo }}
        </span>
        <a @click="onclick">x</a>
    </div>
</template>

<script>
    import { getSiteInfo } from '~/lib/api';

    export default {
        name: 'SiteInfo',
        // props: [''],
        data () {
            return {
                show: true,
                siteInfo: '',
            }
        },
        created() {},
        methods: {
            onclick() {
                this.show = false;
            }
        }
    }
</script>

<style lang='scss' scoped>

    div.siteinfo-wrapper {

        font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
        z-index: 99999;
        display: block;
        background: #e5a637;
        border-radius: 5px;
        text-align: center;
        line-height: 30px;
        box-shadow: 0 5px 20px rgba(229, 166, 55, 0.5);

        position: absolute;
        font-size: 13px;
        top: 76px;
        left: calc(50% - 150px);
        width: 300px;
        height: 30px;

        span {
            font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
            font-weight: 400;
            margin: 5px;
            color: #FFF;
        }

        a {
            font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
            display: inline-block;
            font-weight: 900;
            color: #FFF;
            transform: scale(1.5);
            margin: 1px 4px 0 16px;
            text-decoration: none;
        }
        
    }

</style>
