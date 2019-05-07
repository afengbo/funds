<template>
  <div class="fillcontain">
    <div>
      <el-form :inline="true" ref="add_data">
        <el-form-item class="btnRight">
          <el-button type="primary" size="small" icon="view" @click="handleAdd()">添加</el-button>
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
            @click='onDeleteMoney(scope.row,scope.$index)'
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'fundlist',
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      // 获取表格数据
      this.$axios.get('/api/profiles')
        .then(res => {
          this.tableData = res.data;
        })
        .catch(err => console.log(err));
    },
    onEditMoney(row) {
      console.log('111', row);
    },
    onDeleteMoney(row, index) {
      console.log('222', row, index);
    },
    handleAdd() {
      console.log('333')
    }
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
