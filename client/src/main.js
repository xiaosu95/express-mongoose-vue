// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import ElementUI from 'element-ui'
import VueLazyload from 'vue-lazyload'
import 'element-ui/lib/theme-default/index.css'
import Axios from 'axios'
// import store from './store/index.js'

Vue.use(ElementUI)
Vue.prototype.$axios = Axios
Vue.config.productionTip = false
Vue.use(VueLazyload, {
  error: './static/img/lazyload.png',
  loading: './static/img/lazyload.png',
  try: 1 // default 1
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
Vue.filter('adQiniuUrlFilter', function (url, width, height) {
  if (url.indexOf('mp4') !== -1 && url.indexOf('base64') === -1) {
    return `${url}?vframe/jpg/offset/7/w/${parseInt(width)}/h/${parseInt(height)}`;
  } else {
    return url;
  }
})
Vue.filter('order', function (num) {
  if (num <= 9) return `NO.0${num}`;
  else return `NO.${num}`;
})
Vue.filter('timeFilter', function (val) {
  let date = new Date(val);
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  // let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  let time = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
  return time;
})
Vue.filter('timeFilter2', function (val) {
  let date = new Date(val);
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  let time = `${date.getFullYear()}-${month}-${day}`;
  return time;
})
