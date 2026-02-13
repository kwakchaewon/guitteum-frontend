<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import LoadingBar from '@/components/layout/LoadingBar.vue'
import { Toaster } from '@/components/ui/toast'
import { isGlobalLoading } from '@/api/axios'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <LoadingBar :loading="isGlobalLoading" />
    <AppHeader />
    <main>
      <RouterView />
    </main>
    <Toaster />
  </div>
</template>
