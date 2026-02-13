<script setup>
import { RouterLink } from 'vue-router'
import { Calendar, MapPin } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CATEGORY_LABELS = {
  ECONOMY: '경제',
  FOREIGN: '외교',
  WELFARE: '민생/복지',
  DEFENSE: '안보/국방',
  ENVIRONMENT: '환경',
  ETC: '기타',
}

const props = defineProps({
  speech: {
    type: Object,
    required: true,
  },
  query: {
    type: String,
    default: '',
  },
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
  <RouterLink :to="`/speeches/${speech.id}`">
    <Card class="border border-border transition-colors hover:border-primary/30 hover:bg-surface/50">
      <CardContent class="p-4 md:p-5">
        <h3 class="mb-2 text-sm font-semibold leading-snug tracking-tight md:text-base">
          {{ speech.title }}
        </h3>

        <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span v-if="speech.speechDate" class="inline-flex items-center gap-1">
            <Calendar :size="12" />
            {{ formatDate(speech.speechDate) }}
          </span>
          <span v-if="speech.eventName" class="inline-flex items-center gap-1">
            <MapPin :size="12" />
            {{ speech.eventName }}
          </span>
          <Badge v-if="speech.category" variant="secondary" class="text-[10px] px-1.5 py-0">
            {{ CATEGORY_LABELS[speech.category] || speech.category }}
          </Badge>
        </div>
      </CardContent>
    </Card>
  </RouterLink>
</template>
