<template>
<div id="login">
  <div class="cotn_principal">
    <div class="cont_centrar">
      <div class="cont_login">
        <div class="cont_info_log_sign_up">
          <div class="col_md_login">
            <div class="cont_ba_opcitiy">
              <h2>LOGIN</h2>
              <p>Lorem ipsum dolor sit amet, consectetur.</p>
              <button class="btn_login" @click="cambiar_login">LOGIN</button>
            </div>
          </div>
          <div class="col_md_sign_up">
            <div class="cont_ba_opcitiy">
              <h2>SIGN UP</h2>
              <p>Lorem ipsum dolor sit amet, consectetur.</p>
              <button class="btn_sign_up" @click="cambiar_sign_up">SIGN UP</button>
            </div>
          </div>
        </div>
        <div class="cont_back_info">
          <div class="cont_img_back_grey"> <img src="./img/po.jpg" alt=""> </div>
        </div>
        <div class="cont_forms">
          <div class="cont_img_back_"> <img src="./img/po.jpg" alt=""> </div>
          <div class="cont_form_login"> <a href="javascript:;" @click="ocultar_login_sign_up"><i class="el-icon-close
"></i></a>
            <h2>LOGIN</h2>
            <input type="text" placeholder="账号" v-model="login.username">
            <input type="password" placeholder="密码" v-model="login.password">
            <button class="btn_login" @click="loginFun">LOGIN</button>
          </div>
          <div class="cont_form_sign_up"> <a href="javascript:;" @click="ocultar_login_sign_up"><i class="el-icon-close
