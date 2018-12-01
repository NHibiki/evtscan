<template>
    <tr @click="$emit('click')" :class="{ clickable }">
        <th :key="items.indexOf(item) + Math.random()" v-for="item in items">
            <span class="tableClass" :style="{color: (item && item.color ? item.color : null)}">
                {{ item && item.hide ? null : isNone((item && item.content) ? item.content : item) }}
                <template v-if="item && item.type && item.data">
                    <img v-if="item.type === 'imageSrc'" :src="item.data" />
                    <router-link v-if="item.type === 'innerLink'" :to="item.data">#{{ item.content }}</router-link>
                </template>
            </span>
        </th>
    </tr>
</template>

<script>
    export default {
        name: 'TableRow',
        props: ['items', 'clickable'],
        data () { return {} },
        methods: { isNone(str) {return str === false || str === 0 ? str : (str || "None")} }
    }
</script>

<style lang='scss'>

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