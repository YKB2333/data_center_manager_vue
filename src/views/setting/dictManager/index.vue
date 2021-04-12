<template>
  <div>
    <search-table
      v-model="searchQuery"
      :searchForm="searchForm"
      @change="onChange"
    >
      <el-button
        v-permissionButton="'add'"
        type="primary"
        @click="add"
        class="mb20"
        >新增字典</el-button
      >
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
      >
        <el-table-column prop="id" label="编号" width="160"></el-table-column>
        <el-table-column prop="code" label="字典编码(code)"></el-table-column>
        <el-table-column prop="value" label="字典值"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updateDate" label="更新时间" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | formatDate('Y/M/D h:m') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              v-permissionButton="'edit'"
              @click="edit(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              v-permissionButton="'delete'"
              @click="onDelete(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </search-table>

    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="saveForm.id ? '编辑字典' : '添加字典'"
      width="500px"
      max-height
      @close="closeDialog"
    >
      <el-form
        :model="saveForm"
        :rules="rules"
        ref="saveForm"
        :label-width="labelWidth"
        class="mr30"
      >
        <el-form-item label="编号" prop="id">
          <el-input v-model="saveForm.id" :disabled="true" />
        </el-form-item>
        <el-form-item label="字典编码(code)" prop="code">
          <el-input
            v-model="saveForm.code"
            placeholder="请输入字典编码(code)"
          ></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="value">
          <el-input
            type="textarea"
            :rows="3"
            v-model="saveForm.value"
            placeholder="请输入字典值"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            v-model="saveForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
        <el-form-item
          style="display: block; text-align: left; padding-left: 80px"
        >
          <el-button type="primary" :loading="saveBtnLoading" @click="submit"
            >保存</el-button
          >
          <el-button @click="closeDialog()">关闭</el-button>
        </el-form-item>

        <!-- <div slot="footer" class="align-center">
          <el-button type="primary" :loading="saveBtnLoading" @click="submit">保 存</el-button>
          <el-button @click="closeDialog">关 闭</el-button>
        </div>-->
      </el-form>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="delTip" width="30%">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delTip = false">取 消</el-button>
        <el-button type="primary" @click="deleteItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDictionaryList,
  saveDictionary,
  deleteDictionary,
  updateDictionary
} from '@/api/setting/dictionary'
import SearchTable from '@/components/search-table'
export default {
  name: 'Dictionary',
  components: { SearchTable },
  data() {
    return {
      delItem: {},
      delTip: false,
      inputStyle: { width: '220px' },
      labelWidth: '80px',
      saveBtnLoading: false, // 保存按钮的loading状态
      tableLoading: false,
      tableData: [], // 表格数据
      searchForm: [
        {
          label: '字典编码(code)',
          key: 'code',
          placeholder: '请输入字典编码',
          type: 'input'
        },
        {
          label: '字典值',
          key: 'value',
          placeholder: '请输入字典值',
          type: 'input'
        }
      ],
      searchQuery: {
        code: '', //code
        value: '', //标签
        pageIndex: 1,
        pageSize: 10,
        total: 0 // 总条数
      },
      dialogVisible: false,
      saveForm: {},
      rules: {
        code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
        value: [{ required: true, message: '请输入字典值', trigger: 'blur' }]
      }
    }
  },
  async created() {
    await this.fetchTableData()
  },
  methods: {
    // 查询列表
    fetchTableData() {
      this.tableLoading = true
      return getDictionaryList(this.searchQuery)
        .then((res) => {
          let data = res.result
          console.log(res, 'res')
          this.searchQuery.total = parseInt(data.count) // 总条数
          if (this.searchQuery.total > 0) {
            data.list.forEach((r) => {
              r.id += ''
            })
          }
          this.tableData = data.list
          console.log(this.tableData, 'this.tableData')
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    edit(item) {
      this.saveForm = this.deepClone(item)
      this.dialogVisible = true
    },
    onChange() {
      this.fetchTableData()
    },
    closeDialog() {
      this.saveForm = {}
      this.dialogVisible = false
      this.$refs['saveForm'].clearValidate()
    },
    // 保存提交
    submit() {
      if (this.saveForm.id) {
        this.update()
      } else {
        this.save()
      }
    },
    update() {
      this.$refs.saveForm.validate((valid) => {
        if (!valid) return false
        this.saveBtnLoading = true
        updateDictionary(this.saveForm)
          .then((res) => {
            this.$message.success('修改成功')
            this.fetchTableData()
            this.closeDialog()
          })
          .finally(() => {
            this.saveBtnLoading = false
          })
      })
    },
    save() {
      this.$refs.saveForm.validate((valid) => {
        if (!valid) return false
        this.saveBtnLoading = true
        saveDictionary(this.saveForm)
          .then((res) => {
            console.info(res)
            this.$message.success('保存成功')
            this.fetchTableData()
            this.closeDialog()
          })
          .finally(() => {
            this.saveBtnLoading = false
          })
      })
    },

    add() {
      this.saveForm = {}
      this.dialogVisible = true
    },
    onDelete(item) {
      this.delItem = item
      this.delTip = true
    },
    deleteItem() {
      deleteDictionary(this.delItem).then((res) => {
        this.fetchTableData()
        this.$message.success(res.resultMsg)
      })
      this.delTip = false
      this.delItem = {}
    },
    deepClone(source) {
      console.log('type', typeof source)
      if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
      }
      const targetObj = source.constructor === Array ? [] : {}
      Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === 'object') {
          targetObj[keys] = deepClone(source[keys])
        } else {
          targetObj[keys] = source[keys]
        }
      })
      return targetObj
    }
  }
}
</script>
