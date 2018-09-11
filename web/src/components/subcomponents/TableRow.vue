<template>
    <tr @click="$emit('click')" :class="{ clickable }"><th :key="items.indexOf(item)" v-for="item in items"><span>{{ item }}</span></th></tr>
</template>

<script>
    export default {
        name: 'TableRow',
        props: ['items', 'clickable'],
        data () { return {} }
    }
</script>

<style lang='scss' scoped>

    .clickable {

        cursor: pointer;
        border-radius: 10px;
        transition: .3s linear;

        &:hover {

            box-shadow: 0 5px 30px rgba(0, 0, 0, .1);

        }

    }

</style>