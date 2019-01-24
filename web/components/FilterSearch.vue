<template>
    <div class='filter-search'>
        <input v-model="data" :placeholder="placeholder || 'Filter Search'" />
        <button :class="{'empty':!data}" class="search-btn close" @click="submitClear"><fa icon="times"/></button>
        <button class="search-btn" @click="submit"><fa icon="search"/></button>
    </div>
</template>

<script>
    export default {
        name: 'FilterSearch',
        props: ['placeholder', 'default'],
        data () {
            return {
                data: this.default || "",
            }
        },
        methods: {
            submit() {
                this.$emit('submit', {filter:this.data, page:0});
            },
            submitClear() {
                this.data = "";
                this.submit();
            }
        }
    }
</script>

<style lang='scss' scoped>
    
    .filter-search {

        display: none;
        position: relative;

        @media only screen and (min-width: 540px) {
            display: flex;
        }

        font-weight: 600;
        font-size: 16px;
        font-family: "Quicksand";
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;

        color: #e6a938;
        background: #FFF;
        box-shadow: 0 3px 6px rgba(0, 0, 0, .1);
        height: 32px;
        border-radius: 32px;
        margin-top: -2px;

        input {
            height: 32px;
            border: none;
            background: none;
            padding-left: 10px;
            width: 100px;
            font-family: "Quicksand";
            font-weight: bolder;
            font-size: 11px;
            line-height: 32px;
            outline: none;
        }

        .search-btn {
            text-decoration: none;
            display: inline-block;
            border: none;
            color: #e6a938;
            background: none;
            font-size: 16px;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 100%;
            transition: .3s ease;

            &.close {
                color: #d80000;
                &:hover {
                    background: #ffd4d4;
                }
            }

            &:hover {
                background: #ffe4b3;
            }

            &.empty {
                opacity: 0;
                user-selection: none;
                pointer-events: none;
            }
        }
        
    }

</style>
