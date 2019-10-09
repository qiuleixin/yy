<template>
    <el-button type="info" @click='logout'>退出</el-button>
</template>
<script>
    export default {
        methods: {
            logout() {
                window.sessionStorage.clear('token')
                console.log(this)
                this.$router.push('/login')
            }
        }
    }
</script>
<style>

</style>