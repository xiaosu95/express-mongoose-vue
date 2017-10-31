import Router from 'vue-router'
import Vue from 'vue'
const Login = resolve => require(['@/components/login/login.vue'], resolve);
const Chat = resolve => require(['@/components/chat/chat.vue'], resolve);
const Blog = resolve => require(['@/components/blog/blog.vue'], resolve);
const BlogList = resolve => require(['@/components/blog/blogList.vue'], resolve);
const BlogContent = resolve => require(['@/components/blog/blogContent.vue'], resolve);
const Menu = resolve => require(['@/components/menu/menu.vue'], resolve);

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/menu',
      name: 'Menu',
      component: Menu
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/blog',
      name: 'Blog',
      component: Blog,
      children: [
        {
          path: 'blogList',
          name: 'BlogList',
          component: BlogList
        },
        {
          path: 'blogContent',
          name: 'BlogContent',
          component: BlogContent
        }
      ]
    }
  ]
})
