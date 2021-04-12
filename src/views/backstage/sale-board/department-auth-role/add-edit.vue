<template>
  <div>
    <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" :title="title">
      <el-form ref="form" :model="formData" :rules="rules" inline>        
        <div>
          <el-table
            :data="[1]"
            border
            class="table-center"
          >
           <el-table-column label="事业部名称">
              <!-- <business-select
                v-if="$attrs.visible"
                v-model="formData.businessId"
                :disabled="dialogType === 'edit'"
              /> -->
            <el-select v-model="formData.businessId"  :disabled="dialogType === 'edit'">
              <el-option  
                v-for="item in businessList" 
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
           </el-table-column>
            <el-table-column label="角色编码">
              <template>
                <el-form-item prop="roleCode">
                  <el-input v-model="formData.roleCode"></el-input>
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
  </div>
</template>

<script>
import BusinessSelect from '@/components/business-select'
import { 
  addBusinessRole,
  updateBusinessRole
} from '@/api/backstage/department-auth-role'
export default {
  inheritAttrs: false,

  components: {
    BusinessSelect,
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
    },
    dialogList: {
      type: Array
    }
  },

  data() {
    return {
      formData: {
        id: '',
        businessId: '', // 事业部id
        roleCode: '' // 角色编码        
      },
      businessList:[],
      rules: {
        businessId: [
          {required: true, message: '事业部不能为空', trigger: 'change'}
        ],
        roleCode: [
          {required: true, message: '角色编码不能为空', trigger: 'change'}
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
      this.businessList = this.dialogList
      let data = this.dialogData
      if (this.dialogType === 'edit') {
        this.formData = data
      } else {
        this.formData.businessId = data.businessId
        this.formData.roleCode = data.roleCode
      }
    },

    onClose() {
      this.$refs['form'].resetFields()
    },

    close() {
      this.$emit('update:visible', false)
    },

    handelConfirm() {
      if(!this.formData.businessId){
        this.$message.warning("请选择事业部")
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          const http = {
            'add': addBusinessRole,
            'edit': updateBusinessRole
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