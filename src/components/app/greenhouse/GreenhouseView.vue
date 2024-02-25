<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {Request} from "@/request/request";
import {ErrorInfo, SuccessInfo} from "@/utils/util";
import router from "@/router";
import {formToJSON} from "axios";

let greenhouse = reactive({
  arr: []
})

let tempInfo = reactive({
  arr: []
})

const injectionVolume = ref()

const waterDialogVisible = ref(false)
const fertilizerDialogVisible = ref(false)
const pesticideDialogVisible = ref(false)

// 开启喷灌弹窗
const startWaterDialog = (info) => {
  tempInfo.arr = info
  waterDialogVisible.value = true
}

// 开启施肥弹窗
const startFertilizerDialog = (info) => {
  tempInfo.arr = info
  fertilizerDialogVisible.value = true
}

// 开启杀虫弹窗
const startPesticideDialog = (info) => {
  tempInfo.arr = info
  pesticideDialogVisible.value = true
}

// 新增农田
const addNewGreenhouse = () => {
  console.log(12345)
}

// 获取农田信息
const getAllGreenHouse = () => {
  Request.get('/greenhouse/all').then((res) => {
    greenhouse.arr = res.data.data.list
  })
}

// 修改农田状态
const changeCeilingStatus = (id, status) => {
  console.log(id, status)
}

// 开始喷灌
const turnOnSprinklerIrrigation = (id) => {
  let gid = parseInt(id)
  let volume = parseInt(injectionVolume.value)
  const data = {
    'g_id': gid,
    'number': volume,
    'flag': 1
  }

  Request.post('/greenhouse/add/source', data).then((res) => {
    if (res.data.code === 200) {
      getAllGreenHouse()
      SuccessInfo("注水成功")
    } else {
      ErrorInfo(res.data.msg)
    }
  })

  waterDialogVisible.value=false
  injectionVolume.value=null
}

// 投放肥料
const putFertilizer = (id) => {
  let gid = parseInt(id)
  let volume = parseFloat(injectionVolume.value)
  const data = {
    'g_id': gid,
    'number': volume,
    'flag': 2
  }

  Request.post('/greenhouse/add/source', data).then((res) => {
    if (res.data.code === 200) {
      getAllGreenHouse()
      SuccessInfo("施肥成功")
    } else {
      ErrorInfo(res.data.msg)
    }
  })

  fertilizerDialogVisible.value=false
  injectionVolume.value=null
}

// 投放杀虫剂
const putPesticide = (id) => {
  let gid = parseInt(id)
  let volume = parseFloat(injectionVolume.value)
  const data = {
    'g_id': gid,
    'number': volume,
    'flag': 3
  }

  Request.post('/greenhouse/add/source', data).then((res) => {
    if (res.data.code === 200) {
      getAllGreenHouse()
      SuccessInfo("喷杀虫剂成功")
    } else {
      ErrorInfo(res.data.msg)
    }
  })

  pesticideDialogVisible.value=false
  injectionVolume.value=null
}

onMounted(
    () => {
      getAllGreenHouse()
    }
)
</script>

