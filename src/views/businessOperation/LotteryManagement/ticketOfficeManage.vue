<template>
  <!-- 兑奖处管理 -->
  <div class="vlt-card">
    <div class="ticketOffice">
      <el-container>
        <el-aside class="tree-list" style="padding:20px;width:260px">
          <div class="menu-btn">
            <control-bar
              slot="extend-bar"
              :options="ticketOfficeOptions"
              @select="ticketOfficeSelectBtn"
              position="left"
            ></control-bar>
          </div>
          <div class="menu-ipt">
            <div class="menu-tree">
              <el-tree
                :data="ticketOfficeData"
                node-key="id"
                ref="attrList"
                @node-click="GetnowNodeifo"
                :default-expand-all="false"
                :default-expanded-keys="num"
                :expand-on-click-node="false"
                :props="{
                children: 'children',
                value: 'id',
                label: 'text',
                checkStrictly: true
              }"
              ></el-tree>
            </div>
          </div>
        </el-aside>
        <el-main style="border-left:1px solid #ccc;">
          <el-table :data="ticketOfficeTableData" border>
            <el-table-column prop="ticketOfficeWriteId" label="序号" type="index" width="60">
              <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
            </el-table-column>
            <el-table-column prop="prizeOfficeName" label="兑奖处名称" width="120"></el-table-column>
            <el-table-column prop="responsible" label="负责人" min-width="130"></el-table-column>
            <el-table-column prop="telephone" label="联系方式" min-width="120"></el-table-column>
            <el-table-column prop="cashPrizeAddress" label="兑奖地址" min-width="140"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
            <el-table-column label="兑奖处状态" min-width="160" prop="status" width="180">
              <template slot-scope="scope">
                <tableRowStatus
                  :scope="scope"
                  :tableData="ticketOfficeTableData"
                  idField="id"
                  statusField="status"
                  :rowName="scope.row.prizeOfficeName"
                  :option="{
                enable:{
                  apiName:'StatuUpdate',
                  label:'启用',
                  value:0,
                  permission:'ticketOfficeManage-enable'
                },
               disable:{
                  apiName:'StatuUpdate',
                  label:'冻结',
                  value:1,
                  permission:'ticketOfficeManage-disable'
               },
               logout:{
                  apiName:'StatuUpdate',
                  label:'注销',
                  value:2,
                  permission:'ticketOfficeManage-logout'
               }
              }"
                ></tableRowStatus>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="ticketOfficeWrite(scope.row)"
                  v-has="'ticketOfficeManage-edit'"
                  :id="$route.name + '-' + 'edit' + scope.$index"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table_paging">
            <tablePaging
              class="table_paging_right"
              :total="number"
              :currentPage="page"
              :pageSize="pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></tablePaging>
          </div>
        </el-main>
      </el-container>
      <div>
        <el-dialog title="编辑兑奖处" :visible.sync="WritedialogFormVisible" width="600px">
          <div class="vlt-edit-single">
            <base-form
              :formData="WritedialogData"
              ref="baseForm"
              :rules="rules"
              direction="right"
              @change="WritedialogchangeForm"
            ></base-form>
            <div class="dialog-footer">
              <el-button size="medium" @click="editCancel" :id="$route.name + '-' + 'editCancel'">取 消</el-button>
              <el-button size="medium" type="primary" @click="send" :id="$route.name + '-' + 'editSave'">保 存</el-button>
            </div>
          </div>
        </el-dialog>
        <el-dialog title="新增兑奖处" :visible.sync="AddDialogFormVisible" width="600px">
          <div class="vlt-edit-single">
            <base-form
              :formData="AddDialogData"
              ref="baseForm"
              :rules="rules"
              direction="right"
              @change="AddDialogchangeForm"
            ></base-form>
            <div class="dialog-footer">
              <el-button size="medium" @click="addCancel" :id="$route.name + '-' + 'addCancel'">取 消</el-button>
              <el-button size="medium" type="primary" @click="submit" :id="$route.name + '-' + 'addSave'">确 定</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import rules from '@/utils/rules'
