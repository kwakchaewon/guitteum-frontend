<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart as ELineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([ELineChart, GridComponent, TooltipComponent, DataZoomComponent, CanvasRenderer])

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  period: {
    type: String,
    default: '1y',
    validator: (v) => ['6m', '1y'].includes(v),
  },
})

const chartRef = ref(null)
let chartInstance = null

const PRIMARY_COLOR = '#5E6AD2'

const filteredData = computed(() => {
  if (props.period === '6m') {
    return props.data.slice(-6)
  }
  return props.data.slice(-12)
})

const getOption = () => ({
  grid: {
    left: 40,
    right: 16,
    top: 16,
    bottom: 40,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'hsl(240, 10%, 3.9%)',
    borderColor: 'hsl(240, 3.7%, 15.9%)',
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontFamily: 'Inter, Pretendard, sans-serif',
    },
    formatter: (params) => {
      const p = params[0]
      return `<div style="font-size:11px;color:#999">${p.name}</div><div style="font-weight:600">${p.value}건</div>`
    },
  },
  xAxis: {
    type: 'category',
    data: filteredData.value.map((d) => d.month),
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#999',
      fontSize: 11,
      fontFamily: 'Inter, Pretendard, sans-serif',
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: { color: 'hsl(240, 5.9%, 90%)', type: 'dashed' },
    },
    axisLabel: {
      color: '#999',
      fontSize: 11,
    },
  },
  dataZoom: [{
    type: 'inside',
    zoomOnMouseWheel: true,
    moveOnMouseMove: true,
  }],
  series: [{
    type: 'line',
    data: filteredData.value.map((d) => d.count),
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      color: PRIMARY_COLOR,
      width: 2,
    },
    itemStyle: {
      color: PRIMARY_COLOR,
      borderWidth: 2,
      borderColor: '#fff',
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: `${PRIMARY_COLOR}30` },
        { offset: 1, color: `${PRIMARY_COLOR}05` },
      ]),
    },
  }],
})

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getOption())
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(() => [props.data, props.period], () => {
  if (chartInstance) {
    chartInstance.setOption(getOption())
  }
}, { deep: true })

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<template>
  <div ref="chartRef" class="h-full w-full" style="min-height: 280px" />
</template>