<template>
  <div class="wrap">
    <div class="card_wrap" v-for="g in greenhouse.arr" :key="g">
      <div class="card_item">
        <div style="margin-left: 10px">
          <div style="text-align: center;font-size: 30px;color: red;margin-top: 10px">{{ g.id }}号农田</div>

          <div class="item-small-row">
            温度:{{ g.temperature }}℃
            <span v-if="g.temperature<=g.temperature_threshold_up&&g.temperature>=g.temperature_threshold_low" class="box-normal">温度正常</span>
            <span v-else-if="g.temperature<g.temperature_threshold_low" class="box-danger">温度过低</span>
            <span v-else class="box-danger">温度过高</span>
            <span class="box-safe">建议值{{g.temperature_threshold_low}}~{{g.temperature_threshold_up}}℃</span>
          </div>

          <div class="item-small-row">
            湿度:{{ g.humidity }}%
            <span v-if="g.humidity<=g.humidity_threshold_up&&g.humidity>=g.humidity_threshold_low" class="box-normal">湿度正常</span>
            <span v-else-if="g.humidity<g.humidity_threshold_low" class="box-danger">环境过于干燥</span>
            <span v-else class="box-danger">环境过于潮湿</span>
            <span class="box-safe">建议值{{g.humidity_threshold_low}}~{{g.humidity_threshold_up}}%</span>
          </div>

          <div class="item-small-row">
            CO2浓度:{{ g.co2 }}ppm
            <span v-if="g.co2<=g.co2_threshold_up&&g.co2>=g.co2_threshold_low" class="box-normal">正常</span>
            <span v-else-if="g.co2<g.co2_threshold_low" class="box-danger">当前浓度过低</span>
            <span v-else class="box-danger">当前浓度过高</span>
            <span class="box-safe">建议值{{g.co2_threshold_low}}~{{g.co2_threshold_up}}ppm</span>
          </div>

          <div class="item-small-row">农田面积:{{ g.area }}m²</div>

          <div class="item-small-row" v-if="g.ceiling==='1'">棚顶状态:<span
              style="color: #50de50;margin-left: 2px;margin-right: 5px;">打开</span>
            <el-button @click="changeCeilingStatus(g.id,g.ceiling)">切换棚顶状态</el-button>
          </div>
          <div class="item-small-row" v-if="g.ceiling==='2'">棚顶状态:<span
              style="color: red;margin-left: 5px;margin-right: 5px;">关闭</span>
            <el-button @click="changeCeilingStatus(g.id,g.ceiling)">切换棚顶状态</el-button>
          </div>

          <div class="item-small-row">
            <el-button type="success" @click="startWaterDialog(g)">进行浇灌</el-button>
            <span style="margin-left: 10px">今日已浇灌:{{ g.water_used }}L</span>
            <span v-if="g.water_used<=g.water_threshold_up&&g.water_used>=g.water_threshold_low" class="box-normal">正常</span>
            <span v-else-if="g.water_used<g.water_threshold_low" class="box-danger">缺水</span>
            <span v-else class="box-danger">过多</span>
            <span class="box-safe">建议值{{g.water_threshold_low}}~{{g.water_threshold_up}}L</span>
          </div>

          <div class="item-small-row">
            <el-button type="success" @click="startFertilizerDialog(g)">投放肥料</el-button>
            <span style="margin-left: 10px">当前已投放:{{ g.fertilizer_used }}Kg</span>
            <span v-if="g.fertilizer_used<=g.fertilizer_threshold_up&&g.fertilizer_used>=g.fertilizer_threshold_low" class="box-normal">刚好</span>
            <span v-else-if="g.fertilizer_used<g.fertilizer_threshold_low" class="box-danger">缺肥</span>
            <span v-else class="box-danger">过多</span>
            <span class="box-safe">建议值{{g.fertilizer_threshold_low}}~{{g.fertilizer_threshold_up}}Kg</span>
          </div>

          <div class="item-small-row">
            <el-button type="success" @click="startPesticideDialog(g)">喷洒农药</el-button>
            <span style="margin-left: 10px">当前已喷洒:{{g.pesticide_used}}L</span>
            <span v-if="g.pesticide_used<=g.pesticide_threshold_low&&g.pesticide_used>=g.pesticide_threshold_up" class="box-normal">刚好</span>
            <span v-else-if="g.pesticide_used<g.pesticide_threshold_low" class="box-danger">不足</span>
            <span v-else class="box-danger">过多</span>
            <span class="box-safe">建议值{{g.pesticide_threshold_low}}~{{g.pesticide_threshold_low}}L</span>
          </div>
        </div>

      </div>
    </div>
