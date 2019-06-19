<template>
    <div class='siteinfo-wrapper' v-if="show && siteInfo">
        <span>
            <b style="margin-right: 8px; margin-left: 2px;">INFO</b> {{ siteInfo }}
        </span>
        <a @click="onclick">X</a>
    </div>
</template>

<script>
    import { getSiteInfo } from '~/lib/api';

    export default {
        name: 'SiteInfo',
        // props: [''],
        data () {
            return {
                show: false,
                siteInfo: '',
            }
        },
        async mounted() {
            const info = ((await getSiteInfo()) || {}).data;
            if (info && info.prompt && info.prompt.default) {
                const {locale = 'default'} = this.$i18n;
                const msg = info.prompt[locale] || info.prompt['default'] || "";
                if (msg) {
                    this.show = true;
                    this.siteInfo = msg;
                }
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
        top: 116px;
        transform: translateX(-50%);
        left: 50%;
        height: 30px;
        padding: 0 20px;

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
            margin-left: 16px;
            text-decoration: none;
            cursor: pointer;
        }

    }

</style>
