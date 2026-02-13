<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { PieChart as EPieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([EPieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const chartRef = ref(null)
let chartInstance = null

const COLORS = ['#5E6AD2', '#7C85E0', '#9BA2EB', '#B9BEF5', '#D8DBFA', '#8B5CF6']

const CATEGORY_LABELS = {
  ECONOMY: '경제',
  FOREIGN: '외교',
  WELFARE: '복지',
  DEFENSE: '국방',
  ENVIRONMENT: '환경',
  ETC: '기타',
}

const getOption = () => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'hsl(240, 10%, 3.9%)',
    borderColor: 'hsl(240, 3.7%, 15.9%)',
    textStyle: {
      color: '#fff',
      fontSize: 12,
      fontFamily: 'Inter, Pretendard, sans-serif',
    },
    formatter: (params) => {
      return `${params.name}: ${params.value}건 (${params.percent}%)`
    },
  },
  legend: {
    orient: 'vertical',
    right: 16,
    top: 'center',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 12,
    textStyle: {
      color: '#999',
      fontSize: 12,
      fontFamily: 'Inter, Pretendard, sans-serif',
    },
  },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['35%', '50%'],
    avoidLabelOverlap: true,
    label: { show: false },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.15)',
      },
    },
    data: props.data.map((item, i) => ({
      name: CATEGORY_LABELS[item.category] || item.category,
      value: item.count,
      itemStyle: { color: COLORS[i % COLORS.length] },
    })),
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

watch(() => props.data, () => {
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
