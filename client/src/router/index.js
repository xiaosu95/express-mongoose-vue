import Router from 'vue-router'
import Vue from 'vue'
const Login = resolve => require(['@/components/login/login.vue'], resolve)
Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
