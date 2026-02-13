<script setup>
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: Object,
    default: null,
  },
  trend: {
    type: Number,
    default: null,
  },
  suffix: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
    <div class="mb-3 flex items-center justify-between">
      <span class="text-xs font-medium text-muted-foreground">{{ title }}</span>
      <component
        :is="icon"
        v-if="icon"
        :size="16"
        class="text-muted-foreground/50"
      />
    </div>
    <div class="flex items-end gap-2">
      <span class="text-2xl font-semibold tracking-tight">{{ value }}</span>
      <span v-if="suffix" class="mb-0.5 text-sm text-muted-foreground">{{ suffix }}</span>
    </div>
    <div v-if="trend !== null" class="mt-2 flex items-center gap-1">
      <TrendingUp v-if="trend >= 0" :size="12" class="text-emerald-500" />
      <TrendingDown v-else :size="12" class="text-red-500" />
      <span
        class="text-xs font-medium"
        :class="trend >= 0 ? 'text-emerald-500' : 'text-red-500'"
      >
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </span>
      <span class="text-xs text-muted-foreground">전월 대비</span>
    </div>
  </div>
</template>
