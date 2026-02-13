<script setup>
import { onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { MessageSquare, Search, FileText, ArrowRight } from 'lucide-vue-next'
import { useSpeechStore } from '@/stores/speechStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

const speechStore = useSpeechStore()

const speeches = computed(() => speechStore.speeches)
const loading = computed(() => speechStore.loading)

onMounted(() => {
  speechStore.fetchSpeeches({ size: 10 })
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-8 md:px-6">
    <!-- Hero Section -->
    <section class="mb-12 text-center">
      <h1 class="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
        AI 기반 연설문 분석 플랫폼
      </h1>
      <p class="mx-auto mb-8 max-w-2xl text-sm text-muted-foreground md:text-base">
        대통령 연설문을 수집 · 분석하여 RAG 기반 정책 챗봇, 전문 검색, 키워드 대시보드를 제공합니다.
      </p>

      <!-- Quick Action Cards -->
      <div class="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <RouterLink to="/chat" class="group">
          <Card class="border border-border transition-colors hover:border-primary/30">
            <CardContent class="flex flex-col items-center gap-2 p-6">
              <MessageSquare :size="24" class="text-primary" />
              <span class="text-sm font-medium">AI 챗봇</span>
              <span class="text-xs text-muted-foreground">연설문 기반 질의응답</span>
            </CardContent>
          </Card>
        </RouterLink>

        <RouterLink to="/search" class="group">
          <Card class="border border-border transition-colors hover:border-primary/30">
            <CardContent class="flex flex-col items-center gap-2 p-6">
              <Search :size="24" class="text-primary" />
              <span class="text-sm font-medium">연설문 검색</span>
              <span class="text-xs text-muted-foreground">키워드 전문 검색</span>
            </CardContent>
          </Card>
        </RouterLink>

        <RouterLink to="/stats" class="group">
          <Card class="border border-border transition-colors hover:border-primary/30">
            <CardContent class="flex flex-col items-center gap-2 p-6">
              <FileText :size="24" class="text-primary" />
              <span class="text-sm font-medium">통계 대시보드</span>
              <span class="text-xs text-muted-foreground">키워드 트렌드 분석</span>
            </CardContent>
          </Card>
        </RouterLink>
      </div>
    </section>

    <!-- Speeches Table Section -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-semibold tracking-tight">최근 연설문</h2>
        <RouterLink to="/search">
          <Button variant="ghost" size="sm" class="gap-1 text-muted-foreground">
            전체 보기
            <ArrowRight :size="14" />
          </Button>
        </RouterLink>
      </div>

      <!-- Loading Skeleton -->
      <Card v-if="loading">
        <CardContent class="p-0">
          <div class="space-y-4 p-6">
            <Skeleton v-for="i in 5" :key="i" class="h-12 w-full" />
          </div>
        </CardContent>
      </Card>

      <!-- Speeches Table -->
      <Card v-else-if="speeches.length > 0">
        <CardContent class="p-0">
          <!-- Mobile: Card List -->
          <div class="space-y-3 p-4 md:hidden">
            <RouterLink
              v-for="speech in speeches"
              :key="speech.id"
              :to="`/speeches/${speech.id}`"
              class="block rounded-lg border border-border p-4 transition-colors hover:border-primary/30 hover:bg-surface/50"
            >
              <div class="mb-2 flex items-start justify-between gap-2">
                <h3 class="text-sm font-medium leading-snug">{{ speech.title }}</h3>
                <Badge v-if="speech.category" variant="secondary" class="shrink-0 text-xs">
                  {{ speech.category }}
                </Badge>
              </div>
              <p class="text-xs text-muted-foreground">{{ formatDate(speech.date) }}</p>
            </RouterLink>
          </div>

          <!-- Desktop: Table -->
          <div class="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead class="w-[120px]">카테고리</TableHead>
                  <TableHead class="w-[140px]">날짜</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="speech in speeches" :key="speech.id">
                  <TableCell>
                    <RouterLink
                      :to="`/speeches/${speech.id}`"
                      class="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {{ speech.title }}
                    </RouterLink>
                  </TableCell>
                  <TableCell>
                    <Badge v-if="speech.category" variant="secondary">
                      {{ speech.category }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-muted-foreground">
                    {{ formatDate(speech.date) }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <!-- Empty State -->
      <Card v-else>
        <CardContent class="flex flex-col items-center justify-center py-12">
          <FileText :size="48" class="mb-4 text-muted-foreground/50" />
          <p class="text-sm text-muted-foreground">아직 등록된 연설문이 없습니다.</p>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
