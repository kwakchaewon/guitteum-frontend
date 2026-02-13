<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, MapPin, FileText } from 'lucide-vue-next'
import { useSpeechStore } from '@/stores/speechStore'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const route = useRoute()
const router = useRouter()
const speechStore = useSpeechStore()

const speech = computed(() => speechStore.currentSpeech)
const loading = computed(() => speechStore.loading)
const error = computed(() => speechStore.error)

onMounted(() => {
  speechStore.fetchSpeechById(route.params.id)
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

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-8 md:px-6">
    <!-- Back Button -->
    <Button
      variant="ghost"
      size="sm"
      class="mb-6 gap-1 text-muted-foreground"
      @click="goBack"
    >
      <ArrowLeft :size="16" />
      뒤로가기
    </Button>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <Skeleton class="h-10 w-3/4" />
      <Skeleton class="h-5 w-1/3" />
      <Skeleton class="mt-6 h-[400px] w-full rounded-lg" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
      <FileText :size="48" class="mb-4 text-muted-foreground/50" />
      <p class="mb-1 text-sm font-medium">연설문을 불러올 수 없습니다</p>
      <p class="text-xs text-muted-foreground">{{ error }}</p>
    </div>

    <!-- Content -->
    <article v-else-if="speech">
      <!-- Title & Meta -->
      <header class="mb-8">
        <h1 class="mb-3 text-2xl font-semibold tracking-tight md:text-3xl">
          {{ speech.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span v-if="speech.speechDate" class="inline-flex items-center gap-1.5">
            <Calendar :size="14" />
            {{ formatDate(speech.speechDate) }}
          </span>
          <span v-if="speech.eventName" class="inline-flex items-center gap-1.5">
            <MapPin :size="14" />
            {{ speech.eventName }}
          </span>
        </div>
      </header>

      <!-- Speech Content -->
      <Card>
        <CardContent class="p-6 md:p-8">
          <div class="whitespace-pre-wrap text-sm leading-7 text-foreground/90 md:text-base md:leading-8">{{ speech.content }}</div>
        </CardContent>
      </Card>
    </article>
  </div>
</template>
