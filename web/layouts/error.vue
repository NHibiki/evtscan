<template>
    <div class="container err">
        <h1 v-if="error.statusCode === 404">Page not found</h1>
        <h1 v-else>Server internal error</h1>
        <div class="rest">
            <nuxt-link to="/">⬅&nbsp;&nbsp;&nbsp;Back to Homepage</nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    props: ['error']
}
</script>

<style lang="scss" scoped>
    .err {
        max-width: 1100px;
        position: relative;
        padding: 0 20px;
        margin: 0 auto;

        h1 {
            font-family: "Quicksand";
            font-weight: 300;
            margin: 64px 0;
        }

        a {
            font-family: "Quicksand";
            font-weight: 300;
            text-decoration: none;
            float: right;
            padding: 10px 20px;
            border-radius: 45px;
            background: #FFF;
            color: #e6a938;
            box-shadow: 0 5px 15px rgba(0, 0, 0, .1);
            transition: .1s linear;

            &:hover {
                background: #e6a938;
                color: white;
                box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            }

        }

        .rest {
            height: 240px;
        }
    }
</style>