<!--    新增农田按钮-->
<!--    <div @click="addNewGreenhouse" class="card_item">-->
<!--      <div class="plus-sign"></div>-->
<!--    </div>-->

  </div>

  <!--  加水弹窗-->
  <div class="mask" v-if="waterDialogVisible">
    <div class="box">
      <div class="little-box">
        <div>
          当前农田:{{ tempInfo.arr.id }}号农田
          <el-input v-model="injectionVolume" placeholder="输入注水量"></el-input>
        </div>

      </div>
      <el-button type="danger" @click="waterDialogVisible=false">关闭</el-button>
      <el-button type="primary" @click="turnOnSprinklerIrrigation(tempInfo.arr.id)">注水</el-button>
    </div>
  </div>

  <!--  施肥弹窗-->
  <div class="mask" v-if="fertilizerDialogVisible">
    <div class="box">
      <div class="little-box">
        <div>
          当前农田:{{ tempInfo.arr.id }}号农田
          <el-input v-model="injectionVolume" placeholder="输入施肥量"></el-input>
        </div>

      </div>
      <el-button type="danger" @click="fertilizerDialogVisible=false">关闭</el-button>
      <el-button type="primary" @click="putFertilizer(tempInfo.arr.id)">施肥</el-button>
    </div>
  </div>

  <!--  杀虫弹窗-->
  <div class="mask" v-if="pesticideDialogVisible">
    <div class="box">
      <div class="little-box">
        <div>
          当前农田:{{ tempInfo.arr.id }}号农田
          <el-input v-model="injectionVolume" placeholder="输入杀虫剂量"></el-input>
        </div>

      </div>
      <el-button type="danger" @click="pesticideDialogVisible=false">关闭</el-button>
      <el-button type="primary" @click="putPesticide(tempInfo.arr.id)">喷洒农药</el-button>
    </div>
  </div>


</template>

<style scoped>
.plus-sign {
  margin-top: 60%;
  margin-left: 40%;
  width: 50px;
  height: 5px;
  background-color: #333;
  position: relative;
}

.plus-sign::before,
.plus-sign::after {
  content: '';
  width: 5px;
  height: 50px;
  background-color: #333;
  position: absolute;
  top: -22.5px;
  left: 22.5px;
}

.plus-sign::after {
  transform: rotate(90deg);
}

.blue-font {
  width: 40px;
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
}

.box-normal {
  width: 2em; /* 一个汉字的宽度 */
  height: 1em; /* 一个汉字的高度 */
  border: 1px solid #59ea6c; /* 边框样式，可根据需要调整颜色和宽度 */
  font-size: 1em; /* 汉字的标准大小 */
  line-height: 1em; /* 行高，确保文字垂直居中 */
  text-align: center; /* 文字水平居中 */
  color: #59ea6c;
  margin-left: 10px;
}

.box-danger {
  width: 2em; /* 一个汉字的宽度 */
  height: 1em; /* 一个汉字的高度 */
  border: 1px solid #f50935; /* 边框样式，可根据需要调整颜色和宽度 */
  font-size: 1em; /* 汉字的标准大小 */
  line-height: 1em; /* 行高，确保文字垂直居中 */
  text-align: center; /* 文字水平居中 */
  color: #f50935;
  margin-left: 10px;
}

.box-safe {
  width: 2em; /* 一个汉字的宽度 */
  height: 1em; /* 一个汉字的高度 */
  border: 1px solid #3985dc; /* 边框样式，可根据需要调整颜色和宽度 */
  font-size: 1em; /* 汉字的标准大小 */
  line-height: 1em; /* 行高，确保文字垂直居中 */
  text-align: center; /* 文字水平居中 */
  color: #3985dc;
  margin-left: 10px;
}

.item-small-row {
  margin-top: 10px;
}

.wrap {
  /*这个只是让整体在页面居中展示 */
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  align-items: center;
  height: 100%;
  padding: 8px;
}

.card_wrap {
  /*卡片容器 */
  padding: 10px;
}

.card_item {
  /*每个卡片 */
  margin-bottom: 16px;
  padding: 0 8px;
  width: 480px;
  height: 350px;
  border-radius: 8px;
  box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.4);
}

.card_item:hover {
  box-shadow: 0 15px 30px rgba(255, 0, 0, 0.5);
}

</style>