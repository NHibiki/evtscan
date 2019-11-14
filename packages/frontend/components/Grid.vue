<template>
    <div class='grid-view'>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'Grid',
    }
</script>

<style lang='scss'>

    @import '~/assets/define.scss';

    .grid-view {
        background: #FFF;
        width: calc(100% - 120px);
        margin: 36px auto 18px auto;
        max-width: 1000px;
        padding: 0 20px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 5px 25px rgba(0, 0, 0, .05);
        position: relative;
        @include withQuick(400);

        @media only screen and (max-width: 960px) {
            
            max-width: 450px;
            width: calc(100% - 120px);

        }

        @media only screen and (max-width: 440px) {
            
            width: calc(100% - 80px);

        }

        .container {
            font-weight: 400;
            padding: 12px 0;
            line-height: 20px;

            input {
                width: calc(100% - 20px);
                font-size: 14px;
                line-height: 16px;
                border: none;
                outline: none;
                border: 2px solid #EAEAEA;
                background: #FFFFFF;
                padding: 4px 10px;
                height: 16px;
                border-radius: 24px;
                color: #AAA;
                font-weight: 500;
                transition: .3s ease;

                &:focus {
                    background: #EEE;
                    border-color: #EEE;
                    color: #333;
                }

                &::placeholder {
                    color: #CCC;
                }

            }

        }

        .pager {

            margin: 24px;
            text-align: right;

            span {
                font-family: 'Quicksand';
                font-weight: 400;
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
            color: #2652FF;
            /* border: 1px solid #e6a938; */
            box-shadow: 0 5px 15px rgba(0, 0, 0, .1);
            border-radius: 40px;

            &:hover {
                background: #2954FF;
                color: #FFF;
                box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            }

        }

        *:not(b) {
            font-weight: 300;
        }

        a {
            transition: .2s linear;
            text-decoration: none;
            outline: none;
            cursor: pointer;
            color: #999;

            &:hover {
                color: #2954FF;
            }

            &.btn {
                padding: 8px 20px;
                display: inline-block;
                color: #FFF;
                background: #2652FF;
                border-radius: 36px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, .25);

                &:hover {
                    transform: translateY(1px);
                    box-shadow: 0 5px 5px rgba(0, 0, 0, .3);
                }
            }

            &.small-btn {
                font-size: 14px;
                line-height: 16px;
                background: #F3F3F3;
                padding: 4px 10px;
                height: 16px;
                border-radius: 24px;
                color: #888;
                font-weight: 500;
                transition: .3s ease;
                text-align: center;
                display: inline-block;

                &:hover {
                    background: #AAA;
                    color: #FFF;
                    box-shadow: 0 1px 5px rgba(0, 0, 0, .2);
                }
            }

        }

        b {
            color: #666;
        }

        u {
            text-decoration: none;
            font-weight: 400;
            color: #888;
            font-size: 13px;
        }

        .pill {
            padding: 3px 10px;
            color: #FFF;
            background: #666;
            border-radius: 24px;
            cursor: default;
            font-size: 14px;
            line-height: 16px;
            transition: .3s linear;
            display: inline-block;
            text-align: center;
        }

        .pill-btn {
            font-weight: 700;
            padding: 3px 10px;
            color: #2652FF;
            background: #FFF;
            border-radius: 24px;
            cursor: default;
            font-size: 14px;
            line-height: 16px;
            cursor: pointer;
            transition: .3s linear;
            text-align: center;
            display: inline-block;
            box-shadow: 0 4px 6px rgba(0, 0, 0, .2);

            &:hover {
                box-shadow: 0 2px 3px rgba(0, 0, 0, .2);
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
            margin-bottom: 12px;
            overflow-x: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: 'Quicksand';
        }

    }
</style>
