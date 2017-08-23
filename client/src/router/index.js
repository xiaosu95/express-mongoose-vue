import Router from 'vue-router'
import Vue from 'vue'
const Login = resolve => require(['@/components/login/login.vue'], resolve);
const Chat = resolve => require(['@/components/chat/chat.vue'], resolve);
const Blog = resolve => require(['@/components/blog/blog.vue'], resolve);

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog
    }
  ]
})