export default {
  created() {},
  data() {
    return {
      //新增弹窗表单验证
      rules: {
        prizeOfficeName: [
          {
            required: true,
            validator: rules.checkName,
            title: "兑奖处名称",
            trigger: ["change", "blur"]
          }
        ],
        responsible: [
          {
            required: true,
            message: "负责人不能为空",
            trigger: ["change", "blur"]
          }
        ],
        telephone: [
          {
            required: true,
            validator: this.$rules.checkPhoneAndMobile,
            title: "联系方式",
            trigger: ["change", "blur"]
          }
        ],
        cashPrizeAddress: [
          {
            required: true,
            message: "兑奖地址不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },

      //编辑弹窗表单类型
      WritedialogData: [
        {
          type: "input-limit",
          title: "兑奖处名称",
          prop: "prizeOfficeName",
          value: "",
          maxlength: 10
        },
        {
          type: "input",
          title: "所属机构",
          prop: "insId",
          value: "",
          disabled: true
        },
        {
          type: "input-limit",
          title: "负责人",
          prop: "responsible",
          value: "",
          maxlength: 10
        },
        {
          type: "input",
          title: "联系方式",
          prop: "telephone",
          value: "",
          maxlength: 15
        },
        {
          type: "input",
          title: "兑奖地址",
          prop: "cashPrizeAddress",
          maxlength: 50,
          value: ""
        }
      ],
      //新增弹窗表单类型
      AddDialogData: [
        {
          type: "input-limit",
          title: "兑奖处名称",
          prop: "prizeOfficeName",
          value: "",
          maxlength: 10
        },
        {
          type: "input",
          title: "所属机构",
          prop: "insId",
          value: "",
          disabled: true
        },
        {
          type: "input",
          title: "负责人",
          prop: "responsible",
          value: "",
          maxlength: 10
        },
        {
          type: "input",
          title: "联系方式",
          prop: "telephone",
          value: "",
          maxlength: 15
        },
        {
          type: "input",
          title: "兑奖地址",
          prop: "cashPrizeAddress",
          maxlength: 50,
          value: ""
        }
      ],
      //编辑弹窗默认为false
      WritedialogFormVisible: false,
      //新增弹窗默认为false
      AddDialogFormVisible: false,
      //表格数据
      ticketOfficeTableData: [],
      //树形菜单数据
      ticketOfficeData: [],
      //点击树形结构得到点击的数据
      ticketOfficeWriteData: "",
      //新增和刷新数据
      ticketOfficeOptions: [
        {
          name: "新增兑奖处",
          type: "primary",
          icon: "plus",
          id: 1,
          permission: "ticketOfficeManage-add"
        } // type为按钮的五种颜色， icon为具体的图标
      ],
      checked: false,
      val: {}, //当前点击的节点data
      slelectifo: "", //当前选中机构名称
      num: [1],
      page: 1,
      pageSize: 20,
      current: 1,
      number: 0,
      //存储节点数据
      insData: [],
      //默认编辑数据
      writeData: {},
      //储存当前行id
      id: ""
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // 初始化获取机构树数据
      let result = await this.$api.getInsTree();
      this.ticketOfficeData = result.data;
      console.log(result);
    },
    //新增和刷新数据按钮
    ticketOfficeSelectBtn(val) {
      console.log(val)
      if (val.id == 1) {
        if (this.slelectifo != "") {
          console.log(this.slelectifo);
          this.AddDialogData[1].value = this.slelectifo;

          this.AddDialogFormVisible = true;
        } else {
          this.$message({
            type: "warning",
            message: "请选择需要添加部门的机构！"
          });
        }
      }
      //console.log(val);
    },
    //请求当前节点数据
    async getInsIdList() {
      let data = {
        page: this.current,
        pageSize: this.pageSize,
        param: {
          insId: this.val.id
        }
      };
      let result = await this.$api.getInsList({ data });
      if (result && result.code === 0) {
        this.insData = result.data.records;
        this.page = result.data.current;
        // this.pageSize = result.data.size;
        this.number = result.data.total;
        result.data.records.forEach(item => {
          item.createTime = this.$moment(item.createTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        });
        this.ticketOfficeTableData = result.data.records;
      }
      console.log(this.insData);
    },
    GetnowNodeifo(val, info) {
      //获取当前点击节点信息,info为当前子节点
      console.log(val, info);
      this.checked = info.checked;
      this.slelectifo = val.text;
      this.val = val;
      this.getInsIdList();
      //console.log(result);
    },

    // ticketOfficeGetCheckifo(...res) {
    //   //复选框选中状态变化事件递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    //   //console.log(res);
    // },
    // 编辑取消
    editCancel() {
      this.$refs.baseForm.resetForm();
      this.WritedialogFormVisible = false;
    },
    //新增取消
    addCancel() {
      this.$refs.baseForm.resetForm();
      this.AddDialogFormVisible = false;
    },

    //点击编辑
    async ticketOfficeWrite(row) {
      console.log(this.WritedialogData[1].value);
      this.WritedialogData.forEach(item => {
        item.value = row[item.prop];
      });
      this.WritedialogData[1].value = this.slelectifo;
      this.id = row.id;
      console.log(this.id);
      // this.$set(this.WritedialogData[1], "value", this.slelectifo);
      this.WritedialogFormVisible = true;
    },
    //编辑表单提交
    async send() {
      let data = {
        ...this.writeData,
        insId: this.val.id,
        id: this.id
      };
      this.$refs.baseForm.validate(async valid => {
        if (valid == "true") {
          let res = await this.$api.InsUpdate({ message: "修改成功", data });
          if (res && res.code === 0) {
            console.log(res);
            this.getInsIdList();
            this.WritedialogFormVisible = false;
          }
        }
      });
    },

    //编辑弹窗表单change事件
    WritedialogchangeForm(param) {
      console.log(param);
      this.writeData = param;
    },
    //新增弹窗表单change事件
    AddDialogchangeForm(val) {
      this.addList = val;
      console.log(this.addList);
    },
    handleSizeChange(size) {
      console.log(size);
      this.pageSize = size;
      this.getInsIdList();
    },
    handleCurrentChange(value) {
      console.log(value);
      this.current = value;
      this.getInsIdList();
    },
    //新增表单提交
    submit() {
      let data = {
        ...this.addList,
        insId: this.val.id
      };
      this.$refs.baseForm.validate(async valid => {
        if (valid == "true") {
          let result = await this.$api.InsAdd({ message: "新增成功", data });
          if (result && result.code === 0) {
            this.getInsIdList();
            this.AddDialogFormVisible = false;
          } else {
            this.$message.warning("校验失败");
          }
        }
      });
    }
  }

  // watch: {
  //   val: {
  //     handler: function(val, oldval) {
  //       console.log(val, oldval);
  //       this.$refs.attrList.setChecked(oldval, false);
  //     },
  //     deep: true // 对象内部的属性监听，也叫深度监听
  //   }
  // }
};
</script>

<style lang="less">
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.menuDialog {
  border-radius: 20px;
  .el-dialog__header {
    padding: 0;
  }
  .el-row {
    text-align: center;
  }
}
</style>
<style lang="less" scoped>
.vlt-edit-single{
  width: 490px;
  margin: 0 auto;
}
.dialog-footer{
  text-align: right;
  padding-top: 10px;
}
</style>