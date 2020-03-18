<template>
  <div class="vlt-card">
    <div class="search">
      <search-Bar :options="option" @search="search" :total="total" labelWidth="6em">
        <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
      </search-Bar>
    </div>
    <div class="el_table" >
      <el-table :data="tableData" ref="print" @selection-change="handleSelectionChange" border>
        <!-- <el-table-column type="index" label="序号">
          <template slot-scope="scope">{{params.pageSize*(current-1)+(scope.$index+1)}}</template>
        </el-table-column> -->
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column  label="序号" type="index" fixed width="55">
          <template slot-scope="scope">{{params.pageSize*(params.page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="name" label="字典名称" min-width="140px"></el-table-column>
        <el-table-column prop="key" label="字典数据键" min-width="140px"></el-table-column>
        <el-table-column prop="value" label="字典数据值"  min-width="140px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="详情描述"  min-width="140px"></el-table-column>
        <el-table-column label="创建时间" width="160" prop="createTime">
          <!-- <template slot-scope="scope">{{translateTime(scope.row.createTime)}}</template> -->
        </el-table-column>
        <el-table-column prop="createByName" label="创建人"></el-table-column>
        <el-table-column prop="updateByName" label="更新人 "></el-table-column>
        <el-table-column label="更新时间" width="160" prop="updateTime">
          <!-- <template slot-scope="scope">{{translateTime(scope.row.updateTime)}}</template> -->
        </el-table-column>
        <!-- <el-table-column prop="isAllowDelete" label="数据字典状态" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="tableData[scope.$index].isAllowDelete"
              @change="switchChange(scope.row)"
              active-text="启用"
              inactive-text="禁用"
              :inactive-value="1"
              :active-value="0"
            ></el-switch>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="130" fixed="right">
          <template slot-scope="scope">
            <!-- :disabled="tableData[scope.$index].isAllowDelete?false:true" -->
            <el-button type="primary" size="mini" @click="edit(scope.row)"  v-has="'dataDictionary-edit'"  :id="$route.name+'-'+'edit'+scope.$index">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="toDelete(scope.row)"
              :disabled="scope.row.isAllowDelete?false:true"
               v-has="'dataDictionary-delete'"
                :id="$route.name+'-'+'delete'+scope.$index"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <table-paging
        :total="total"
        :currentPage="params.page"
        :pageSize="params.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></table-paging>
    </div>

    <div class="role-dialog">
      <el-dialog :title="flag?'新增字典':'编辑字典'" :visible.sync="dialogFormVisible" width="600px" custom-class="roleDialog" :close-on-click-modal="false">
        <!-- <roleifometion></roleifometion> -->
        <div class="vlt-edit-single">
          <div class="vlt-edit-wrap">
            <base-form
              :formData="formData"
              labelWidth="100px"
              ref="baseForm"
              :rules="rules"
              direction="right"
              @change="changeForm"
            ></base-form>
            <el-row class="vlt-edit-btn">
              <el-button type="primary" v-prevent="1000" size="medium" @click="submit" :id="$route.name+'-'+'submit'">提 交</el-button>
              <el-button size="medium" @click="cancel" :id="$route.name+'-'+'cancel'">取 消</el-button>
            </el-row>
          </div>
        </div>
      </el-dialog>
    </div>
    <el-dialog
      title="打印预览"
      :visible.sync="isPrint"
      class="print-fullscreen"
      :fullscreen="true">
      <print :data="printData" @cancel="isPrint=false"></print>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import rules from "@/utils/rules.js";

export default {
  name: "",
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            validator: rules.checkName,
            title: "字典名称",
            trigger: ["change", "blur"]
          }
        ],
        key: [
          {
            required: true,
            validator: rules.checkName,
            title: "字典数据键",
            trigger: ["change", "blur"]
          }
        ],
        value: [
          {
            required: true,
            validator: rules.checkName,
            title: "字典数据值",
            trigger: ["change", "blur"]
          }
        ],
        description: [
          {
            required: true,
            message: "请输入详情描述",
            trigger: ["change", "blur"]
          }
        ]
      },
      dialogFormVisible: false,
      multipleSelection: [],
      controlOptions: [
        //按钮组
        { name: "新增字典", type: "primary", permission:"dataDictionary-add", icon: "plus" }, // type为按钮的五种颜色， icon为具体的图标
        { name: "导出", type: "",permission:"dataDictionary-export", icon: "s-promotion" },
        { name: "打印", type: "", permission:"dataDictionary-print",icon: "printer" }
      ],
      option: [
        {
          title: "字典名称",
          prop: "name",
          type: "input",
          value: "",
          placeholder: "请输入" || ["请输入1", "请输入2"]
        }
      ],
      tableData: [],

      formData: [
        {
          title: "字典名称",
          type: "input-limit",
          prop: "name",
          value: "",
          maxlength: "20"
        },
        {
          title: "字典数据键",
          type: "input-limit",
          prop: "key",
          value: "",
          disabled: false,
          maxlength: "30"
        },
        {
          title: "字典数据值",
          type: "textarea",
          prop: "value",
          value: "",
          maxlength: "100"
        },
        {
          title: "允许删除",
          type: "switch",
          prop: "isAllowDelete",
          value: 1
        },
        {
          title: "详情描述",
          type: "textarea",
          prop: "description",
          value: "",
          maxlength: "100"
        }
      ],
      total: 0,
      // pageSize: 10,
      // currentPage1:0,
      searchParams: {},
      params: {
        page: 1,
        pageSize: 20
      },
      isPrint: false,
      printData: {
        params: {
          page: 1,
          pageSize: 20
        },
        title: '数据字典列表',
        props: [
          {prop: 'index', label:'序号', width: "5%"},
          {prop: 'name', label:'字典名称', width: "10%"},
          {prop:'key', label:'字典数据键', width: "10%"},
          {prop:'value', label:'字典数据值', width: "20%"},
          {prop:'description', label:'详情描述', width: "10%"},
          {prop:'createTime', label:'创建时间', width: "11%"},
          {prop:'createByName', label:'创建人', width: "9%"},
          {prop:'updateByName', label:'更新人', width: "9%"},
          {prop:'updateTime', label:'更新时间', width: "11%"}
        ],
        tableData: [],
      },
      flag: false,
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    }
  },
  components: {},
  created() {
    // let data = this.data;
    this.dictDataPage();
  },
  methods: {
    // translateTime(val) {
    //   return moment(val).format("YYYY-MM-DD HH:mm:ss");
    // },
    async exportExcel() {
      //导出
      const res = await this.$api.exportDictDataList({
        data: {
          page: this.params.page,
          pageSize: this.params.pageSize,
          param: this.searchParams
        },
        responseType: "blob"
      });
      var blob = new Blob([res.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "数据字典信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    async dictDataPage() {
      // const that = this;

      let res = await this.$api.dictDataPage({
        data: {
          ...this.params,
          param: this.searchParams
        }
      });
      console.log("全部数据", res);
      if (res && res.code == 0) {
        res.data.records.forEach(item =>{
          if (item.updateTime) {
            item.updateTime = this.$moment(item.updateTime).format("YYYY-MM-DD HH:mm:ss");
          };
          if (item.createTime) {
            item.createTime = this.$moment(item.createTime).format("YYYY-MM-DD HH:mm:ss")
          }
        })
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.printData.tableData = this.tableData;
        // this.pageSize = res.data.pageSize;
      } else {
        // this.$message.warning(res.msg);
      }
    },
    async toDelete(val) {
      //删除
      let id = val.id;
      console.log("id是", id);
      let ifo;
      if (val.isAllowDelete) {
        // ifo = "此操作会删除此数据字典，请确认是否启动此字典？";
        // } else {
        ifo = "此操作会删除此数据字典，请确认是否要删除此数据字典？";
      }
      this.$confirm(ifo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // let data = {
          //   id
          //   // isAllowDelete:val.isAllowDelete,
          // }
          console.log("data是", id);

          let reslt = await this.$api.deleteShow({ data: id });
          console.log("删除", reslt);
          if (reslt.code === 0) {
            // let data1 = this.data;
            // this.dictDataPage(data1);
            this.dictDataPage();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          // let data1 = this.data;
          //   this.dictDataPage(data1);
          this.$message({
            type: "info",
            message: "删除失败"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let isClick = this.multipleSelection ? false : true;
      this.$set(this.controlOptions[1], "disabled", isClick);
    },
    handleSizeChange(size) {
      console.log(999, size);
      this.params.pageSize = size;
      this.dictDataPage();
      // this.data.pageSize = val;
    },
    handleCurrentChange(val) {
      console.log(6666, val);
      this.params.page = val;
      this.dictDataPage();
      // this.currentPage1 = val;
    },
    search(val) {
      this.searchParams = val;
      this.params.page = 1;
      this.dictDataPage();
    },

    selectBtn(val) {
      //新建流程
      // this.$router.push({
      //   path: "dataDictionary/dataDictionaryEdit",
      // });
      if (val.name == "新增字典") {
        this.dialogFormVisible = true;
        this.formData[1].disabled = false;
        this.clearForm();
        this.flag = true;
      } else if (val.name == "导出") {
        this.exportExcel();
      } else if (val.name === "打印") {
        // this.print();
        this.isPrint = true;
        this.printData.params.page = this.params.page;
        this.printData.params.pageSize = this.params.pageSize;
      }
      // else if (val.name === "批量删除") {
      //   console.log("批量删除");
      //   if (!this.multipleSelection.length) {
      //     this.$message({
      //       type: "warning",
      //       message: "请选择需要删除的课程类型!"
      //     });
      //   } else {
      //     console.log(this.multipleSelection);
      //     let deleteArr = [];
      //     this.multipleSelection.forEach(item => {
      //       deleteArr.push(item.id);
      //     });
      //     this.toDelete(deleteArr);
      //   }
      // }
    },
    clearForm() {
      if (this.$refs.baseForm) {
        this.$refs.baseForm.resetForm();
      }
      this.formData.forEach(option => {
        this.$set(option, "value", "");
      });
    },
    print() {
      //打印
      this.$print(this.$refs.print);
    },
    edit(val) {
      //编辑
      this.dialogFormVisible = true;
      this.flag = false;
      this.val = val;
      let arr = Object.keys(val);
      let formData = this.formData;
      formData[1].disabled = true;
      // console.log(formData);
      formData.forEach(item => {
        arr.forEach(i => {
          if (item.prop === i) {
            item.value = val[i];
          }
        });
      });
    },
    //表单change事件
    changeForm(val) {
      this.param = val;
      // console.log(1111,this.param);
    },
    submit(val) {
      this.$refs.baseForm.validate(async val => {
        if (val === "true") {
          let data = { ...this.param };
          if (this.flag) {
            //新增提交
            //let formData = this.$refs.baseForm.form;
            let result = await this.$api.add({ message: "新增成功", data });
            // this.$refs.baseForm.resetForm();
            this.dictDataPage();
            console.log(666, result);
            this.dialogFormVisible = false;
          } else {
            //编辑提交
            data.id = this.val.id;
            let result = await this.$api.edit({ message: "编辑成功", data });
            this.dictDataPage();
            // this.$refs.baseForm.resetForm();
            console.log(777, result);
            this.dialogFormVisible = false;

            // });
          }
        }
      });
    },
    cancel() {
      // this.$router.go(-1)
      this.$refs.baseForm.resetForm();
      this.dialogFormVisible = false;
    },
    handler() {}
  }
};
</script>

<style lang="less" scoped>
</style>
