<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" :title="title" :close-on-click-modal="false">
    <el-form ref="form" :model="formData" :rules="rules" inline>
      <el-form-item label="事业部名称" prop="businessId">
        <business-select
          v-if="$attrs.visible"
          v-model="formData.businessId" 
          :disabled="dialogType === 'edit'"
        />
      </el-form-item>
      <el-form-item label="渠道类型" prop="channelCode">
        <channel-select
          v-if="$attrs.visible"
          v-model="formData.channelCode" 
          :disabled="dialogType === 'edit'"
        />
      </el-form-item>
      <el-form-item label="目标年度" prop="year">
        <year-picker
          v-if="$attrs.visible"
          v-model="formData.year"
          :disabled="dialogType === 'edit'"
        />
      </el-form-item>
      <div>
        <el-table
          :data="[1]"
          border
          class="table-center"
        >
          <el-table-column label="1">
            <template>
              <el-form-item prop="monthSalesTarget1">
                <input-number v-model="formData.monthSalesTarget1"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="2">
            <template>
              <el-form-item prop="monthSalesTarget2">
                <input-number v-model="formData.monthSalesTarget2"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="3">
            <template>
              <el-form-item prop="monthSalesTarget3">
                <input-number v-model="formData.monthSalesTarget3"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="4">
            <template>
              <el-form-item prop="monthSalesTarget4">
                <input-number v-model="formData.monthSalesTarget4"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="5">
            <template>
              <el-form-item prop="monthSalesTarget5">
                <input-number v-model="formData.monthSalesTarget5"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="6">
            <template>
              <el-form-item prop="monthSalesTarget6">
                <input-number v-model="formData.monthSalesTarget6"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="[1]"
          border
          class="table-center"
        >
          <el-table-column label="7">
            <template>
              <el-form-item prop="monthSalesTarget7">
                <input-number v-model="formData.monthSalesTarget7"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="8">
            <template>
              <el-form-item  prop="monthSalesTarget8">
                <input-number v-model="formData.monthSalesTarget8"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="9">
            <template>
              <el-form-item prop="monthSalesTarget9">
                <input-number v-model="formData.monthSalesTarget9"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="10">
            <template>
              <el-form-item prop="monthSalesTarget10">
                <input-number v-model="formData.monthSalesTarget10"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="11">
            <template>
              <el-form-item prop="monthSalesTarget11">
                <input-number v-model="formData.monthSalesTarget11"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="12">
            <template>
              <el-form-item prop="monthSalesTarget12">
                <input-number v-model="formData.monthSalesTarget12"></input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  <div slot="footer">
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="handelConfirm" :loading="loading">确定</el-button>
  </div>
  </el-dialog>
</template>

<script>
import YearPicker from '@/components/year-picker'
import BusinessSelect from '@/components/business-select'
import ChannelSelect from '@/components/channel-select'
import InputNumber from '@/components/input-number'
import { addTarget, updateTarget } from '@/api/backstage/department-channel-sale-target'

export default {
  inheritAttrs: false,

  components: {
    YearPicker,
    BusinessSelect,
    ChannelSelect,
    InputNumber
  },

  props: {
    dialogType: {
      type: String,
      default: 'add'
    },
    dialogTitle: {
      type: String
    },
    dialogData: {
      type: Object
    }
  },

  data() {
    return {
      formData: {
        id: '',
        businessId: '', // 事业部id
        channelCode: '', // 渠道编码
        year: '', // 目标年度
        monthSalesTarget1: '',
        monthSalesTarget2: '',
        monthSalesTarget3: '',
        monthSalesTarget4: '',
        monthSalesTarget5: '',
        monthSalesTarget6: '',
        monthSalesTarget7: '',
        monthSalesTarget8: '',
        monthSalesTarget9: '',
        monthSalesTarget10: '',
        monthSalesTarget11: '',
        monthSalesTarget12: ''
      },
      rules: {
        businessId: [
          {required: true, message: '事业部不能为空', trigger: 'change'}
        ],
        year: [
          {required: true, message: '目标年度不能为空', trigger: 'change'}
        ],
        channelCode: [
          {required: true, message: '渠道类型不能为空', trigger: 'change'}
        ],
        monthSalesTarget1: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget2: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget3: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget4: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget5: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget6: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget7: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget8: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget9: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget10: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget11: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        monthSalesTarget12: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      loading: false
    }
  },

  computed: {
    title({ dialogType, dialogTitle }) {
      const typeText = {
        'add': '新增',
        'edit': '修改'
      }
      return `${typeText[dialogType]}${dialogTitle}`
    }
  },

  created() {},

  methods: {
    onOpen() {
      let data = this.dialogData
      data.year = String(data.year)
      if (this.dialogType === 'edit') {
        this.formData = data
      } else {
        this.formData.businessId = data.businessId
        this.formData.year = data.year
        this.formData.channelCode = data.channelCode
        this.formData.monthSalesTarget1 = ''
        this.formData.monthSalesTarget2 = ''
        this.formData.monthSalesTarget3 = ''
        this.formData.monthSalesTarget4 = ''
        this.formData.monthSalesTarget5 = ''
        this.formData.monthSalesTarget6 = ''
        this.formData.monthSalesTarget7 = ''
        this.formData.monthSalesTarget8 = ''
        this.formData.monthSalesTarget9 = ''
        this.formData.monthSalesTarget10 = ''
        this.formData.monthSalesTarget11 = ''
        this.formData.monthSalesTarget12 = ''
      }
    },

    onClose() {
      this.$refs['form'].resetFields()
    },

    close() {
      this.$emit('update:visible', false)
    },

    handelConfirm() {
      // console.log(this.formData)
      this.$refs['form'].validate(valid => {
        if (valid) {
          const http = {
            'add': addTarget,
            'edit': updateTarget
          }
          this.loading = true
          http[this.dialogType](this.formData).then(({ message }) => {
            this.$message.success(message)
            this.close()
            this.$emit('success')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>