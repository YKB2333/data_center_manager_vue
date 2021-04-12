<template>
  <el-select v-bind="$attrs" v-on="$listeners">
    <el-option  
      v-for="item in options" 
      :key="item.code"
      :label="item.name"
      :value="item.code"
    />
  </el-select>
</template>

<script>
import { getChannelList } from '@/api/backstage/department-channel-sale-target'

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
      const { result: channelList } = await getChannelList()
      this.options = channelList || []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>