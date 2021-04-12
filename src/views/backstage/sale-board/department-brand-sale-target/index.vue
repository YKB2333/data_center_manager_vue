<template>
  <div>
    <el-form :model="query" inline>
      <el-form-item label="事业部名称">
        <el-select v-model="query.businessId">
          <el-option  
            v-for="item in businessList" 
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="核心品牌">
        <el-select v-model="query.brandId" filterable>
          <el-option  
            v-for="item in brandList" 
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="目标年度">
        <year-picker
          v-model="query.year"
        />
      </el-form-item>
    </el-form>
    <div class="mb6">
      <el-button type="danger" @click="delBatch" v-permission-button="'delete'">删除</el-button>
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button type="primary" @click="onAdd" v-permission-button="'add'">新增</el-button>
      <el-button type="primary" @click="onImport" v-permission-button="'import'">导入目标</el-button>
      <export-file-button
        file-name="事业部品牌销售目标导入模板.xlsx"
        :api="downLoadTemplate"
        :icon="false"
        :full-loading="false"
        v-permission-button="'downloadImportTemplate'"
      >下载导入模版</export-file-button>
    </div>
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      border
      v-loading="loading"
      class="table-center"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="businessId" label="事业部ID" width="90"></el-table-column>
      <el-table-column label="事业部" prop="businessName" width="180"></el-table-column>
      <el-table-column label="品牌名称" prop="brandName" width="120"></el-table-column>
      <el-table-column label="目标年度" prop="year" width="80"></el-table-column>
      <el-table-column label="年度目标" prop="monthSaleTargetTotal" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.monthSaleTargetTotal | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="1" prop="monthSalesTarget1">
        <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget1 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="2" prop="monthSalesTarget2">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget2 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="3" prop="monthSalesTarget3">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget3 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="4" prop="monthSalesTarget4">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget4 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="5" prop="monthSalesTarget5">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget5 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="6" prop="monthSalesTarget6">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget6 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="7" prop="monthSalesTarget7">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget7 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="8" prop="monthSalesTarget8">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget8 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="9" prop="monthSalesTarget9">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget9 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="10" prop="monthSalesTarget10">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget10 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="11" prop="monthSalesTarget11">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget11 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="12" prop="monthSalesTarget12">
          <template slot-scope="scope">
          <span>{{ scope.row.monthSalesTarget12 | formatTargetValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="primary" class="mr10" @click="onEdit(scope.row)" v-permission-button="'edit'">修改</el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="onDelete(scope.row)"
          >
            <!-- <el-button slot="reference" type="danger" v-permission-button="'delete'">删除</el-button> -->
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <upload-file
      :visible.sync="isShowUpload"
      title="导入事业部品牌销售目标"
      :multiple="false"
      accept=".xls,.xlsx"
      :upload-api="importTemplate"
      @success="importSuccess"
    />
    <add-edit 
      :visible.sync="dialogVisible"
      :dialog-type="dialogType"
      dialog-title="事业部品牌销售目标"
      :dialog-data="dialogData"
      width="800px"
      @success="addEditSuccess"
    />
  </div>
</template>

<script>
import { getBusinessList } from '@/api/backstage/department'
import { 
  getBusinessTargets,
  downLoadTemplate,
  importTemplate,
  deleteTarget,
  deleteBatchTarget,
  getBrandList
} from '@/api/backstage/department-brand-sale-target'
import FileSaver from 'file-saver'
import UploadFile from '@/components/upload-file'
import YearPicker from '@/components/year-picker'
import AddEdit from './add-edit'
import ExportFileButton from "@/components/export-file-button"
import numbro from 'numbro'

export default {
  name: 'DepartmentBrandSaleTarget',

  components: {
    UploadFile,
    YearPicker,
    AddEdit,
    ExportFileButton
  },

  data() {
    return {
      query: {
        businessId: '',
        brandId: '',
        year: `${new Date().getFullYear()}`
      },
      businessList: [], // 事业部列表
      brandList: [], // 品牌列表
      loading: false,
      tableData: [],
      loadingBtn: '',
      isShowUpload: false,
      dialogType: 'add',
      dialogVisible: false,
      dialogData: {},
      ids: []
    }
  },

  computed: {
    
  },

  created() {
    this.init()
  },

  methods: {
    importTemplate,

    downLoadTemplate,

    async init() {
      const { result: businessList } = await getBusinessList()
      this.businessList = businessList || []
      if (this.businessList.length === 0) return
      // 默认第一个事业部
      this.query.businessId = this.businessList[0].id
      const { result: brandList } = await getBrandList()
      this.brandList = brandList || []
      this.brandList.unshift({
        name: '全部',
        id: ''
      })
      // if (this.brandList.length === 0) return
      // 默认第一个品牌
      this.query.brandId = this.brandList[0].id
      this.fetchTableData()
    },

    fetchTableData() {
      this.loading = true
      getBusinessTargets(this.query).then(({ result }) => {
        const list = result || []
        this.tableData = list.map(item => {
          const total = numbro(item.monthSalesTarget1)
                          .add(item.monthSalesTarget2).add(item.monthSalesTarget3).add(item.monthSalesTarget4)
                          .add(item.monthSalesTarget5).add(item.monthSalesTarget6).add(item.monthSalesTarget7)
                          .add(item.monthSalesTarget8).add(item.monthSalesTarget9).add(item.monthSalesTarget10)
                          .add(item.monthSalesTarget11).add(item.monthSalesTarget12)
          return {
            ...item,
            monthSaleTargetTotal: total._value
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },
    
    // 查询事件
    onSearch() {
      this.fetchTableData()
    },

    // 导入事件
    onImport() {
      this.isShowUpload = true
    },

    // 导出成功
    importSuccess() {
      this.fetchTableData()
    },

    // 新增事件
    onAdd() {
      this.dialogType = 'add'
      this.dialogData.businessId = this.query.businessId
      this.dialogData.year = this.query.year
      this.dialogData.brandId = this.query.brandId
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

     //批量删除
    delBatch(){     
      if(this.ids.length === 0){
        this.$message.warning("请勾选要删除的选项")
        return
      }
      this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingBtn = 'delete'
          deleteBatchTarget(this.ids).then(({ message }) => {
            this.$message.success(message)
            this.fetchTableData()
          }).finally(() => {
            this.loadingBtn = ''
          })
        }).catch(()=>{
          this.$message.info('已取消')
        })     
    },

    handleSelectionChange(val) {
        let entity = val;
        this.ids = entity.map(i => {return i.id})
    }

    // 删除操作
  //   onDelete(item) {
  //     this.loadingBtn = 'delete'
  //     deleteTarget(item.id).then(({ message }) => {
  //       this.$message.success(message)
  //       this.fetchTableData()
  //     }).finally(() => {
  //       this.loadingBtn = ''
  //     })
  //   }
  }
}
</script>

<style lang="scss" scoped>
</style>