"></i></a>
            <h2>SIGN UP</h2>
            <input type="number" placeholder="账号" v-model="sign.username">
            <input type="text" placeholder="昵称" v-model="sign.nickname">
            <input type="password" placeholder="密码" v-model="sign.password">
            <input type="password" placeholder="再次输入密码" v-model="sign.repassword">
            <div class="gender">
              <el-radio class="radio" v-model="sign.gender" label="b">男</el-radio>
              <el-radio class="radio" v-model="sign.gender" label="g">女</el-radio>
            </div>
            <div class="avatar">
              头像:
              <label>
                <input type="file" v-show=false @change="choiceImg">
                <i class="el-icon-plus" v-show="!avatarPre"></i>
                <img :src="avatarPre" alt="" v-show="avatarPre">
              </label>
            </div>
            <button class="btn_sign_up" @click="signUp">SIGN UP</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog title="编辑头像" v-model="avatarEditDig" size="tiny">
    <div class="avatarEdit">
      <img :src="avatarEditUrl" class="avatarEditImg" alt="" v-show="false">
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cut">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import API from '@/common/api'
import utils from '@/common/utils'
export default {
  name: 'login',
  data () {
    return {
      avatarEditDig: false,
      avatarEditUrl: '',
      avatarPre: '',
      login: {
        username: '',
        password: ''
      },
      sign: {
        username: '',
        nickname: '',
        password: '',
        repassword: '',
        gender: 'b',
        avatar: null
      }
    }
  },
  mounted () {

  },
  methods: {
    cambiar_login () {
      document.querySelector('.cont_forms').className = 'cont_forms cont_forms_active_login';
      document.querySelector('.cont_form_login').style.display = 'block';
      document.querySelector('.cont_form_sign_up').style.opacity = 0;
      setTimeout(function () {
        document.querySelector('.cont_form_login').style.opacity = 1;
      }, 400);
      setTimeout(function () {
        document.querySelector('.cont_form_sign_up').style.display = 'none';
      }, 200);
    },
    cambiar_sign_up () {
      document.querySelector('.cont_forms').className = 'cont_forms cont_forms_active_sign_up';
      document.querySelector('.cont_form_sign_up').style.display = 'block';
      document.querySelector('.cont_form_login').style.opacity = 0;
      setTimeout(function () {
        document.querySelector('.cont_form_sign_up').style.opacity = 1;
      }, 100);
      setTimeout(function () {
        document.querySelector('.cont_form_login').style.display = 'none';
      }, 400);
    },
    ocultar_login_sign_up () {
      document.querySelector('.cont_forms').className = 'cont_forms';
      document.querySelector('.cont_form_sign_up').style.opacity = 0;
      document.querySelector('.cont_form_login').style.opacity = 0;
      setTimeout(function () {
        document.querySelector('.cont_form_sign_up').style.display = 'none';
        document.querySelector('.cont_form_login').style.display = 'none';
      }, 500);
    },
    choiceImg (e) {          // 选取照片
      let vm = this;
      vm.avatarEditDig = true;
      if (vm.avatarEditUrl) {
        $('.avatarEditImg').cropper('replace', utils.getUrl(e.target.files[0]));
        e.target.value = '';
        return;
      }
      vm.avatarEditUrl = utils.getUrl(e.target.files[0]);
      setTimeout(function () {
        $('.avatarEditImg').cropper({
          dragMode: '',
          strict: false,
          responsive: true,
          autoCropArea: 1,
          dragCrop: false,
          rotatable: true,
          aspectRatio: 1,
          built: function () {
            e.target.value = '';
          }
        });
      }, 100)
    },
    cut () {      // 裁剪
      this.avatarEditDig = false;
      this.avatarPre = $('.avatarEditImg').cropper('getCroppedCanvas', {
        width: 200,
        height: 200,
        fillColor: '#fff'
      }).toDataURL('image/jpeg');
      this.sign.avatar = utils.dataURItoBlob(this.avatarPre);
    },
    loginFun () {         // 登录
      let vm = this;
      vm.$axios.post(API.LOGIN, vm.login)
      .then(data => {
        if (data.data.isSuccess) {
          sessionStorage.setItem('user', JSON.stringify(data.data.data));
          vm.$store.commit('setUser', data.data.data);
          vm.$router.push({name: 'Menu'});
        } else {
          vm.$message.warning(data.data.msg);
        }
      })
    },
    signUp () {         // 注册
      let vm = this;
      if (!(vm.sign.username && vm.sign.password && vm.sign.repassword && vm.sign.nickname && vm.sign.gender && vm.sign.avatar)) {
        vm.$message.warning('请填写完整信息');
        return;
      }
      const formData = new FormData();
      formData.append('username', vm.sign.username);
      formData.append('nickname', vm.sign.nickname);
      formData.append('password', vm.sign.password);
      formData.append('repassword', vm.sign.repassword);
      formData.append('gender', vm.sign.gender);
      formData.append('avatar', vm.sign.avatar);
      vm.$axios.post(API.REGISTER, formData)
      .then(data => {
        if (data.data.isSuccess) {
          sessionStorage.setItem('user', JSON.stringify(data.data.data));
          vm.$store.commit('setUser', data.data.data);
          vm.$router.push({name: 'Menu'});
        } else {
          vm.$message.warning(data.data.msg);
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#login {
    h2 {
      font-family: cursive;
    }
    text-align: center;
    * {
        margin: 0 auto;
    }
    .gender {
      text-align: left;
      padding: 15px 30px;
      color: #757575;
    }
    .avatar {
      text-align: left;
      padding: 0 30px 10px;
      line-height: 50px;
      height: 50px;
      font-size: 14px;
      i {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        margin-left: 0;
        color: #505050;
        width: 50px;
        height: 50px;
        font: 30px/50px "";
        border: 1px #888 dashed;
        border-radius: 5px;
        cursor: pointer;
      }
      img {
        width: 50px;
        vertical-align: middle;
        cursor: pointer;
      }
    }
    .avatarEdit {
      width: 300px;
      height: 300px;
      margin: 0 auto;
      overflow: hidden;
    }
    .cotn_principal {
        position: absolute;
        width: 100%;
        height: 100%;
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#cfd8dc+0,607d8b+100,b0bec5+100 */
        background: #aac4bc;
        /* Old browsers */
        background: -moz-linear-gradient(-45deg, #aac4bc 0%, #eca8a8 100%, #eed5a9 100%);
        /* FF3.6-15 */
        background: -webkit-linear-gradient(-45deg, #aac4bc 0%,#eca8a8 100%,#eed5a9 100%);
        /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(135deg, #aac4bc 0%,#eca8a8 100%,#eed5a9 100%);
        /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr= '#cfd8dc', endColorstr='#b0bec5',GradientType=1 );
        /* IE6-9 fallback on horizontal gradient */

    }

    .cont_centrar {
        position: relative;
        float: left;
        width: 100%;

    }

    .cont_login {
        position: relative;
        width: 640px;
        left: 50%;
        margin-left: -320px;

    }

    .cont_back_info {
        position: relative;
        float: left;
        width: 640px;
        height: 280px;
        overflow: hidden;
        background-color: #fff;
        margin-top: 100px;
        box-shadow: 1px 10px 30px -10px rgba(0,0,0,0.5);
    }

    .cont_forms {
        position: absolute;
        overflow: hidden;
        top: 100px;
        left: 0;
        width: 320px;
        height: 280px;
        background-color: #eee;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -ms-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
    }

    .cont_forms_active_login {
        box-shadow: 1px 10px 30px -10px rgba(0,0,0,0.5);
        height: 420px;
        top: 20px;
        left: 0;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -ms-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;

    }

    .cont_forms_active_sign_up {
        box-shadow: 1px 10px 30px -10px rgba(0,0,0,0.5);
        height: 520px;
        top: 20px;
        left: 320px;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -ms-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
    }

    .cont_img_back_grey {
        position: absolute;
        width: 950px;
        top: -80px;
        left: -116px;
    }

    .cont_img_back_grey > img {
        width: 100%;
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
        opacity: 0.2;
        animation-name: animar_fondo;
        animation-duration: 20s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-direction: alternate;

    }

    .cont_img_back_ {
        position: absolute;
        width: 950px;
        top: -80px;
        left: -116px;
    }

    .cont_img_back_ > img {
        width: 100%;
        opacity: 0.3;
        animation-name: animar_fondo;
        animation-duration: 20s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    .cont_forms_active_login > .cont_img_back_ {
        top: 0;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -ms-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
    }

    .cont_forms_active_sign_up > .cont_img_back_ {
        top: 0;
        left: -435px;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -ms-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
    }

    .cont_info_log_sign_up {
        position: absolute;
        width: 640px;
        height: 280px;
        top: 100px;
        z-index: 1;
    }

    .col_md_login {
        position: relative;
        float: left;
        width: 50%;
    }

    .col_md_login > h2 {
        font-weight: 400;
        margin-top: 70px;
        color: #757575;
    }

    .col_md_login > p {
        font-weight: 400;
        margin-top: 15px;
        width: 80%;
        color: #37474F;
    }

    .btn_login {
        background-color: #FF9800;
        border: none;
        padding: 10px;
        width: 200px;
        border-radius: 3px;
        box-shadow: 1px 5px 20px -5px rgba(0,0,0,0.4);
        color: #fff;
        margin-top: 10px;
        cursor: pointer;
    }

    .col_md_sign_up {
        position: relative;
        float: left;
        width: 50%;
    }

    .cont_ba_opcitiy > h2 {
        font-weight: 400;
        color: #fff;
    }

    .cont_ba_opcitiy > p {
        font-weight: 400;
        margin-top: 15px;
        color: #fff;
    }
    /* ----------------------------------
  background text
  ------------------------------------
   */
    .cont_ba_opcitiy {
        position: relative;
        background-color: rgba(187, 168, 170, 0.79);
        width: 80%;
        border-radius: 3px;
        margin-top: 60px;
        padding: 15px 0;
    }

    .btn_sign_up {
        background-color: #f44336;
        border: none;
        padding: 10px;
        width: 200px;
        border-radius: 3px;
        box-shadow: 1px 5px 20px -5px rgba(0,0,0,0.4);
        color: #fff;
        margin-top: 10px;
        cursor: pointer;
    }
    .cont_forms_active_sign_up {
        z-index: 2;
    }
    @-webkit-keyframes animar_fondo {
        from {
            -webkit-transform: scale(1) translate(0px);
            -moz-transform: scale(1) translate(0px);
            -ms-transform: scale(1) translate(0px);
            -o-transform: scale(1) translate(0px);
            transform: scale(1) translate(0px);
        }
        to {
            -webkit-transform: scale(1.5) translate(50px);
            -moz-transform: scale(1.5) translate(50px);
            -ms-transform: scale(1.5) translate(50px);
            -o-transform: scale(1.5) translate(50px);
            transform: scale(1.5) translate(50px);
        }
    }
    @-o-keyframes identifier {
        from {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            -o-transform: scale(1);
            transform: scale(1);
        }
        to {
            -webkit-transform: scale(1.5);
            -moz-transform: scale(1.5);
            -ms-transform: scale(1.5);
            -o-transform: scale(1.5);
            transform: scale(1.5);
        }

    }
    @-moz-keyframes identifier {
        from {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            -o-transform: scale(1);
            transform: scale(1);
        }
        to {
            -webkit-transform: scale(1.5);
            -moz-transform: scale(1.5);
            -ms-transform: scale(1.5);
            -o-transform: scale(1.5);
            transform: scale(1.5);
        }

    }
    @keyframes identifier {
        from {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            -o-transform: scale(1);
            transform: scale(1);
        }
        to {
            -webkit-transform: scale(1.5);
            -moz-transform: scale(1.5);
            -ms-transform: scale(1.5);
            -o-transform: scale(1.5);
            transform: scale(1.5);
        }
    }
    .cont_form_login {
        position: absolute;
        opacity: 0;
        display: none;
        width: 320px;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -ms-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
    }

    .cont_forms_active_login {
        z-index: 2;
    }
    .cont_forms_active_login > .cont_form_login {}

    .cont_form_sign_up {
        position: absolute;
        width: 320px;
        float: left;
        opacity: 0;
        display: none;
        -webkit-transition: all 0.5s;
        -moz-transition: all 0.5s;
        -ms-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
    }

    .cont_form_sign_up > input {
        text-align: left;
        padding: 15px 5px;
        margin-left: 10px;
        margin-top: 20px;
        width: 260px;
        border: none;
        color: #757575;
    }

    .cont_form_sign_up > h2 {
        margin-top: 50px;
        font-weight: 400;
        color: #757575;
    }

    .cont_form_login > input {
        padding: 15px 5px;
        margin-left: 10px;
        margin-top: 20px;
        width: 260px;
        border: none;
        text-align: left;
        color: #757575;
    }

    .cont_form_login > h2 {
        margin-top: 110px;
        font-weight: 400;
        color: #757575;
    }
    .cont_form_login > a,
    .cont_form_sign_up > a {
        color: #757575;
        position: relative;
        float: left;
        margin: 10px 10px 10px 30px;
    }
}
</style>
