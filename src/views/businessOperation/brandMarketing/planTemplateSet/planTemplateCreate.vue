<template>
<!-- 新建活动计划模板 -->
  <div class="vlt-card plan-template_set">
    <panel :show="true" title="新建计划模板">
      <div class="vlt-edit-wrap vlt-edit-single">
        <base-form
          class="base-info"
          :formData="baseForm"
          labelWidth="10em"
          ref="baseForm"
          :rules="rules"
          @change="changeBaseForm"
        ></base-form>
      </div>
    </panel>
    <panel :show="true" title="计划内容" style="margin-top:15px;">
      <div class="table-wrap">
        <el-form :model="form" ref="form" :rules="rules">
          <el-table :data="form.tableData" border  class="table-content plan-table">
            <el-table-column label="序号" type="index" width="60"></el-table-column>
            <el-table-column label="计划标题" min-width="180">
              <template slot-scope="scope">
                <el-form-item :prop="`tableData.${scope.$index}.planTitle`" :rules="rules.planTitle">
                  <el-input v-model.trim="scope.row.planTitle" placeholder="请输入计划标题" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="计划内容" min-width="300">
              <template slot-scope="scope">
                <el-form-item :prop="`tableData.${scope.$index}.planContent`" :rules="rules.planContent">
                  <el-input v-model="scope.row.planContent" placeholder="请输入计划内容" type="textarea" maxlength="250"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" width='100'>
              <template slot-scope="scope">
                <el-form-item>
                  <el-button :id="'planTemplateCreate-deleteData' + scope.$index" size="mini" @click="deleteData(scope.row,scope.$index)">删除</el-button>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <el-button size="medium" class="add-content vlt-add-more" @click="addContent" :id="'planTemplateCreate-addContent'">
          <i class="el-icon-plus"></i> 新增计划内容
        </el-button> 
      </div>
    </panel>
    <div class="btn-box">
      <el-button :id="'planTemplateCreate-submit'" type="primary" size="medium" @click="submit">提交</el-button>
      <el-button :id="'planTemplateCreate-cancel'" size="medium" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import {mapGetters} from "vuex"
import { userInfo } from 'os';
export default {
  name: "planTemplateCreate",
  data() {
    return {
      rules: {
        planTemplateName: [{required: true, validator: this.$rules.checkName, title: '活动计划模板名称', trigger: ['change','blur']},{ min: 5, max: 20, message: '请输入活动计划模板名称，长度在 5 到 20 个字符', trigger: ['change','blur'] }],
        remark: [{required: true, message: '活动规则不能为空', trigger: ['change','blur']}],
        manageBy: [{required: true, message: '请选择活动管理方', trigger: ['change','blur']}],
        organizer: [{required: true, message: '请选择活动组织方', trigger: ['change','blur']}],
        regionCode: [{required: true, message: '活动区域不能为空', trigger: ['change','blur']}],
        planTitle: [{required: true, validator: this.$rules.checkName, title: '计划标题', trigger: ['change','blur']}],
        planContent: [{required: true, message: '计划内容不能为空', trigger: ['change','blur']}]
      },
      baseForm: [
        { type: "input-limit", title: "计划模板名称", prop: "planTemplateName", value:'',placeholder:'请输入活动计划模板名称',maxlength: 20},
        {
          title: "活动管理方",
          type: "cascader",
          prop: "manageBy",
          value: "",
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        {
          title: "活动组织方",
          type: "cascader",
          prop: "organizer",
          value: "",
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        {
          title: "活动区域",
          type: "cascader",
          prop: "regionCode",
          value: "",
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        { type: "textarea", title: "活动简介", prop: "remark", value:'',placeholder:'请输入参与活动的规则、要求等', maxlength:150},
      ],
      form: {
        tableData:[
          {planTitle: "", planContent: ""}
        ]
      },
      //修改页面的数据
      params:{}
    };
  },
  created() {
    console.log('机构数据',this.insData)
    this.baseForm[1].options = this.insData;
    this.baseForm[2].options = this.insData;
    this.baseForm[3].options = this.insData
  },
  watch: {
    insData: {
      handler(value) {
        if(value.length>0) {
          this.baseForm[1].options = value;
          this.baseForm[2].options = value;
          this.baseForm[3].options = value
        }
      },
      deep: true,
    }
    
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    addContent() {
      let list = {
        planTitle: '',
        planContent: ''
      }
      this.form.tableData.push(list)
    },
    deleteData(row,index) {
      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.form.tableData.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });          
        });
    },
    validateForm(form) {
      let flag = false
      this.$refs['form'].validate((valid) => {
        flag = valid
      })
      return flag
    },
    submit(){
      const self = this;
      let flag = self.validateForm("form")
      console.log(flag);
      self.$refs['baseForm'].validate(async val=>{
        // if (self.tableData.length <= 0) {
        //   self.$message.warning("计划内容不能为空");
        //   return;
        // };
        if(val === 'true' && flag){
          let data = JSON.parse(JSON.stringify(self.params));
          let list = self.form.tableData;
          // for (let item of list) {
          //   if (item.planTitle == "") {
              
          //     self.$message.warning("计划标题不能为空");
          //     return;
          //   } else if (item.planContent == "") {
          //     self.$message.warning("计划内容不能为空");
          //     return;
          //   }
          // };
          data.activityPlanContentList = list
          data.insId = self.$storage.get("userInfo").insId
          console.log(data)
          let res = await self.$api.activityPlanTemplateCreate({message:'新建成功', data})
          if (res && res.code == 0) {
            self.$router.push("planTemplateSet")
          }
        }
      })
    },
    cancel(){
      this.$router.back()
    },
    changeBaseForm(val) {
      this.params = val
    },
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
.table-wrap{
  padding: 10px;
}
</style>
