<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useStatsStore } from '@/stores/statsStore'
import WordCloud from '@/components/dashboard/WordCloud.vue'
import LineChart from '@/components/dashboard/LineChart.vue'
import PieChart from '@/components/dashboard/PieChart.vue'

const router = useRouter()
const statsStore = useStatsStore()

const linePeriod = ref('1y')

const handleKeywordClick = (keyword) => {
  router.push({ name: 'search', query: { q: keyword } })
}

onMounted(() => {
  statsStore.fetchAll()
})
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-8 md:px-6">
    <h1 class="mb-6 text-xl font-semibold tracking-tight">통계 대시보드</h1>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- 워드클라우드 -->
      <Card class="md:col-span-2">
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-semibold">TOP 20 키워드</CardTitle>
        </CardHeader>
        <CardContent>
          <template v-if="statsStore.loading">
            <Skeleton class="h-[320px] w-full rounded-lg" />
          </template>
          <div v-else style="height: 320px">
            <WordCloud
              :data="statsStore.topKeywords"
              @keyword-click="handleKeywordClick"
            />
          </div>
        </CardContent>
      </Card>

      <!-- 월별 연설 추이 -->
      <Card>
        <CardHeader class="flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-semibold">월별 연설문 추이</CardTitle>
          <div class="flex gap-1">
            <button
              class="rounded-md px-2 py-1 text-xs transition-colors"
              :class="linePeriod === '6m' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'"
              @click="linePeriod = '6m'"
            >
              6개월
            </button>
            <button
              class="rounded-md px-2 py-1 text-xs transition-colors"
              :class="linePeriod === '1y' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'"
              @click="linePeriod = '1y'"
            >
              1년
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <template v-if="statsStore.loading">
            <Skeleton class="h-[300px] w-full rounded-lg" />
          </template>
          <LineChart v-else :data="statsStore.monthlyData" :period="linePeriod" />
        </CardContent>
      </Card>

      <!-- 카테고리 분포 -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-semibold">카테고리별 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <template v-if="statsStore.loading">
            <Skeleton class="h-[300px] w-full rounded-lg" />
          </template>
          <PieChart v-else :data="statsStore.categoryData" />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
