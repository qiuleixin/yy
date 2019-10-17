import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home.vue'
import Welcome from './components/welcome.vue'
import User from './components/user/user.vue'
import Rights from './components/power/rights.vue'
import Roles from './components/power/roles.vue'
import Cate from './components/goods/cate.vue'
import Params from './components/goods/params.vue'
import GoodsList from './components/goods/list.vue'
import Add from './components/goods/add.vue'


Vue.use(Router)

const router = new Router({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                redirect: '/welcome',
                component: Home,
                children: [{ path: '/welcome', component: Welcome },
                    { path: '/users', component: User },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/categories', component: Cate },
                    { path: '/params', component: Params },
                    { path: '/goods', component: GoodsList },
                    { path: '/goods/add', component: Add }
                ]
            }
        ]
    })
    //挂载路由导航守卫
router.beforeEach((to, form, next) => {
    //to 将要访问的路径
    //form 代表从那个路径跳转而来
    // next 是一个函数，放行
    // next() 放行， next('/login') 强行跳转
    if (to.path == '/login') next()
        //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) next('/login')
    next()
})

export default router