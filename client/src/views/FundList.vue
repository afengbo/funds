<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="add_data" :model='search_date'>
        <el-form-item lable="按照时间筛选：">
          <el-date-picker
            v-model="search_date.startTime"
            type="datetime"
            placeholder="选择开始时间">
          </el-date-picker> -- 
          <el-date-picker
            v-model="search_date.endTime"
            type="datetime"
            placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click="handleSearch()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button 
            type="primary" 
            size="small" 
            icon="view" 
            v-if="user.identity == 'manager'" 
            @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-if="tableData.length > 0"
      :data="tableData"
      max-height="450"
      :default-sort = "{prop: 'date', order: 'descending'}"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        align='center'
        width="70">
      </el-table-column>
      <el-table-column
          prop="date"
          label="创建时间"
          align='center'
          width="250"
          sortable>
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
      </el-table-column>
      <el-table-column
          prop="type"
          label="收支类型"
          align='center'
          width="150">
      </el-table-column>
      <el-table-column
        prop="describe"
        label="收支描述"
        align='center'
        width="230">
      </el-table-column>
      <el-table-column
        prop="income"
        label="收入"
        align='center'
        width="170"> 
        <template slot-scope="scope">  
            <span style="color:#00d053">+ {{ scope.row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="expend"
        label="支出"
        align='center'
        width="170">
        <template slot-scope="scope">  
            <span style="color:#f56767">- {{ scope.row.expend }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cash"
        label="账户现金"
        align='center'
        width="170">
        <template slot-scope="scope">  
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align='center'
        width="260">
      </el-table-column>
      <el-table-column
        prop="operation"
        align='center'
        label="操作"
        fixed="right"
        v-if="user.identity == 'manager'"
        width="230">
        <template slot-scope='scope'>
          <el-button 
            type="warning" 
            icon='edit' 
            size="small"
            @click='onEditMoney(scope.row)'
          >编辑</el-button>
          <el-button 
            type="danger" 
            icon='delete' 
            size="small"
            @click='onDeleteMoney(scope.row)'
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page:sync="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <Dialog :dialog='dialog' :formData='formData' @update="getProfile()"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog"
export default {
  name: 'fundlist',
  data() {
    return {
      search_date: {
        startTime: '',
        endTime: ''
      },
      filterTableData: [],
      tableData: [],
      allTableData: [],
      paginations: {
        page_index: 1,   // 当前页码
        total: 0,   // 总数
        page_size: 5,   // 当前每页显示条数
        page_sizes: [5, 10, 15, 20],   // 可选显示条数
        layout: "total, sizes, prev, pager, next, jumper",   // 分页属性
      },
      formData: {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: '',
      },
      dialog: {
        show: false,
        title: '',
        option: 'edit'
      }
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      // 获取表格数据
      this.$axios.get('/api/profiles')
        .then(res => {
          this.allTableData = res.data;
          this.filterTableData = res.data;
          // 设置分页数据
          this.setPaginations();
        })
        .catch(err => console.log(err));
    },
    setPaginations() {
      // 分页属性初始化数据
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      })
    },
    onEditMoney(row) {
      this.dialog = {
        show: true,
        title: '更新资金信息',
        option: 'edit'
      }
      // 填充内容
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id,
      }
    },
    onDeleteMoney(row) {
      this.$confirm("是否永久删除'" + row.describe + "'?", '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.$axios.delete(`/api/profiles/delete/${row._id}` )
          .then(res => {
            // 删除成功
            this.$message({
              message: row.describe + " 删除成功",
              type: 'success'
            })
            // 重新获取表格数据
            this.getProfile();
          })
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除 ' + row.describe
          });          
        });
    },
    handleAdd() {
      this.dialog = {
        show: true,
        title: '添加资金信息',
        option: 'add'
      };
      this.formData = {
        type: '',
        describe: '',
        income: '',
        expend: '',
        cash: '',
        remark: '',
        id: '',
      }
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      })
    },
    handleCurrentChange(page) {
      // 获取当前页首行数据下标
      let index = this.paginations.page_size * (page - 1);
      // 获取当前页末行数据下标
      let nums = this.paginations.page_size * page;
      // 暂存
      let tables = [];
      for (let i=index; i<nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
      }
      this.tableData = tables;
    },
    handleSearch() {
      // 筛选
      if (!this.search_date.startTime || !this.search_date.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择时间区间'
        });
        this.getProfile();
        return;
      }

      const sTime = this.search_date.startTime.getTime();
      const eTime = this.search_date.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime;
      });

      // 分页数据
      this.setPaginations();
    }
  },
  components: {
    Dialog
  }
}
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
