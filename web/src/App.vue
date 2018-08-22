<template>
    <div id="evtscan">
        <header class="header">
            <div class="content">
                <a class="logo" style="cursor:default;" href="javascript:;">everi Token</a>
                <ul class="menu">
                    <li><router-link to="/">Home</router-link></li>
                    <li><router-link to="/block">Block</router-link></li>
                    <li><router-link to="/transaction">Transaction</router-link></li>
                </ul>
            </div>
        </header>
        <router-view/>
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
        padding-bottom: 80px;
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

</style>
