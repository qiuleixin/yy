<template>
    
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体内容 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区域 -->
                <el-menu
               background-color="#333744"
                text-color="#fff"
                active-text-color="#4090CB"
                unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
                <!-- 一级导航 -->
                <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                    <!-- 一级菜单模板区域 -->
                    <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                    </template>
                   <!-- 二级导航 -->
                    <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" 
                    @click="saveNavState('/'+subitem.path)">
                        <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subitem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                // 左侧菜单数据
                menuList:[],
                iconObj:{
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                isCollapse:false,
                activePath:''
            }
        },
        created() {
        this.getMenuList(),
        this.activePath=window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout() {
                window.sessionStorage.clear('token')
                console.log(this)
                this.$router.push('/login')
                
            },
            // 获取所有菜单
            async getMenuList() {
               const {data:res}=await this.$http.get('menus')
               if(res.meta.status!=200) return this.$message.error('获取表单列表失败')
                this.menuList=res.data
               console.log(res)
            },
            //点击按钮，切换菜单的展开和折叠
            toggleCollapse() {
                this.isCollapse=!this.isCollapse
            },
            //保存连接到激活状态
            saveNavState(activePath) {
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath=activePath
            }
        }
    }
</script>
<style lang="less" scoped>
    .el-container{
        height: 100%;
    }
    .el-header {
        background-color: #373D41;
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        font-size: 20px;
        color: #fff;
        div {
        display: flex;
        align-items: center;
    }span {
        margin-left: 15px;
    }
    }
    
    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right:none;
        }.toggle-button {
            background-color: #4A5064;
            color: #fff;
            font-size: 10px;
            line-height: 24px;
            text-align: center;
            letter-spacing: 0.2em;
            cursor: pointer;
            
        }
    }
    
    .el-main {
        background-color: #EAEDF1;
    }
    .iconfont {
        margin-right: 10px;
    }
</style>