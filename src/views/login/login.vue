<template>
  <div class="login-container vlt-card">
    <div class="mid">
      <img :src="logoImg" class="companyLogo" />
      <div class="form-bd">
        <img :src="titleImg" class="title" />
        <div class="vlt-edit-single">
          <div class="inputAll">
            <el-form ref="form" :model="form" :rules="rules">
              <el-form-item prop="account">
                <el-input readonly @focus="e => {e.target.removeAttribute('readonly')}" prefix-icon="el-icon-user" v-model.trim="form.account" placeholder="请输入用户账号"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input readonly @focus="e => {e.target.removeAttribute('readonly')}" prefix-icon="el-icon-lock" type="password" v-model.trim="form.password" placeholder="请输入用户密码" @keyup.enter.native="login"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="registerPwd">
            <el-row>
              <el-button class="btn" @click="login">登录</el-button>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rules from "@/utils/rules"
import storage from "@/utils/storage"
import {Encrypt} from '@/utils/crypto'
import { mapActions } from 'vuex';

export default {
  name: "login",
  data() {
    return {
      logoImg: require('@/assets/img/companyLogo.png'),
      titleImg: require('@/assets/img/title.png'),
      menuBtnList: [],
      form: {
        account: '',
        password: '',
      },
      rules: {
        account: [
          { required: true, validator: rules.checkAccount, trigger: ['change','blur']}
        ],
        password: [
          { required: true, validator: rules.checkPwd, trigger: ['blur'] }
        ]
      }
    };
  },
  computed: {},
  async created() {
    // 报表与BI第三方接口授权登录
    // 报表登录
    // await this.authUserLogin('reportUserLogin', {
    //   fine_username: 'admin',
    //   fine_password: 'manager',
    //   validity: -2
    // }); 
    // // BI登录
    // this.authUserLogin('biUserLogin', {
    //   fine_username: 'admin',
    //   fine_password: '123456',
    //   validity: -2
    // });
  },
  mounted() {},
  methods: {
    ...mapActions(['getInsData', 'setLogin', 'getMenuData']),
    // 报表与BI第三方授权登录
    async authUserLogin(apiName, data) {
      const res = await this.$api[apiName]({
        data
      });
      if (res && res.accessToken) {
        console.log(apiName + '_token', res.accessToken);
        storage.set(apiName + '_token', 'Bearer ' + res.accessToken)
      }
    },
    login() {
      this.$refs.form.validate(async val => {
        if (val) {
          const data = {
            account: this.form.account,
            password: Encrypt(this.form.password)
          };
          const res = await this.$api.getLogin({
            message: '登录成功',
            data
          });
          if (res && res.code === 0) {
            storage.set("token", res.data.token);
            storage.set("userInfo", res.data);
            this.setLogin(res.data);
            let param = {
              type: 0
            };
            this.getMenuData(param)
            // this.getMenuList(param);
            this.getInsData()
            this.$router.push({
              name: "entry"
            });
          }
        }
      })
    },
    // 获取菜单权限
    getMenuList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getUserAndModule({ data });
        if (res && res.code == 0) {
          this.$storage.set('menuList', res.data)
          self.filterBtn(res.data, 4)
          this.$storage.set('menuBtnList', self.menuBtnList)
          console.log(self.menuBtnList)
        }
      })(data);
    },
    // 筛选按钮
    filterBtn(data, type) {
      const self = this;
      data&&data.forEach((item)=>{
        let obj = {};
        if(item.type == type) {
          obj.permission = item.code;
          self.menuBtnList.push(obj)
        }else{
          self.filterBtn(item.children, type)
        }
      })
    },
  }
};
</script>


<style lang="less" scoped>
@import "./less/login.less";
</style>