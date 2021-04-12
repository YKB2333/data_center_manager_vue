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
import { getBusinessList } from '@/api/backstage/department'

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
      const { result: businessList } = await getBusinessList()
      this.options = businessList || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>