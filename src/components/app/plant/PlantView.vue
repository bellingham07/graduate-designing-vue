<script setup>
import {onMounted, reactive} from "vue";
import {Request} from "@/request/request";
import {ErrorInfo, SuccessInfo} from "@/utils/util";

let tableData = reactive({
  arr: []
})

const getPlantInfo = () => {
  Request.get('/plant/info').then((res) => {
    tableData.arr = res.data.data.list
  })
}

const clearInfo = (row, flag) => {
  const data = {
    'id': row.area,
    'flag': flag
  }
  Request.post("/plant/info", data).then((res) => {
    if (res.data.code === 200) {
      SuccessInfo("清除成功")
      getPlantInfo()
    } else {
      ErrorInfo(res.data.msg)
    }
  })
}

onMounted(
    () => {
      getPlantInfo()
    }
)
</script>

<template>
  <div>
    <el-table :data="tableData.arr" style="width: 100%">
      <el-table-column prop="area" label="土地编号" width="180"/>
      <el-table-column prop="fertilizer" label="施肥情况" width="180"/>
      <el-table-column prop="pesticide" label="农药情况" width="180"/>

      <el-table-column prop="name" label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="danger" @click="clearInfo(scope.row,2)">清除肥料信息</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="danger" @click="clearInfo(scope.row,1)">清除农药信息</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>