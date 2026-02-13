<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MessageSquare, Search, BarChart3, Home, Menu, X } from 'lucide-vue-next'
import MobileMenu from './MobileMenu.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navItems = [
  { name: '홈', path: '/', icon: Home },
  { name: '챗봇', path: '/chat', icon: MessageSquare },
  { name: '검색', path: '/search', icon: Search },
  { name: '통계', path: '/stats', icon: BarChart3 },
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="mx-auto flex h-14 max-w-screen-xl items-center px-4 md:px-6">
      <!-- Logo -->
      <RouterLink to="/" class="mr-6 flex items-center space-x-2">
        <span class="text-lg font-semibold tracking-tight text-primary">귀띔</span>
      </RouterLink>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex md:items-center md:space-x-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          :class="isActive(item.path) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
        >
          <component :is="item.icon" :size="16" />
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="flex-1" />

      <!-- Mobile Menu Button -->
      <button
        class="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
        @click="toggleMobileMenu"
      >
        <X v-if="isMobileMenuOpen" :size="20" />
        <Menu v-else :size="20" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <MobileMenu
      :is-open="isMobileMenuOpen"
      :nav-items="navItems"
      :is-active="isActive"
      @close="closeMobileMenu"
    />
  </header>
</template>
