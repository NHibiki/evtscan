<template>
    <tr><th :key="items.indexOf(item)" v-for="item in items"><span>{{ item }}</span></th></tr>
</template>

<script>
    export default {
        name: 'TableRow',
        props: ['items'],
        data () {
            return {}
        }
    }
</script>

<style lang='scss' scoped>

</style>