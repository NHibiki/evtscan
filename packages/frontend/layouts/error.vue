<template>
    <div class="container err">
        <h1 v-if="error.statusCode === 404">{{ $t('system.error.notfound') }} </h1>
        <h1 v-else>{{ $t('system.error.servererror') }}</h1>
        <div class="rest">
            <nuxt-link :to="$i18n.path('/')">⬅&nbsp;&nbsp;&nbsp;{{ $t('system.info.tohome') }}</nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    head() { return { title: this.$t('sitename') } },
    props: ['error']
}
</script>

<style lang="scss" scoped>

    @import "@/assets/define.scss";

    .err {
        max-width: 1100px;
        position: relative;
        padding: 0 20px;
        margin: 0 auto;

        h1 {
            @include withQuick(300);
            margin: 64px 0;
        }

        a {
            @include withQuick(300);
            @include outlineShadow(45px);
            text-decoration: none;
            float: right;
            padding: 10px 20px;
            background: #FFF;
            color: $themeColor;
            transition: .1s linear;

            &:hover {
                background: $themeColor;
                color: white;
                @include outlineShadowFocus();
            }

        }

        .rest {
            height: 240px;
        }
    }
</style>