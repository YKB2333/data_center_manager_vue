<template>
  <el-date-picker
    v-bind="$attrs" v-on="$listeners"
    type="year"
    placeholder="选择年"
    value-format="yyyy"
    :picker-options="datePickerOptions"
    :clearable="false"
    style="width: 120px;"
  />
</template>

<script>
export default {
  props: {
    minYear: {
      type: Number,
      default: 2019
    }
  },

  data() {
    return {
      datePickerOptions: {
        disabledDate: (time) => {
          return time.getFullYear() < this.minYear
        }
      }
    }
  }
}
</script>