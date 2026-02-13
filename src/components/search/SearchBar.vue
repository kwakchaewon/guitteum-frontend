<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { Search, X } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  debounceMs: {
    type: Number,
    default: 400,
  },
})

const emit = defineEmits(['update:modelValue', 'search'])

const query = ref(props.modelValue)
let debounceTimer = null

watch(() => props.modelValue, (val) => {
  query.value = val
})

const clearDebounce = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

const handleInput = (val) => {
  query.value = val
  emit('update:modelValue', val)

  clearDebounce()
  debounceTimer = setTimeout(() => {
    emit('search', query.value)
  }, props.debounceMs)
}

const handleSearch = () => {
  clearDebounce()
  emit('search', query.value)
}

const handleClear = () => {
  clearDebounce()
  query.value = ''
  emit('update:modelValue', '')
  emit('search', '')
}

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

onUnmounted(() => {
  clearDebounce()
})
</script>

<template>
  <div class="relative w-full">
    <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <Input
      :model-value="query"
      type="text"
      placeholder="연설문 키워드를 검색하세요..."
      class="h-11 pl-10 pr-10"
      @update:model-value="handleInput"
      @keydown="handleKeydown"
    />
    <button
      v-if="query"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      @click="handleClear"
    >
      <X :size="16" />
    </button>
  </div>
</template>
