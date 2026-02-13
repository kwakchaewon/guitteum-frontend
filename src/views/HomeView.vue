<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Send, FileText, Hash, MessageSquare, Clock, ArrowRight } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useStatsStore } from '@/stores/statsStore'
import { useSpeechStore } from '@/stores/speechStore'
import StatCard from '@/components/dashboard/StatCard.vue'
import WordCloud from '@/components/dashboard/WordCloud.vue'
import LineChart from '@/components/dashboard/LineChart.vue'
import PieChart from '@/components/dashboard/PieChart.vue'

const router = useRouter()
const statsStore = useStatsStore()
const speechStore = useSpeechStore()

const heroQuery = ref('')
const linePeriod = ref('1y')

const summary = computed(() => statsStore.summary)

const handleHeroSearch = () => {
  const q = heroQuery.value.trim()
  if (!q) return
  router.push({ name: 'chat', query: { q } })
}

const handleKeywordClick = (keyword) => {
  router.push({ name: 'search', query: { q: keyword } })
}

const handleCategoryClick = (category) => {
  router.push({ name: 'search', query: { category } })
}

onMounted(() => {
  statsStore.fetchAll()
  speechStore.fetchSpeeches({ size: 5 })
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-8 md:px-6">
    <!-- Hero Section -->
    <section class="mb-10 text-center">
      <h1 class="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
        AI 기반 연설문 분석 플랫폼
      </h1>
      <p class="mx-auto mb-6 max-w-xl text-sm text-muted-foreground">
        대통령 연설문을 분석하여 정책 질의응답, 키워드 트렌드, 통계를 제공합니다.
      </p>

      <!-- AI 질문 입력창 -->
      <div class="mx-auto max-w-xl">
        <div class="relative">
          <input
            v-model="heroQuery"
            type="text"
            placeholder="연설문에 대해 질문해 보세요..."
            class="h-12 w-full rounded-xl border border-border bg-card pl-4 pr-12 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            @keydown.enter="handleHeroSearch"
          />
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            @click="handleHeroSearch"
          >
            <Send :size="16" />
          </button>
        </div>
      </div>
    </section>

    <!-- 통계 요약 카드 -->
    <section class="mb-8">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <template v-if="statsStore.loading">
          <Skeleton v-for="i in 4" :key="i" class="h-28 rounded-xl" />
        </template>
        <template v-else>
          <StatCard
            title="총 연설문"
            :value="summary?.totalSpeechCount ?? '-'"
            :icon="FileText"
            suffix="건"
          />
          <StatCard
            title="주요 키워드"
            :value="summary?.totalKeywordCount ?? '-'"
            :icon="Hash"
            suffix="개"
          />
          <StatCard
            title="AI 질문 수"
            :value="summary?.totalChatQuestions ?? '-'"
            :icon="MessageSquare"
            suffix="회"
          />
          <StatCard
            title="평균 응답"
            :value="summary?.averageResponseTime ? summary.averageResponseTime.toFixed(1) : '-'"
            :icon="Clock"
            suffix="초"
          />
        </template>
      </div>
    </section>

    <!-- 차트 그리드 -->
    <section class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      <!-- 워드클라우드 -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-semibold">TOP 키워드</CardTitle>
        </CardHeader>
        <CardContent>
          <template v-if="statsStore.loading">
            <Skeleton class="h-[280px] w-full rounded-lg" />
          </template>
          <WordCloud
            v-else
            :data="statsStore.topKeywords"
            @keyword-click="handleKeywordClick"
          />
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
            <Skeleton class="h-[280px] w-full rounded-lg" />
          </template>
          <LineChart v-else :data="statsStore.monthlyData" :period="linePeriod" />
        </CardContent>
      </Card>

      <!-- 카테고리 분포 -->
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm font-semibold">카테고리 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <template v-if="statsStore.loading">
            <Skeleton class="h-[280px] w-full rounded-lg" />
          </template>
          <PieChart v-else :data="statsStore.categoryData" @category-click="handleCategoryClick" />
        </CardContent>
      </Card>

      <!-- 최근 연설문 -->
      <Card>
        <CardHeader class="flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-semibold">최근 연설문</CardTitle>
          <RouterLink to="/search">
            <Button variant="ghost" size="sm" class="h-7 gap-1 text-xs text-muted-foreground">
              전체 보기
              <ArrowRight :size="12" />
            </Button>
          </RouterLink>
        </CardHeader>
        <CardContent>
          <template v-if="speechStore.loading">
            <div class="space-y-3">
              <Skeleton v-for="i in 5" :key="i" class="h-14 w-full" />
            </div>
          </template>
          <div v-else class="space-y-1">
            <RouterLink
              v-for="speech in speechStore.speeches.slice(0, 5)"
              :key="speech.id"
              :to="`/speeches/${speech.id}`"
              class="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <FileText :size="14" class="mt-0.5 shrink-0 text-muted-foreground" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">{{ speech.title }}</p>
                <p class="text-xs text-muted-foreground">{{ formatDate(speech.speechDate) }}</p>
              </div>
            </RouterLink>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
