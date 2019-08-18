<template>
    <div class='timer'> &gt; {{ currentTime }} </div>
</template>

<script>
    import { msToTimeStr } from '~/lib/util';
    import { createNamespacedHelpers } from 'vuex';
    const { mapState } = createNamespacedHelpers('app');

    export default {
        name: 'Timer',
        props: ['timestamp'],
        computed: {
            ...mapState(['time']),
            currentTime() { return msToTimeStr(Date.now() - this.timestamp); },
        },
    }
</script>

<style lang='scss' scoped>
    .timer {
        position: absolute;
        font-size: 14px;
        right: 8px;
        bottom: 8px;
        font-weight: 300;
        color: #666;
    }
</style>