<script setup>
import { ref, watch } from 'vue'
import { Filter, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const props = defineProps({
  dateFrom: {
    type: String,
    default: '',
  },
  dateTo: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:dateFrom', 'update:dateTo', 'update:category', 'filter'])

const isOpen = ref(false)

const categories = [
  { value: '', label: '전체' },
  { value: 'ECONOMY', label: '경제' },
  { value: 'FOREIGN', label: '외교' },
  { value: 'WELFARE', label: '민생/복지' },
  { value: 'DEFENSE', label: '안보/국방' },
  { value: 'ENVIRONMENT', label: '환경' },
  { value: 'ETC', label: '기타' },
]

const selectCategory = (value) => {
  emit('update:category', value)
  emit('filter')
}

const handleDateChange = (field, value) => {
  emit(`update:${field}`, value)
  emit('filter')
}

const toggleFilter = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <!-- Mobile: Toggle Button -->
    <Button
      variant="outline"
      size="sm"
      class="mb-3 gap-1.5 md:hidden"
      @click="toggleFilter"
    >
      <Filter :size="14" />
      필터
      <ChevronUp v-if="isOpen" :size="14" />
      <ChevronDown v-else :size="14" />
    </Button>

    <!-- Filter Content -->
    <div
      class="space-y-4"
      :class="{ 'hidden md:block': !isOpen }"
    >
      <!-- Category Filter -->
      <div>
        <p class="mb-2 text-xs font-medium text-muted-foreground">카테고리</p>
        <div class="flex flex-wrap gap-2 overflow-x-auto md:flex-wrap">
          <Badge
            v-for="cat in categories"
            :key="cat.value"
            :variant="category === cat.value ? 'default' : 'outline'"
            class="cursor-pointer whitespace-nowrap transition-colors"
            @click="selectCategory(cat.value)"
          >
            {{ cat.label }}
          </Badge>
        </div>
      </div>

      <!-- Date Range Filter -->
      <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        <div class="flex-1">
          <label class="mb-1 block text-xs font-medium text-muted-foreground">시작일</label>
          <Input
            type="date"
            :model-value="dateFrom"
            class="h-9 text-sm"
            @update:model-value="(val) => handleDateChange('dateFrom', val)"
          />
        </div>
        <span class="hidden text-muted-foreground sm:block">~</span>
        <div class="flex-1">
          <label class="mb-1 block text-xs font-medium text-muted-foreground">종료일</label>
          <Input
            type="date"
            :model-value="dateTo"
            class="h-9 text-sm"
            @update:model-value="(val) => handleDateChange('dateTo', val)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
