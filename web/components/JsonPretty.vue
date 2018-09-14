<template>
    <pre>
    {{ data | pretty }}
    </pre>
</template>

<script>
    export default {
        name: 'VuePretty',
        props: ['data'],
        filters: {
            pretty: function(value) {
                return JSON.stringify(value, null, 4);
            }
        }
    }
</script>