<template>
  <section class="app-main">
    <keep-alive v-if="enableCache" :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
    <router-view v-else />
  </section>
</template>

<script>
import { enableCache } from '@/config'

export default {
  name: 'AppMain',
  data() {
    return {
      enableCache
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

