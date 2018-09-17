<template>
    <tr @click="$emit('click')" :class="{ clickable }">
        <th :key="items.indexOf(item) + Math.random()" v-for="item in items">
            <span class="tableClass">
                {{ ((item && item.content) ? item.content : item) || "None" }}
                <template v-if="item && item.type && item.data">
                    <img v-if="item.type === 'imageSrc'" :src="item.data" />
                </template>
            </span>
        </th>
    </tr>
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
        border-radius: 30px;
        transition: .3s linear;

        &:hover {

            box-shadow: 0 5px 30px rgba(0, 0, 0, .1);

        }

    }

    .tableClass {

        img {
            display: inline-block;
            position: relative;
            height: 19px;
            width: auto;
            vertical-align: bottom;
        }

    }

</style>