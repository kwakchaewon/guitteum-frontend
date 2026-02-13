<script setup>
import { Badge } from '@/components/ui/badge'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const CATEGORIES = [
  { value: '', label: '전체' },
  { value: 'ECONOMY', label: '경제' },
  { value: 'FOREIGN', label: '외교' },
  { value: 'WELFARE', label: '민생/복지' },
  { value: 'DEFENSE', label: '안보/국방' },
  { value: 'ENVIRONMENT', label: '환경' },
  { value: 'ETC', label: '기타' },
]

const select = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex gap-1.5 overflow-x-auto scrollbar-hide md:flex-wrap md:overflow-visible">
    <Badge
      v-for="cat in CATEGORIES"
      :key="cat.value"
      :variant="modelValue === cat.value ? 'default' : 'outline'"
      class="shrink-0 cursor-pointer whitespace-nowrap transition-colors"
      @click="select(cat.value)"
    >
      {{ cat.label }}
    </Badge>
  </div>
</template>
