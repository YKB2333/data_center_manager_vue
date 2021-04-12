<template>
  <el-select v-bind="$attrs" v-on="$listeners">
    <el-option  
      v-for="item in options" 
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { getBrandList } from '@/api/backstage/department-brand-sale-target'

export default {
  inheritAttrs: false,

  data() {
    return {
      options: []
    }
  },

  computed: {},

  created() {
    this.init()
  },

  methods: {
    async init() {
      const { result: brandList } = await getBrandList()
      this.options = brandList || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>