<template>
    <div id="evtscan">
        <header class="header">
            <div class="content">
                <a class="logo" style="cursor:default;" href="javascript:;">everi Token</a>
                <ul class="menu">
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/block">Block</router-link></li>
                    <li><router-link to="/trx">Transaction</router-link></li>
                </ul>
            </div>
        </header>
        <router-view/>
        <footer class="footer">
            <div class="footer-wrapper">
                <div class="column">
                    <li><span>
                        EvtScan Copyright ©️2018 <br /><br />
                        By EveriToken Development Team. <br />
                        Distributed By Vue.js <br />
                        All Rights Reserved.
                    </span></li>
                </div>
                <div class="column">
                    <li><b>Friendly Link</b></li>
                    <li><a href="https://everitoken.io">EveriToken</a></li>
                    <li><a href="#">EveriPay</a></li>
                    <!--<li class="divider"></li>-->
                    <li><a href="#">White Papper</a></li>
                </div>
                <div class="column">
                    <li><b>Open Source</b></li>
                    <li><a href="https://github.com/everitoken">Github</a></li>
                    <!--<li class="divider"></li>-->
                    <li><a href="https://github.com/everitoken/evtscan">EvtScan</a></li>
                    <li><a href="https://github.com/everitoken/evt">EvtNet</a></li>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>

    export default {
        name: 'App'
    }

</script>

<style lang="scss" scoped>

    #evtscan {
        background: #EAEAEA;
    }

    .header {

        background: #FFF;
        display: block;
        margin: 0 0;
        margin-bottom: 20px;
        position: relative;
        height: 73px;
        font-weight: 300;
        font-family: "Roboto", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", "Helvetica Neue", sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;

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

            .logo {
                display: block;
                width: 221px;
                height: 41px;
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;
                font-size: 0px;
                background-image: url('/static/images/logo@2x.png');
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
                    color: #1e1e1e;
                    letter-spacing: 0.5px;
                    line-height: 73px;
                    -webkit-transition: 0.3s;
                    transition: 0.3s;
                    text-decoration: none;
                    color: #1e1e1e;
                    outline: none;

                    &:hover {
                        color: #e5a637;
                        outline: none;
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
            opacity: 0.03;
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
            font-family: 'Quicksand';
            font-weight: 300;
            line-height: 24px;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            color: #333;

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
                color: #59E;
                transition: .3s linear;

                &:hover {
                    color: #a76a00;
                }

            }

        }

    }

</style>
