<script setup>
import {onMounted, reactive, ref} from "vue";
import {Request} from "@/request/request";
import {ErrorInfo, SuccessInfo} from "@/utils/util";

let tableData = reactive({
  arr: []
})

let centerDialogVisible = ref(false)

let tableTmpInfo = reactive({
  temperature_threshold_low:0.0,
  temperature_threshold_up:0.0,
  humidity_threshold_low:0.0,
  humidity_threshold_up:0.0,
  co2_threshold_low:0.0,
  co2_threshold_up:0.0,
  water_threshold_low:0.0,
  water_threshold_up:0.0,
  pesticide_threshold_low:0.0,
  pesticide_threshold_up:0.0,
  fertilizer_threshold_low:0.0,
  fertilizer_threshold_up:0.0,
})

const getPlantInfo = () => {
  Request.get('/farmland/all').then((res) => {
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

const changeThreshold = (info) => {
  tableTmpInfo = info
  centerDialogVisible.value = true
}

const submit=()=>{
  if (tableTmpInfo.temperature_threshold_low>tableTmpInfo.temperature_threshold_up){
    ErrorInfo("温度下限不能高于温度上限")
    return
  }
  if (tableTmpInfo.humidity_threshold_low>tableTmpInfo.humidity_threshold_up){
    ErrorInfo("湿度下限不能高于湿度上限")
    return
  }
  if (tableTmpInfo.co2_threshold_low>tableTmpInfo.co2_threshold_up){
    ErrorInfo("co2浓度下限不能高于co2浓度上限")
    return
  }
  if (tableTmpInfo.water_threshold_low>tableTmpInfo.water_threshold_up){
    ErrorInfo("水量下限不能高于水量上限")
    return
  }
  if (tableTmpInfo.pesticide_threshold_low>tableTmpInfo.pesticide_threshold_up){
    ErrorInfo("农药下限不能高于农药上限")
    return
  }
  if (tableTmpInfo.fertilizer_threshold_low>tableTmpInfo.fertilizer_threshold_up){
    ErrorInfo("肥料下限不能高于肥上限")
    return
  }
  Request.post("/farmland/update", tableTmpInfo).then((res) => {
    if (res.data.code === 200) {
      SuccessInfo("修改成功")
      centerDialogVisible.value=false
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
      <el-table-column prop="g_id" label="土地编号" width="80"/>
      <el-table-column prop="temperature_threshold_low" label="温度阈值下限(℃)" width="110"/>
      <el-table-column prop="temperature_threshold_up" label="温度阈值上限(℃)" width="110"/>
      <el-table-column prop="humidity_threshold_low" label="湿度阈值下限(%)" width="110"/>
      <el-table-column prop="humidity_threshold_up" label="湿度阈值上限(%)" width="110"/>
      <el-table-column prop="co2_threshold_low" label="CO2阈值下限(ppm)" width="110"/>
      <el-table-column prop="co2_threshold_up" label="CO2阈值上限(ppm)" width="110"/>
      <el-table-column prop="water_threshold_low" label="灌水量阈值下限(L)" width="130"/>
      <el-table-column prop="water_threshold_up" label="灌水量阈值上限(L)" width="130"/>
      <el-table-column prop="pesticide_threshold_low" label="农药阈值下限(L)" width="110"/>
      <el-table-column prop="pesticide_threshold_up" label="农药阈值上限(L)" width="110"/>
      <el-table-column prop="fertilizer_threshold_low" label="肥料阈值下限(kg)" width="110"/>
      <el-table-column prop="fertilizer_threshold_up" label="肥料阈值上限(kg)" width="110"/>

      <el-table-column prop="name" label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="success" @click="changeThreshold(scope.row)">修改阈值</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!--  弹窗-->
  <div class="mask" v-if="centerDialogVisible">
    <div class="box">
      <div class="little-box">
        <div class="blue-font">温度阈值下限</div>
        <input type="number" v-model="tableTmpInfo.temperature_threshold_low">
      </div>
      <div class="little-box">
        <div class="blue-font">温度阈值上限</div>
        <input type="number" v-model="tableTmpInfo.temperature_threshold_up">

      </div>
      <div class="little-box">
        <div class="blue-font">湿度阈值下限</div>
        <input type="number" v-model="tableTmpInfo.humidity_threshold_low">

      </div>
      <div class="little-box">
        <div class="blue-font">湿度阈值上限</div>
        <input type="number" v-model="tableTmpInfo.humidity_threshold_up">

      </div>
      <div class="little-box">
        <div class="blue-font">CO2阈值下限</div>
        <input type="number" v-model="tableTmpInfo.co2_threshold_low">

      </div>
      <div class="little-box">
        <div class="blue-font">CO2阈值上限</div>
        <input type="number" v-model="tableTmpInfo.co2_threshold_up">

      </div>
      <div class="little-box">
        <div class="blue-font">灌水量阈值下限</div>
        <input type="number" v-model="tableTmpInfo.water_threshold_low">

      </div>
      <div class="little-box">
        <div class="blue-font">灌水量阈值上限</div>
        <input type="number" v-model="tableTmpInfo.water_threshold_up">

      </div>
      <div class="little-box">
        <div class="blue-font">农药阈值下限</div>
        <input type="number" v-model="tableTmpInfo.pesticide_threshold_low">

      </div>
      <div class="little-box">
        <div class="blue-font">农药阈值上限</div>
        <input type="number" v-model="tableTmpInfo.pesticide_threshold_up">

      </div>
      <div class="little-box">
        <div class="blue-font">肥料阈值下限</div>
        <input type="number" v-model="tableTmpInfo.fertilizer_threshold_low">

      </div>
      <div class="little-box">
        <div class="blue-font">肥料阈值上限</div>
        <input type="number" v-model="tableTmpInfo.fertilizer_threshold_up">
      </div>
      <el-button type="danger" @click="centerDialogVisible=false">关闭</el-button>
      <el-button type="primary" @click="submit">提交修改</el-button>
    </div>

  </div>

</template>

<style scoped>

.blue-font {
  width: 130px;
  color: #2cc4bf;
}

.little-box {
  padding: 10px;
  margin: 3px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid black;
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
  z-index: 100;
}
</style>