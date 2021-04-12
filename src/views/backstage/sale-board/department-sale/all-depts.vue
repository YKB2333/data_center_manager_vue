<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" custom-class="custom-dialog-class">
    <el-table :data="tableData" border stripe>
      <el-table-column prop="name" label="事业部名称"></el-table-column>
      <el-table-column label="部门名称">
        <template slot-scope="scope">
          <div v-for="item in scope.row.depts" :key="item.id">
            <span>{{ item.bmname }}</span>
            <span v-if="item.zzname">（{{ item.zzname }}）</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>

export default {
  inheritAttrs: false,

  components: {},

  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {
      tableData: []
    }
  },

  computed: {},

  created() {},

  methods: {
    onOpen() {
      this.tableData = [this.data]
    },

    onClose() {},

    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>