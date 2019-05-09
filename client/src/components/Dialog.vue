<template>
  <div class="dialog">
    <el-dialog 
      :title="dialog.title" 
      :visible.sync="dialog.show"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
        <div class="form">
          <el-form ref="form" :model="formData" :rules="form_rules" label-width="120px" style="margin:10px;width:auto">
            <el-form-item label="收支类型：" prop="type">
              <el-select v-model="formData.type" placeholder="请选择收支类型">
                <el-option 
                  v-for="(formtype, index) in format_type_list" 
                  :key="index"
                  :lable="formtype"
                  :value="formtype">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收支描述：" prop="describe">
              <el-input v-model="formData.describe"></el-input>
            </el-form-item>
            <el-form-item label="收入：" prop="income">
              <el-input v-model="formData.income"></el-input>
            </el-form-item>
            <el-form-item label="支出：" prop="expend">
              <el-input v-model="formData.expend"></el-input>
            </el-form-item>
            <el-form-item label="账户余额：" prop="cash">
              <el-input v-model="formData.cash"></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" v-model="formData.remark"></el-input>
            </el-form-item>
            <el-form-item class="text_right">
              <el-button type="primary" @click="onSubmit('form')">提交</el-button>
              <el-button @click="dialog.show = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "dialog",
  props: {
    dialog: Object,
    formData: Object
  },
  data() {
    return {
      format_type_list: [
        "提现",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账"
      ],
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能为空", trigger: "blur" }
        ],
        income: [
          { required: true, message: "收入不能为空！", trigger: "blur" }
        ],
        expend: [
          { required: true, message: "支出不能为空！", trigger: "blur" }
        ],
        cash: [
          { required: true, message: "账户金额不能为空！", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.dialog.option == 'add') {
            this.$axios.post("/api/profiles/add", this.formData)
              .then(res => {
                // 添加成功
                this.$message({
                  message: '数据添加成功',
                  type: 'success'
                });

                // 隐藏dialog
                this.dialog.show = false;
                // 重新获取表格数据
                this.$emit("update");
              })
              .catch(err => console.log(err));
          } else if (this.dialog.option == 'edit') {
            this.$axios.post(`/api/profiles/edit/${this.formData.id}`, this.formData)
              .then(res => {
                // 添加成功
                this.$message({
                  message: '数据更新成功',
                  type: 'success'
                });

                // 隐藏dialog
                this.dialog.show = false;
                // 重新获取表格数据
                this.$emit("update");
              })
              .catch(err => console.log(err));
          }
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
