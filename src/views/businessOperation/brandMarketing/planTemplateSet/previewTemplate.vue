<template>
<!-- 预览 -->
  <div class="vlt-card plan-template_set">
    <panel title="计划模板" :show="true">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <base-form
            :disabled='true'
            class="base-info"
            :formData="baseForm"
            labelWidth="10em"
            ref="baseForm"
            :rules="rules"
            @change="changeBaseForm"
          ></base-form>
        </div>
      </div>
    </panel>
    <panel :show="true" title="计划内容" style="margin-top:15px;">
      <div class="table-wrap">
        <el-table :data="tableData" border class="table-content">
          <el-table-column label="序号" type="index" width="55"></el-table-column>
          <el-table-column prop="planTitle" label="计划标题" width="220">
            <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.planTitle" placeholder="计划标题" disabled></el-input>
            </template> -->
          </el-table-column>
          <el-table-column prop="planContent" label="计划内容">
            <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.planContent" placeholder="计划内容" disabled></el-input>
            </template> -->
          </el-table-column>
          <!-- <el-table-column label="操作" width='180'>
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="dialogFormVisible = true">修改</el-button>
              <el-button type="danger" size="mini" @click="deleteData(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <!-- 修改 -->
      <!-- <el-dialog title="计划内容编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="计划标题" label-width="120px">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="计划内容" label-width="120px">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
        </div>
      </el-dialog> -->
    </panel>
    <div class="btn-box">
      <!-- <el-button type="primary" size="medium" @click="submit">提交</el-button>
      <el-button size="medium" @click="cancel">取消</el-button> -->
    </div>
  </div>
</template>

<script type="text/javascript">
import {mapGetters} from "vuex"
export default {
  name: "previewTemplate",
  data() {
    return {
      rules: { rule: "" },
      id: this.$route.query.id,
      baseForm: [
        { type: "input-limit", title: "计划模板名称", prop: "planTemplateName",value:'', maxlength: 20},
       
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
          value: '',
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
        { type: "textarea", title: "活动简介", prop: "remark" ,value:'', maxlength:150},
      ],
      tableData:[]
      // form:{
      //   planTitle:'',
      //   planContent:''
      // },
      // dialogFormVisible: false,
    };
  },
  computed: { ...mapGetters(['insData']) },
  created(){
    const self = this;
    // console.log('机构数据',self.insData)
    self.baseForm[2].options = self.insData;
    self.baseForm[3].options = self.insData;
    self.baseForm[4].options = self.insData
    self.getTemplateDetail(self.id)
  },
  watch: {
    insData: {
      handler(value) {
        if(value.length>0) {
          this.baseForm[2].options = value;
          this.baseForm[3].options = value;
          this.baseForm[4].options = value
        }
      },
      deep: true,
    }
    
  },
  methods: {
    async  getTemplateDetail(data){
      const self = this;
      const res = await self.$api.activityPlanTemplateDetail({data})
      self.tableData = res.data.activityPlanContentList
      console.log(res)
      if (res && res.code == 0){
        self.baseForm.forEach(item =>{
          item.value = res.data[item.prop]
        })
      }
    },
    // addContent() {
    //   this.activityPlanContentList.push({
    //     edit: true
    //   })
    // },
    // deleteData(row,index) {
    //   this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       this.planInfo.splice(index, 1);
    //       this.$message({
    //         type: 'success',
    //         message: '删除成功!'
    //       });
    //     }).catch(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '已取消删除'
    //       });          
    //     });
    // },
    // submit(){
    //   console.log(this.baseForm)
    // },
    // cancel(){
    //   this.$router.back()
    // },
    changeBaseForm() {},
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>

<style lang="less">
//  去掉查看時的字体颜色
// .plan-template_set{
// 	.el-textarea.is-disabled .el-textarea__inner{
// 		color: #333;
// 	}
// 	.el-input.is-disabled .el-input__inner {
// 		color: #333;
//   }
// }
</style>
<style lang="less" scoped>
.table-wrap{
  padding: 10px;
}
</style>
