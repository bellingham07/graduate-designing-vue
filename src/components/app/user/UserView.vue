<script setup>
import {computed, onBeforeMount, reactive, ref} from "vue";
import {Request} from "@/request/request";

// 修改个人信息弹窗
let centerDialogVisible = ref(false)

// 存储个人信息
let info = reactive({
  arr: []
})

// 存储修改后的个人信息
let users = ref({
  Username: "",
  Name: "",
  PhoneNumber: "",
})

const updateInfo = () => {
  console.log("update info")
}

const getTime = ((timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份是从0开始的，所以要加1
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
})

onBeforeMount(() => {
  Request.get('/user/info').then((res) => {
    info.arr = res.data.data
  })
})

</script>

<template>
  <el-descriptions
      class="margin-top"
      title="用户信息"
      :column="3"
      border
  >
    <template #extra>
      <el-button type="primary" @click="centerDialogVisible=true">修改信息</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          用户名
        </div>
      </template>
      {{ info.arr.username }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          手机号
        </div>
      </template>
      {{ info.arr.phone }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          工作地点
        </div>
      </template>
      Suzhou
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          工号
        </div>
      </template>
      <el-tag size="small">{{ info.arr.id }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          入职时间
        </div>
      </template>
      {{ getTime(info.arr.created_at) }}
    </el-descriptions-item>
  </el-descriptions>
  <!--  弹窗-->
  <div class="mask" v-if="centerDialogVisible">
    <div class="box">
      <div class="little-box">
        <div style="width: 40px">昵称</div>
        <el-input v-model="users.Name" placeholder="昵称"/>
      </div>

      <div class="little-box">
        <div style="width: 40px">电话</div>
        <el-input v-model="users.PhoneNumber" placeholder="电话"/>
      </div>
      <el-button @click="centerDialogVisible=false">关闭</el-button>
      <el-button @click="updateInfo()">修改</el-button>
    </div>
  </div>

</template>

<style scoped>
.little-box {
  padding: 10px;
  margin: 3px;
  display: flex;
  flex-direction: row;
}

.box {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  width: 30%;
}

.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>