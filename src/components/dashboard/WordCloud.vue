<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import 'echarts-wordcloud'

echarts.use([CanvasRenderer])

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['keyword-click'])

const chartRef = ref(null)
let chartInstance = null

const PRIMARY_COLOR = '#5E6AD2'

const getOption = () => ({
  series: [{
    type: 'wordCloud',
    shape: 'circle',
    gridSize: 8,
    sizeRange: [14, 48],
    rotationRange: [-30, 30],
    rotationStep: 15,
    textStyle: {
      fontFamily: 'Inter, Pretendard, sans-serif',
      fontWeight: '600',
      color: () => {
        const hue = 235
        const saturation = 30 + Math.random() * 30
        const lightness = 40 + Math.random() * 25
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`
      },
    },
    emphasis: {
      textStyle: {
        color: PRIMARY_COLOR,
      },
    },
    data: props.data.map((item) => ({
      name: item.word,
      value: item.frequency,
    })),
  }],
})

const initChart = () => {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(getOption())
  chartInstance.on('click', (params) => {
    emit('keyword-click', params.name)
  })
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
