<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper" @click="$emit('close')">
                <div class="modal-container">
                    <a class="modal-close" href="javascript:;" @click="$emit('close')"><fa icon="times"/></a>

                    <div class="modal-header">
                        <slot name="header"></slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">Dialog Body</slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>


<script>
    export default {
        name: 'Dialog',
        data () {
            return {}
        }
    }
</script>

<style lang='scss' scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: block;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: block;
        width: 100%;
        height: 100%;
        vertical-align: middle;
        position: relative;
    }

    .modal-container {
        position: relative;
        max-width: 80%;
        max-height: 80%;
        margin: 0px auto;
        top: 8%;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        overflow: hidden;

    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
        margin: 20px 0;
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .modal-close {
        transition: .1s linear;
        text-decoration: none;
        outline: none;
        position: absolute;
        right: 34px;
        color: #e6a938;
        font-size: 20px;

        &:hover {
            color: #F00;
        }
    }

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>