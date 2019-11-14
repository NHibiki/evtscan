<template>
    <div id="evtscan">
        <SiteInfo />
        <header class="header" v-if="notInApp">
            <div class="content">
                <nuxt-link :to="$i18n.path('/')" class="logo">evtScan</nuxt-link>
                <ul :class="{menu: true, open}" @click="switchOpen">
                    <li><nuxt-link :to="$i18n.path('/')">{{ $t('navigator.home') }}</nuxt-link></li>
                    <li><nuxt-link :to="$i18n.path('/block')">{{ $t('navigator.blocks') }}</nuxt-link></li>
                    <li><nuxt-link :to="$i18n.path('/trx')">{{ $t('navigator.transactions') }}</nuxt-link></li>
                    <li>
                        <a class="submenubtn" href="javascript:;">{{ $t('navigator.more') }}<fa style="margin-left:8px;" icon="angle-down"/></a>
                        <div class="submenu"><ul>
                            <li><nuxt-link :to="$i18n.path('/nonfungible')">{{ $t('navigator.nonfungibles') }}</nuxt-link></li>
                            <li><nuxt-link :to="$i18n.path('/fungible')">{{ $t('navigator.fungibles') }}</nuxt-link></li>
                            <li><nuxt-link :to="$i18n.path('/domain')">{{ $t('navigator.domains') }}</nuxt-link></li>
                            <li><nuxt-link :to="$i18n.path('/group')">{{ $t('navigator.groups') }}</nuxt-link></li>
                            <li><nuxt-link :to="$i18n.path('/validator')">{{ $t('navigator.validator') }}</nuxt-link></li>
                        </ul></div>
                    </li>
                    <li>
                        <a class="submenubtn fixed" href="javascript:;" v-on:click.stop>{{ $t('navigator.language') }}<fa style="margin-left:8px;" icon="angle-down"/></a>
                        <div class="submenu fixed"><ul>
                            <li><nuxt-link :to="$i18n.switch('en')">English</nuxt-link></li>
                            <li><nuxt-link :to="$i18n.switch('zh')">简体中文</nuxt-link></li>
                        </ul></div>
                    </li>
                </ul>
                <a @click="switchOpen" class="menuSwitch">
                    <fa v-if="!open" icon="bars"/>
                    <fa v-if="open" icon="times"/>
                </a>
            </div>
        </header>
        <nuxt />
        <footer class="footer" v-if="notInApp">
            <div class="footer-wrapper">
                <div class="column">
                    <li><span>
                        {{ $t('system.info.copyright') }} <br /><br />
                        <a href="https://www.vastchain.cn">{{ $t('system.info.producedby') }}</a> {{ $t('system.info.producedwith') }} <a class="heart"><fa icon="heart"/></a>. <br />
                        {{ $t('system.info.distributedbyvue') }} <br />
                        {{ $t('system.info.rightsclaim') }}
                    </span></li>
                </div>
                <div class="column">
                    <li><b>{{ $t('navigator.link') }}</b></li>
                    <li><a href="https://www.vastchain.cn">{{ $t('navigator.vastchain') }}</a></li>
                    <li><a href="https://www.vastchain.cn/docs">{{ $t('navigator.vastchaindoc') }}</a></li>
                    <li><a href="https://www.vastchain.cn/pages/20191019-tos">{{ $t('navigator.vastchaintos') }}</a></li>
                    <!--<li class="divider"></li>-->
                    <!--<li><a href="https://everitoken.io/docs/whitepaper.pdf">{{ $t('navigator.whitepaper') }}</a></li>-->
                </div>
                <div class="column">
                    <li><b>{{ $t('navigator.opensource') }}</b></li>
                    <li><a href="https://github.com/vastchain/">{{ $t('navigator.vastchaingithub') }}</a></li>
                    <!-- <li><a href="https://github.com/NHibiki/evtscan">{{ $t('navigator.evtscan') }}</a></li>
                    <li><a href="https://github.com/everitoken">{{ $t('navigator.everitoken') }}</a></li> -->
                </div>
            </div>
        </footer>
    </div>
</template>

<script>

    import { mapState, mapMutations } from 'vuex';
    import SiteInfo from '~/components/SiteInfo';

    import '~/node_modules/loaders.css/loaders.min.css';
    import '~/assets/global.scss';

    export default {
        name: 'App',
        head() { return { title: this.$t('sitename') } },
        computed: {...mapState('app', ['open']), ...mapState(['theme']),
            notInApp() {
                return !['light'].includes(this.theme);
            }
        },
        methods: { ...mapMutations('app', ['switchOpen']), ...mapMutations(['setTheme']) },
        mounted () {
            try {
                let theme = this.$router.history.current.query.theme;
                if (theme) this.setTheme(theme);
            } catch(err) {}
        },
        components: {SiteInfo}
    }

</script>

