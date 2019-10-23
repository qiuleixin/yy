import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/login.vue'
const Login = () =>
    import ( /* webpackChunkName: "Login_Home_Welcome" */ './components/login.vue')
    // import Home from './components/home.vue'
const Home = () =>
    import ( /* webpackChunkName: "Login_Home_Welcome" */ './components/home.vue')
    // import Welcome from './components/welcome.vue'
const Welcome = () =>
    import ( /* webpackChunkName: "Login_Home_Welcome" */ './components/welcome.vue')

// import User from './components/user/user.vue'
const User = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ './components/user/user.vue')
    // import Rights from './components/power/rights.vue'
const Rights = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ './components/power/rights.vue')
    // import Roles from './components/power/roles.vue'
const Roles = () =>
    import ( /* webpackChunkName: "User_Rights_Roles" */ './components/power/roles.vue')

// import Cate from './components/goods/cate.vue'
const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params_GoodsList_Add" */ './components/goods/cate.vue')
    // import Params from './components/goods/params.vue'
const Params = () =>
    import ( /* webpackChunkName: "Cate_Params_GoodsList_Add" */ './components/goods/params.vue')
    // import GoodsList from './components/goods/list.vue'
const GoodsList = () =>
    import ( /* webpackChunkName: "Cate_Params_GoodsList_Add" */ './components/goods/list.vue')
    // import Add from './components/goods/add.vue'
const Add = () =>
    import ( /* webpackChunkName: "Cate_Params_GoodsList_Add" */ './components/goods/add.vue')

// import Order from './components/order/order.vue'
const Order = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/order/order.vue')
    // import Report from './components/report/report.vue'
const Report = () =>
    import ( /* webpackChunkName: "Order_Report" */ './components/report/report.vue')


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
                    { path: '/goods/add', component: Add },
                    { path: '/orders', component: Order },
                    { path: '/reports', component: Report }
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
    if (to.path === '/login') return next()
        //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router