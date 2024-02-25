<script setup>
import {reactive} from "vue";
import {Request} from "@/request/request";
import router from "@/router";
import {ErrorInfo, SuccessInfo} from "@/utils/util";

const form = reactive({
  phone: '',
  password: '',
  confirm_password: ''
})

const register = () => {
  Request.post("/user/register",JSON.stringify(form)).then((res) => {
    if (res.data.code === 200) {
      SuccessInfo("注册成功，请切换登录页面")
      router.push('/')
    } else {
      ErrorInfo(res.data.msg)
    }
  })
}
</script>

<template>
  <div class="login">
    <el-input class="login-button" v-model="form.phone" placeholder="手机号"/>
    <el-input type="password" class="login-button" v-model="form.password" placeholder="密码"/>
    <el-input type="password" class="login-button" v-model="form.confirm_password" placeholder="确认密码"/>
    <br>
    <el-button @click="register()" class="login-button" type="success">注册</el-button>
    <br>
    <router-link to="/">返回登录</router-link>
  </div>
</template>

<style scoped>
.login-button {
  width: 80%;
  height: 60px;
  margin-left: 10%;
  margin-top: 10px;
  font-size: 25px;
}

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 500px;
  border-radius: 20px;
  background-color: white;
}

a {
  width: 20%;
  margin-top: 20px;
  margin-left: 47%;
}
</style>
