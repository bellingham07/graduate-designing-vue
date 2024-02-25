<script setup>
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import {Request} from "@/request/request";
import * as echarts from "echarts";
import {ErrorInfo, SuccessInfo} from "@/utils/util";

const leftoverWater = ref(0)
const leftover = ref(0)
const todayUsed = ref(0)

const height = ref(0)

const x = ref(['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子', '123', '456'])
const y = ref([5, 20, 36, 10, 10, 20, 12, 23])

const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value

// 设置蓄水池高度
const setWaterHeight = () => {
  // 假设 height 是一个表示高度的变量
  leftover.value = leftoverWater.value / 1000
  height.value = `calc(500px * ${leftover.value})`
}

// 获取剩余水量
const getLeftoverWater = () => {
  Request.get("/water/info").then((res) => {
    if (res.data.code === 200) {
      leftoverWater.value = res.data.data.surplus
      todayUsed.value = res.data.data.today_used
      setWaterHeight()
    } else {
      ErrorInfo(res.data.msg)
    }
  })
}

// 获取水资源情况
const getWaterUsedInfo = () => {
  Request.get("/water/used").then((res) => {
    if (res.data.code === 200) {
      x.value = res.data.data.date
      y.value = res.data.data.used
      init()
    } else {
      ErrorInfo(res.data.msg)
    }
  })
}

onMounted(
    () => {
      getLeftoverWater()
      getWaterUsedInfo()
    }
)

const init = () => {
  // 基于准备好的dom，初始化echarts实例
  const myChart = echarts.init(main.value);
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '用水量分布图'
    },
    tooltip: {},
    legend: {
      data: ['水量']
    },
    xAxis: {
      data: x.value
    },
    yAxis: {},
    series: [
      {
        name: '水量',
        type: 'bar',
        data: y.value
      }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}
</script>

<template>
  <div style="display: flex">
    <!--  left-->
    <div ref="main" class="left">left</div>
    <!--  right-->
    <div class="right">
      <div class="cylinder">
        <div class="circle"></div>
        <div class="bg"></div>
        <div class="water" :style="{ height }"></div>
      </div>
      <div class="right-info">
        <div>总容量:1000(立方米)</div>
        <div>剩余量:{{ leftoverWater }}(立方米)</div>
        <div>今日使用:{{ todayUsed }}(立方米)</div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.left {
  flex: 6;
  height: 700px;
}

.right {
  flex: 4;
  height: 700px;
}

.right-info {
  margin-left: 40%;
  margin-top: 50px;
}

.cylinder {
  position: relative;
  overflow: hidden;
  margin: 40px auto 0;
  width: 388px;
  height: 500px;
  border-radius: 50px/25px;
  border: 2px solid blue;
}

.bg {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  top: 40px;
  width: 200px;
  height: 260px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 24%, rgba(255, 255, 255, 0.15) 34%, rgba(255, 255, 255, 0.1) 44%, rgba(255, 255, 255, 0.25) 66%, rgba(255, 255, 255, 0.5) 80%, rgba(255, 255, 255, 0.2) 89%, rgba(255, 255, 255, 0) 100%);
}

.circle {
  position: absolute;
  left: 4px;
  top: 4px;
  width: 375px;
  height: 34px;
  border-radius: 50px/25px;
  border: 2px solid blue;
  background-color: rgba(160, 160, 160, 0);
  content: '';
}

.cylinder:before {
  position: absolute;
  left: -2px;
  top: -2px;
  width: 390px;
  height: 46px;
  border-radius: 50px/25px;
  border: 2px solid blue;
  background-color: rgba(160, 160, 160, 0);
  content: '';
}

.cylinder:after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 188px;
  height: 50px;
  border-radius: 50px/25px;
  background-color: rgba(160, 160, 160, 0);
  content: '';
}

.water {
  position: absolute;
  z-index: -1;
  left: 4px;
  bottom: 4px;
  width: 375px;
  height: 0;
  padding-top: 50px;
  border-radius: 50px/25px;
  border: 2px solid #fff;
  /* 	background-color: rgba(0, 160, 160, 0.5); */
  background: linear-gradient(270deg, #2edcdc 0%, #2edcdc 61%, #2edcdc 100%);
  transition: 0.3s linear;
}

.water:before {
  position: absolute;
  left: -2px;
  top: -1px;
  width: 375px;
  height: 34px;
  border-radius: 50px/25px;
  border: 2px solid #e81111;
  background-color: rgba(0, 160, 160, 0.2);
  content: '';
}

.water:after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 175px;
  height: 34px;
  border-radius: 50px/25px;
  background-color: rgba(0, 160, 160, 0);
  content: '';
}
</style>