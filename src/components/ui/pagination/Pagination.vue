<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  siblingCount: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['update:currentPage'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const siblings = props.siblingCount

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i)
  }

  const start = Math.max(0, current - siblings)
  const end = Math.min(total - 1, current + siblings)

  const result = []

  if (start > 1) {
    result.push(0, '...')
  } else if (start === 1) {
    result.push(0)
  }

  for (let i = start; i <= end; i++) {
    result.push(i)
  }

  if (end < total - 2) {
    result.push('...', total - 1)
  } else if (end === total - 2) {
    result.push(total - 1)
  }

  return result
})

const goToPage = (page) => {
  if (page >= 0 && page < props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1">
    <Button
      variant="outline"
      size="icon"
      class="h-9 w-9"
      :disabled="currentPage === 0"
      @click="goToPage(currentPage - 1)"
    >
      <ChevronLeft :size="16" />
    </Button>

    <template v-for="(page, idx) in pages" :key="idx">
      <span v-if="page === '...'" class="px-2 text-sm text-muted-foreground">...</span>
      <Button
        v-else
        :variant="page === currentPage ? 'default' : 'outline'"
        size="icon"
        class="h-9 w-9 text-sm"
        @click="goToPage(page)"
      >
        {{ page + 1 }}
      </Button>
    </template>

    <Button
      variant="outline"
      size="icon"
      class="h-9 w-9"
      :disabled="currentPage === totalPages - 1"
      @click="goToPage(currentPage + 1)"
    >
      <ChevronRight :size="16" />
    </Button>
  </nav>
</template>
