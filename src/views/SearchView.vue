<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, FileText } from 'lucide-vue-next'
import { searchSpeeches } from '@/api/searchApi'
import { getSpeeches } from '@/api/speechApi'
import SearchBar from '@/components/search/SearchBar.vue'
import SearchFilter from '@/components/search/SearchFilter.vue'
import SearchResult from '@/components/search/SearchResult.vue'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

const route = useRoute()
const router = useRouter()

const query = ref(route.query.q || '')
const category = ref(route.query.category || '')
const dateFrom = ref(route.query.dateFrom || '')
const dateTo = ref(route.query.dateTo || '')
const currentPage = ref(Number(route.query.page) || 0)

const results = ref([])
const totalPages = ref(0)
const totalElements = ref(0)
const loading = ref(false)
const hasSearched = ref(false)

const PAGE_SIZE = 10

const fetchResults = async () => {
  loading.value = true
  hasSearched.value = true
  try {
    const params = {
      page: currentPage.value,
      size: PAGE_SIZE,
    }

    if (query.value) params.query = query.value
    if (category.value) params.category = category.value
    if (dateFrom.value) params.dateFrom = dateFrom.value
    if (dateTo.value) params.dateTo = dateTo.value

    // 검색어가 있으면 search API, 없으면 목록 API 사용
    const { data } = query.value
      ? await searchSpeeches(params)
      : await getSpeeches(params)

    results.value = data.content || []
    totalPages.value = data.totalPages || 0
    totalElements.value = data.totalElements || 0
  } catch (err) {
    console.error('[Search] fetch error:', err)
    results.value = []
    totalPages.value = 0
    totalElements.value = 0
  } finally {
    loading.value = false
  }
}

const updateQueryParams = () => {
  const queryParams = {}
  if (query.value) queryParams.q = query.value
  if (category.value) queryParams.category = category.value
  if (dateFrom.value) queryParams.dateFrom = dateFrom.value
  if (dateTo.value) queryParams.dateTo = dateTo.value
  if (currentPage.value > 0) queryParams.page = currentPage.value

  router.replace({ query: queryParams })
}

const handleSearch = () => {
  currentPage.value = 0
  updateQueryParams()
  fetchResults()
}

const handleFilter = () => {
  currentPage.value = 0
  updateQueryParams()
  fetchResults()
}

const handlePageChange = (page) => {
  currentPage.value = page
  updateQueryParams()
  fetchResults()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 초기 로드
fetchResults()
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-8 md:px-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="mb-1 text-2xl font-semibold tracking-tight md:text-3xl">연설문 검색</h1>
      <p class="text-sm text-muted-foreground">키워드로 연설문을 검색하세요.</p>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <SearchBar
        v-model="query"
        @search="handleSearch"
      />
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <SearchFilter
        v-model:date-from="dateFrom"
        v-model:date-to="dateTo"
        v-model:category="category"
        @filter="handleFilter"
      />
    </div>

    <!-- Results Count -->
    <div v-if="hasSearched && !loading" class="mb-4">
      <p class="text-sm text-muted-foreground">
        총 <span class="font-medium text-foreground">{{ totalElements }}</span>건의 연설문
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-3">
      <Skeleton v-for="i in 5" :key="i" class="h-20 w-full rounded-lg" />
    </div>

    <!-- Results -->
    <div v-else-if="results.length > 0" class="space-y-3">
      <SearchResult
        v-for="speech in results"
        :key="speech.id"
        :speech="speech"
        :query="query"
      />

      <!-- Pagination -->
      <div class="pt-6">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:current-page="handlePageChange"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="hasSearched" class="flex flex-col items-center justify-center py-16">
      <Search :size="48" class="mb-4 text-muted-foreground/50" />
      <p class="mb-1 text-sm font-medium">검색 결과가 없습니다</p>
      <p class="text-xs text-muted-foreground">다른 키워드로 검색해 보세요.</p>
    </div>

    <!-- Initial State -->
    <div v-else class="flex flex-col items-center justify-center py-16">
      <FileText :size="48" class="mb-4 text-muted-foreground/50" />
      <p class="text-sm text-muted-foreground">검색어를 입력하거나 필터를 적용하세요.</p>
    </div>
  </div>
</template>
