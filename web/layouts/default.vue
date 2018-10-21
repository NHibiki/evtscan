<template>
    <div id="evtscan">
        <header class="header" v-if="notInApp">
            <div class="content">
                <router-link to="/" class="logo">evtScan</router-link>
                <ul :class="{menu: true, open}" @click="switchOpen">
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/block">Blocks</router-link></li>
                    <li><router-link to="/trx">Transactions</router-link></li>
                    <li>
                        <a class="submenubtn" href="javascript:;">More<fa style="margin-left:8px;" icon="angle-down"/></a>
                        <div class="submenu"><ul>
                            <li><router-link to="/fungible">Fungibles</router-link></li>
                            <li><router-link to="/domain">Domains</router-link></li>
                            <li><router-link to="/group">Groups</router-link></li>
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
                        evtScan Copyright ©️2018 <br /><br />
                        By <a href="https://github.com/NHibiki">@NHibiki</a> with <a class="heart"><fa icon="heart"/></a>. <br />
                        Distributed By Vue.js <br />
                        All Rights Reserved.
                    </span></li>
                </div>
                <div class="column">
                    <li><b>Friendly Links</b></li>
                    <li><a href="https://everitoken.io">everiToken</a></li>
                    <li><a href="https://everitoken.io/everipay">everiPay</a></li>
                    <li><a href="http://myevt.io">MyEVT Wallet</a></li>
                    <!--<li class="divider"></li>-->
                    <!--<li><a href="https://everitoken.io/docs/whitepaper.pdf">White Papper</a></li>-->
                </div>
                <div class="column">
                    <li><b>Open Source</b></li>
                    <li><a href="https://github.com/NHibiki/evtscan">evtScan</a></li>
                    <!--<li class="divider"></li>-->
                    <li><a href="https://github.com/everitoken">everiToken</a></li>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>

    import { mapState, mapMutations } from 'vuex';

    import '~/node_modules/loaders.css/loaders.min.css';
    import '~/assets/global.scss';

    export default {
        name: 'App',
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
        }
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
                width: 221px;
                height: 41px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                font-size: 0px;
                background-image: url('/static/images/logo@2x.png');
                cursor: pointer;
            }

            .menuSwitch {
                cursor: pointer;
                font-size: 22px;
                color: #e5a637;
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

                .submenubtn {
                    display: none;
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
            background-image: url('/static/images/footer.jpg');
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
            color: #333;
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
                color: #26E;
                transition: .3s linear;

                &:hover {
                    color: darken($themeColor, 20);
                }

            }

        }

    }

</style>
