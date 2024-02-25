<script setup>
import {reactive, ref} from 'vue'
import router from "@/router";
import {Request} from "@/request/request";
import {ErrorInfo, SuccessInfo} from "@/utils/util";

const form = reactive({
  phone: '',
  password: ''
})

const config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  },
};

const login = () => {
  Request.post('/user/login', form).then((res) => {
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.access_token)
      SuccessInfo("登录成功")
      router.push('/index/green')
    }else{
      ErrorInfo(res.data.msg)
    }
  })
}
</script>

<template>
  <div class="login">
    <el-input class="login-button" v-model="form.phone"
              placeholder="手机号"/>
    <el-input type="password" class="login-button"
              v-model="form.password" placeholder="密码"/>
    <br>
    <el-button @click="login()" class="login-button"
               type="success">登录
    </el-button>
    <br>
    <router-link to="/reg">没有账号？立即注册</router-link>
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
  width: 80%;
  height: 60px;
  margin-left: 43%;
  margin-top: 10px;
}
</style>
