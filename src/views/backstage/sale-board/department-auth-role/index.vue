<template>
  <div>
     <div class="mb10">
        <el-button type="primary" v-permissionButton="'onAdd'" @click="onAdd">新增</el-button>
     </div>
     <div>
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        class="table-center"
      >
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column label="事业部" prop="businessName" width="200" >
          <template slot-scope="scope">
            <el-select v-model="scope.row.businessId" :disabled="!isEdit">
              <el-option  
                v-for="item in businessList" 
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="角色编码" prop="roleCode" width="500"></el-table-column>        
        <el-table-column label="操作"  width="200">
          <template slot-scope="scope">
            <el-button type="primary" class="mr10"  v-permissionButton="'onEdit'" @click="onEdit(scope.row)">修改</el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="onDelete(scope.row)"
            >
              <el-button slot="reference" v-permissionButton="'onDelete'" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <add-edit 
        :visible.sync="dialogVisible"
        :dialog-type="dialogType"
        dialog-title="事业部品牌销售目标"
        :dialog-data="dialogData"
        :dialog-list="businessList"
        width="800px"
        @success="addEditSuccess"
    />
    </div>
  </div>
</template>

<script>
import { getBusinessList } from '@/api/backstage/department'
import { 
  getBusinessRole 
} from '@/api/backstage/department-auth-role'
import { 
  deleteBusinessRole
} from '@/api/backstage/department-auth-role'
import AddEdit from './add-edit'
export default {
  data() {
    return {
      tableData: [],
      loading: false,
      isEdit:false,
      businessList: [], // 事业部列表
      dialogType: 'add',
      dialogVisible: false,
      dialogData: {}
    }
  },
  components:{
    AddEdit
  },

  computed: {
    
  },

  created() {
     this.init()
  },

  methods: {

    async init() {
      const { result: businessList } = await getBusinessList()
      this.businessList = businessList || []
      if (this.businessList.length === 0) return
      this.fetchTableData()
    },

    fetchTableData() {
      this.loading = true
      getBusinessRole().then(({ result }) => {
        this.tableData = result || []
      }).finally(() => {
        this.loading = false
      })
    },

    onAdd() {
      this.dialogData = {}
      this.dialogType = 'add'
      this.dialogVisible = true
    },

    // 修改事件
    onEdit(item) {
      this.dialogType = 'edit'
      this.dialogData = _.cloneDeep(item)
      this.dialogVisible = true
    },

     addEditSuccess() {
      this.fetchTableData()
    },

     // 删除操作
    onDelete(item) {
      this.loadingBtn = 'delete'
      deleteBusinessRole(item.id).then(({ message }) => {
        this.$message.success(message)
        this.fetchTableData()
      }).finally(() => {
        this.loadingBtn = ''
      })
    }
  }
}
</script>