<style lang="scss" scoped>

    @import "@/assets/define.scss";

    #evtscan {
        @extend %withBackground;
    }

    .header {

        background: #FFF;
        display: block;
        position: relative;
        height: 73px;
        margin: 0 0;
        margin-bottom: 20px;
        
        @include withRoboto(300);
        @include outlineShadow(0);

        .content {
            
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            width: calc(100% - 40px);
            padding: 0 20px;
            margin: 0 auto;
            height: 73px;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;

            @media screen and (max-width: 768px) {
                padding: 0;
                margin: 0;
            }

            .logo {
                display: block;
                width: 180px;
                height: 28px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                font-size: 0px;
                background-image: url('https://vc-cdn.yuliankeji.cn/static/img/news-logo.png');
                cursor: pointer;
            }

            .menuSwitch {
                cursor: pointer;
                font-size: 22px;
                color: #2652FF;
                transition: .3s linear;

                &:hover {
                    /* transform: scale(1.1); */
                    /* box-shadow: 0 5px 10px rgba(0, 0, 0, .1); */
                }

                @media screen and (min-width: 768px) {
                    display: none;
                }
            }

            .menu {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                list-style: none;

                li {
                    list-style-type: none;
                }

                li a {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    padding: 0px 20px;
                    font-size: 16px;
                    font-weight: 300;
                    letter-spacing: 0.5px;
                    line-height: 73px;
                    -webkit-transition: 0.3s;
                    transition: 0.3s;
                    text-decoration: none;
                    color: #000;
                    outline: none;

                    &:hover {
                        color: $themeColor;
                    }

                }

                .submenu ul {
                    padding: 0;
                }

                @media screen and (min-width: 768px) {


                    .submenubtn {
                        display: block;
                    }
                
                    .submenubtn:hover +.submenu {

                        opacity: 1;
                        pointer-events: all;

                    }

                    .submenu {

                        display: block;
                        position: absolute;
                        right: 0px;
                        top: 73px;
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                        opacity: 0;
                        pointer-events: none;
                        transition: .3s linear;

                        background: transparent;
                        z-index: 5;

                        &:hover {
                            opacity: 1;
                            pointer-events: all;
                        }

                        ul {
                            background: #FFF;
                            margin: 10px;
                            border-radius: 8px;
                            overflow: hidden;
                            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                        }

                        li {
                            
                            a {
                                line-height: 40px;
                                border-radius: 60px;
                                margin: 8px 20px;
                                padding: 0px 30px;

                                &:hover {
                                    background: #FAFAFA;
                                }
                            }

                        }

                    }
                }

                @media screen and (max-width: 768px) {

                    .submenubtn {
                        display: block;
                        &:not(.fixed) {
                            display: none;
                        }
                        &:hover +.submenu, &:focus +.submenu, &:active +.submenu {
                            opacity: 1;
                            pointer-events: all;
                            max-height: 1000px;
                        }
                    }

                    .submenu.fixed {
                        opacity: 0;
                        pointer-events: none;
                        max-height: 0;
                        &:hover, &:focus, &:active {
                            opacity: 1;
                            pointer-events: all;
                            max-height: 1000px;
                        }
                    }

                    & {
                        display: block;
                        position: absolute;
                        top: 54px;
                        left: 0;
                        height: 0px;
                        padding: 0;
                        overflow: hidden;
                        background: #FFF;
                        width: 100%;
                        z-index: 3;
                        text-align: center;
                        transition: .3s linear;

                        &.open {
                            height: unset;
                            padding: 24px 0;
                        }

                        li a {

                            width: 65%;
                            min-width: 140px;
                            margin: 4px auto;
                            line-height: 40px;
                            border-radius: 40px;

                            &:hover {
                                background: #FAFAFA;
                                outline: none;
                            }

                        }

                    }

                }

            }


        }

    }

    .footer {

        position: relative;
        z-index: 0;

        :before{
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: #002dde;
            // background-image: url('/static/images/footer.jpg');
            /* opacity: 0.03; */
            z-index: -1;
        }

        .footer-wrapper {
            width: calc(100% - 160px);
            padding: 40px 80px;
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            margin-top: 40px;
            height: 100%;

            .heart {
                font-family: unset;
                color: #F66;
            }

            @media only screen and (max-width: 720px) {
            
                flex-direction: column;
                .column {
                    text-align: left;
                }

            }

            @media only screen and (max-width: 450px) {
            
                width: calc(100% - 20px);
                padding: 40px 10px;
                .column {
                    padding: 8px 20px;
                }

            }

        }

        .column {

            &.left, &:first-child {
                text-align: left;
            }

            text-align: right;
            flex: 1;
            padding: 20px;
            line-height: 24px;
            color: #fff;
            @include withQuick(300);

            li {
                display: block;
                margin: 4px 0;
                
                &.divider {
                    width: 30%;
                    max-width: 200px;
                    height: 1px;
                    background-color: #AAA;
                    display: inline-block;
                }

                b {
                    line-height: 42px;
                }

            }

            b {
                font-weight: 400;
            }

            a {
                text-decoration: none;
                font-weight: 400;
                color: #00ffae;
                transition: .3s linear;

                &:hover {
                    color: lighten($themeColor, 20);
                }

            }

        }

    }

</style>
