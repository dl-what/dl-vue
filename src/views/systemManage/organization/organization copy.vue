<template>
  <div class="vlt-card organizati" style="min-height:500px">
    <el-container>
      <el-aside class="organi-left" style="width:330px;">
        <div class="organi-btn">
          <control-bar :options="(len>0) ? controlOptions :controlOptionstwo" @select="selectBtn"></control-bar>
        </div>
        <el-col :span="18">
          <div class="organi-tree">
            <el-tree
              node-key="id"
              :data="nodeTreeData"
              :props="setProps"
              show-checkbox
              check-strictly
              :check-on-click-node="true"
              @node-click="getnowNodeifo"
              :default-expanded-keys="num"
              :default-checked-keys="num.slice(1)"
              :default-expand-all="false"
              ref="attrList"
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="freeze">
                  <el-button type="text" size="mini" @click.stop="append(node, data)">新增</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="remove(node, data)"
                    v-if="(data.id != 1)"
                  >{{data.status === 0 ? '解除' : '冻结'}}</el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
      </el-aside>

      <el-main style="padding:0 40px;border-left:1px solid #ccc;margin-left:20px;">
        <div class="organi-right" style="margin-left:30px;">
          <div class="Lotteryinfo">
            <section class="comp-item">
              <panel-edit title="机构信息" @edit="changeOrganizationIfo" :show="true">
                <base-info :infoList="AgencyInformation"></base-info>
              </panel-edit>
            </section>
          </div>
          <div class="departmentinfo" style="margin:40px 0 40px 0; ">
            <section class="comp-item">
              <panel title="部门信息" :show="true">
                <tips-line>
                  共搜索到
                  <span style="color:#57a3f3;padding:0 4px">{{total}}</span>条数据
                </tips-line>
                <el-table
                  ref="singleTable"
                  :data="tableList"
                  highlight-current-row
                  style="width: 100%"
                  border
                >
                  <el-table-column type="index" width="50" label="序号"></el-table-column>
                  <el-table-column property="departmentName" label="部门名称" width="120"></el-table-column>
                  <el-table-column property="insName" label="所属机构" width="120"></el-table-column>
                  <el-table-column property="parentName" label="上级部门"></el-table-column>
                  <el-table-column property="principal" label="部门负责人"></el-table-column>
                  <el-table-column property="principalMobile" label="负责人电话"></el-table-column>
                  <el-table-column property="status" label="状态">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.status"
                        @change="switchChange(scope.row)"
                      ></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column property="address" label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="derparModifine(scope.row)">编辑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="padding:10px;" v-if="total">
                  <!-- 分页!-->
                  <table-paging
                    :current-page="1"
                    :page-size="pageSize"
                    :total="total"
                    @handleSizeChange="pageSizeChange"
                    @handleCurrentChange="pageCurrentChange"
                  ></table-paging>
                </div>
              </panel>
            </section>
          </div>
        </div>
      </el-main>
    </el-container>
    <!--弹出框-->
    <el-dialog
      title
      :visible.sync="dialogFormVisible"
      custom-class="organiDialog"
      @close="hadnelClose"
    >
      <div class="vlt-edit-single">
        <h2 class="title">添加部门信息</h2>
        <div class="vlt-edit-wrap">
          <el-form>
            <base-form
              :formData="this.addOrChange === '更改部门信息'?AddDepartment.slice(1,6):AddDepartment"
              labelWidth="110px"
              ref="DepartmentBaseForm"
              :rules="rules2"
              direction="right"
              @change="DepartmentChangeForm"
            ></base-form>
          </el-form>
          <el-row class="vlt-edit-btn">
            <el-button type="primary" v-prevent="1000" size="medium" @click="DepartmentSubmit">提 交</el-button>
            <el-button size="medium" @click="departmenCancel">取 消</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!--弹出框2-->
    <el-dialog
      title
      :visible.sync="dialogFormVisible2"
      custom-class="organiDialog"
      @close="hadnelClose"
    >
      <div class="vlt-edit-single">
        <h2 class="title">{{addOrChange}}</h2>
        <div class="vlt-edit-wrap">
          <base-form
            :formData="this.addOrChange==='更改机构信息'?OrganizationChange:OrganizationAdd"
            labelWidth="110px"
            ref="OrganizationBaseForm"
            :rules="rules2"
            direction="right"
            @change="OrganizationChangeForm"
          ></base-form>

          <el-row class="vlt-edit-btn">
            <el-button
              type="primary"
              v-prevent="1000"
              size="medium"
              @click="OrganizationSubmit"
            >提 交</el-button>
            <el-button size="medium" @click="OrganizationCancel">取 消</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import rules from "@/utils/rules";
import moment from "moment";
export default {
  name: "organization",
  computed: {},
  created() {
    this.init();
  },
  data() {
    return {
      setProps: {
        label: "text",
        value: "id",
        children: "children"
      },
      num: [1],
      rules2: {
        insName: [
          {
            required: true,
            message: "机构名称不能为空",
            trigger: ["change", "blur"]
          }
        ],
        insCode: [
          {
            required: true,
            validator: rules.checkInstStr,
            trigger: ["change", "blur"]
          }
        ],
        principalMobile: [
          {
            required: true,
            validator: rules.checkPhone,
            trigger: ["change", "blur"]
          }
        ]
      },
      controlOptions: [
        //顶部按钮
        {
          name: "添加部门",
          type: "primary",
          icon: "plus",
          disabled: false,
          id: 2
        },
        { name: "刷新", type: "", icon: "refresh-right", id: 3 }
      ],
      controlOptionstwo: [
        //顶部按钮
        {
          name: "添加部门",
          type: "primary",
          icon: "plus",
          disabled: true,
          id: 2
        },
        { name: "刷新", type: "", icon: "refresh-right", id: 3 }
      ],
      AddDepartment: [
        //添加部门表单对象
        {
          type: "cascader",
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            checkStrictly: true
          },
          title: "上级部门",
          prop: "parentId",
          value: "",
          placeholder: "请选择",
          options: []
        },
        { type: "input", title: "部门名称", prop: "departmentName", value: "" },
        { type: "input", title: "部门负责人", prop: "principal", value: "" },
        {
          type: "input",
          title: "负责人电话",
          prop: "principalMobile",
          value: ""
        },
        { type: "switch", title: "状态", prop: "status", value: 1 },
        { type: "textarea", title: "备注", prop: "remark", value: "" }
      ],
      OrganizationChange: [
        //更改机构表单对象
        { title: "机构名称", type: "input", prop: "insName", value: "" },
        { title: "机构编码", type: "input", prop: "insCode", value: "" },
        { title: "机构责任人", type: "input", prop: "principal", value: "" },
        { title: "备注", type: "textarea", prop: "remark", value: "" }
      ],
      OrganizationAdd: [
        //添加机构表单对象
        {
          title: "父机构",
          type: "input",
          prop: " parent",
          disabled: true,
          value: ""
        },
        {
          title: "父机构编码",
          type: "input",
          disabled: true,
          prop: "parentInsCode",
          value: ""
        },
        { title: "机构名称", type: "input", prop: "insName", value: "" },
        { title: "机构编码", type: "input", prop: "insCode", value: "" },
        {
          title: "区域",
          type: "cascader",
          setProps: {
            label: "text",
            value: "code",
            children: "children",
            checkStrictly: true
          },
          prop: "regionCode",
          value: "",
          placeholder: "请选择",
          options: []
        },
        { type: "switch", title: "状态", prop: "status", value: 1 },
        { type: "textarea", title: "备注", prop: "remark", value: "" }
      ],
      AgencyInformation: [
        //机构信息
        {
          title: "父机构",
          value: "",
          type: "input",
          prop: "parentInsName",
          disabled: true
        },
        { title: "区域名称", value: "", type: "input", prop: "regionName" },
        {
          title: "父机构编码",
          value: "",
          type: "input",
          prop: "parentInsCode"
        },
        { title: "区域编码", value: "", type: "input", prop: "regionCode" },
        { title: "机构名称", value: "", type: "input", prop: "insName" },
        { title: "机构状态", value: "", type: "switch", prop: "status" },
        { title: "机构编码", value: "", type: "input", prop: "insCode" },
        { title: "备注", value: "", type: "textarea", prop: "remark" },
        {
          title: "创建人",
          value: "",
          type: "input",
          prop: "createBy",
          disabled: true
        },
        {
          title: "创建时间",
          value: "",
          type: "input",
          prop: "createTime",
          disabled: true
        },
        {
          title: "修改人",
          value: "",
          type: "input",
          prop: "updateBy",
          disabled: true
        },
        {
          title: "修改时间",
          value: "",
          type: "input",
          prop: "updateTime",
          disabled: true
        }
      ],
      tableList: [],
      pageSize: 10,
      page: 1,
      total: 0,
      slelectifo: "",
      dialogFormVisible2: false,
      dialogFormVisible: false,
      DepartmenParams: {},
      OrganizationParams: {},
      addOrChange: null,
      nodeTreeData: [],
      val: {},
      parentId: -1,
      departmenIfo: {},
      insparentId: 0,
      len: 0,
      keys: null,
      checked: false,
      changeOrganizationParams: {}
    };
  },
  mounted() {},
  components: {},
  methods: {
    async init() {
      let reslt = await this.$api.QueryInsTree();
      if (reslt && reslt.code === 0 && reslt.data != null) {
        this.nodeTreeData = reslt.data;
        this.len = reslt.data.length;
      }
      let res = await this.$api.FindRegionTreeRoots();
      if (res && res.code === 0) {
        this.region = res.data;
        this.OrganizationAdd[4].options = res.data;
      }
    },
    departmenCancel() {
      this.dialogFormVisible = false;
      this.addOrChange = "";
      this.DepartmenParams = {};
    },
    OrganizationCancel() {
      this.changeInfo(this.val.id);
      this.dialogFormVisible2 = false;
      this.addOrChange = "";
      this.OrganizationParams = {};
    },
    append(node, data) {
      this.addOrChange = "添加机构";
      this.num = [1];
      this.keys = this.$refs.attrList.getCurrentKey();
      this.insparentId = data;
      this.dialogFormVisible2 = true;
      this.OrganizationAdd[0].value = data.text;
      this.OrganizationAdd[1].value = data.code;
      this.OrganizationParams = {};
    },
    switchChange(val) {
      let ifo;
      if (!val.status) {
        ifo = "此操作会冻结此部门，请确认是否冻结此部门？";
      } else {
        ifo = "此操作会解冻结此部门，认确认是否要解冻结此部门？";
      }
      this.$confirm(ifo, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = {
            status: Number(val.status),
            departmentId: val.departmentId
          };
          let reslt = await this.$api.UpdateDeptInfo({ data });
          if (reslt && reslt.code === 0) {
            this.subsidiaryOrgan();
            this.$message({
              type: "success",
              message: val.status ? "部门解冻成功!" : "部门冻结成功"
            });
          }
        })
        .catch(() => {
          this.subsidiaryOrgan();
          this.$message({
            type: "info",
            message: "取消更改"
          });
        });
    },
    getId(date) {
      const self = this;
      let arr = [],
        arr2 = [];
      arr.push(date.id);
      if (date.children) {
        date.children.forEach(item => {
          arr.push(item.id);
          if (item.children) {
            item.children.forEach(i => {
              arr2.push(i.id);
              self.getId(i);
            });
          }
        });
      }
      return arr.concat(arr2);
    },

    async remove(node, date) {
      const self = this;
      this.$confirm(
        date.status ? "此操作将冻结该机构, 是否继续?" : "您确认要解冻此机构？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          let data = {
            insIdList: self.getId(date),
            status: Number(!date.status)
          };
          let reslt = await this.$api.UpdateInsInfoStatus({
            message: "更新成功",
            data
          });
          if (reslt && reslt.code === 0) {
            this.init();
            this.num.push(this.keys);
            this.$message({
              type: "success",
              message: date.status ? "冻结成功!" : "启用成功"
            });
          }
        })
        .catch(() => {
          this.subsidiaryOrgan();
          this.$message({
            type: "info",
            message: date.status ? "取消冻结" : "取消解冻"
          });
        });
    },

    OrganizationChangeForm(val) {
      if (this.addOrChange === "添加机构") {
        Object.assign(this.OrganizationParams, val);
      } else {
        Object.assign(this.changeOrganizationParams, val);
      }
    },
    pageSizeChange(val) {
      this.pageSize = val;
      this.subsidiaryOrgan();
    },
    pageCurrentChange(val) {
      this.subsidiaryOrgan(val);
    },
    open(val) {
      this.$alert(val, "温馨提示！", {
        confirmButtonText: "确定",
        callback: action => {
          close();
          this.slelectifo = "";
        }
      });
    },
    async subsidiaryOrgan(num) {
      let data = {
        param: { insId: this.val.id },
        pageSize: this.pageSize,
        page: num || 1
      };
      let resl = await this.$api.QueryDeptInfoPage({ data });
      let obj = JSON.parse(JSON.stringify(resl.data.records));
      if (resl && resl.code === 0) {
        let arr2 = resl.data.records;
        obj.forEach(item => {
          item.status = !!item.status;
        });
        this.tableList = obj;
        this.page = resl.data.pages;
        this.pageSize = resl.data.size;
        this.total = resl.data.total;
      }
    },
    async DepartmentSubmit() {
      if (this.addOrChange === "更改部门信息") {
        let data = JSON.parse(JSON.stringify(this.DepartmenParams));
        data.departmentId = this.departmenIfo.departmentId;

        let reslt = await this.$api.UpdateDeptInfo({ data });
        if (reslt && reslt.code === 0) {
          this.subsidiaryOrgan();
          this.dialogFormVisible = false;
          this.$refs.DepartmentBaseForm.resetForm();
          this.DepartmenParams = {};
        }
      } else if (this.addOrChange === "添加部门") {
        if (Object.keys(this.val).length != 0) {
          let data = JSON.parse(JSON.stringify(this.DepartmenParams));
          data.insId = this.val.id;
          delete data.parent;
          if (data.parentId.length === 0) {
            data.parentId = "";
          }
          data.status = Number(data.status);

          if (reslt && reslt.code === 0) {
            this.subsidiaryOrgan();
            this.dialogFormVisible = false;
            this.$refs.DepartmentBaseForm.resetForm();
            this.DepartmenParams = {};
          }
        } else {
          this.open("请选择要添加部门的机构！");
        }
      }
    },
    async OrganizationSubmit() {
      if (this.addOrChange === "更改机构信息") {
        let data = JSON.parse(JSON.stringify(this.changeOrganizationParams));
        data.insId = this.val.id;
        data.parentId = this.parentId;
        delete data.parent;
        let rest = await this.$api.UpdateInsInfo({ message: "修改成功", data });
        if (rest && rest.code === 0) {
          this.num.push(this.keys);
          this.changeInfo(this.val.id);
          this.dialogFormVisible2 = false;
          this.init();
          this.changeOrganizationParams = {};
        }
      } else if (this.addOrChange === "添加机构") {
        let data = JSON.parse(JSON.stringify(this.OrganizationParams));
        data.parentId = this.insparentId.id;
        if (this.insparentId.status === 1) {
          data.status = 1;
        } else {
          data.status = Number(!data.status);
        }
        let reslt = await this.$api.AddInsInfo({ data });
        if (reslt && reslt.code === 0) {
          this.num.push(this.keys);
          this.$refs.OrganizationBaseForm.resetForm();
          this.dialogFormVisible = false;
          this.dialogFormVisible2 = false;
          this.init();
          this.OrganizationParams = {};
        }
      }
    },

    async selectBtn(val) {
      if (val.name === "添加部门") {
        this.AddDepartment.forEach(item => {
          item.value = "";
        });
        if (this.slelectifo != "" && this.checked) {
          this.addOrChange = "添加部门";
          this.dialogFormVisible = true;
          let res = await this.$api.FindDeptTreeRoots({ data: this.val.id });
          if (res && res.code === 0) {
            this.AddDepartment[0].options = res.data;
          }
        } else {
          this.open("请选择需要添加部门的机构！");
        }
      }
      if (val.name === "刷新") {
        this.init();
        this.tableList = [];
      }
    },

    changeOrganizationIfo() {
      const self = this;
      if (Object.keys(this.val).length === 0) {
        this.open("请选择要编缉的机构");
      } else if (this.val.status === 0) {
        this.addOrChange = "更改机构信息";
        this.dialogFormVisible2 = true;
        (async () => {
          let reslt = await self.$api.QueryInsInfo({ data: this.val.id });
          this.OrganizationChange.forEach(item => {
            item.value = reslt.data[item.prop];
          });
        })();
      } else {
        this.open("对不起，启用状态不可编缉！");
      }
    },
    derparModifine(val) {
      this.dialogFormVisible = true;
      this.addOrChange = "更改部门信息";
      this.departmenIfo = val;
      let arr = Object.keys(val);
      let changeDepartment = this.AddDepartment.slice(1, 6);
      changeDepartment.forEach(item => {
        arr.forEach(i => {
          if (item.prop === i) {
            if (item.prop === "status") {
              if (val[i]) {
                item.value = 1;
              } else {
                item.value = 0;
              }
            } else {
              item.value = val[i];
            }
          }
        });
      });
    },

    async getnowNodeifo(val, s) {
      this.checked = s.checked;
      this.val = val;
      this.keys = this.$refs.attrList.getCurrentKey();
      this.num = [1];
      if (s.checked) {
        this.changeInfo(val.id);
      } else {
        this.AgencyInformation.forEach(item => {
          item.value = "";
        });
      }
    },
    async changeInfo(val) {
      const self = this;
      let reslt = await self.$api.QueryInsInfo({ data: val });
      if (reslt && reslt.code === 0) {
        this.AgencyInformation.forEach(item => {
          item.value = reslt.data[item.prop];
          if (
            (item.prop === "createTime" && reslt.data[item.prop] != null) ||
            (item.prop === "updateTime" && reslt.data[item.prop] != null)
          ) {
            item.value = moment(reslt.data[item.prop]).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          } else if (item.prop === "status") {
            item.value = self.statusChange(reslt.data[item.prop]);
          } else if (item.prop === "parentInsCode") {
            item.value = self.getInsArray(
              reslt.data.parentId,
              "id",
              self.nodeTreeData,
              "code"
            )[0];
          } else if (item.prop === "regionName") {
            item.value = reslt.data.parentInsName;
          }
        });
        self.slelectifo = reslt.data.insName;
        self.parentId = reslt.data.parentId;
        //当前节点父节点信息

        self.subsidiaryOrgan(); //分页控制
      }
    },
    statusChange(val) {
      let options = {
        1: "启用",
        0: "冻结"
      };
      return options[val];
    },
    getInsArray(id, key, data, keyBack) {
      const self = this;
      for (var i in data) {
        if (data[i][key] == id) {
          return [data[i][keyBack]];
        }
        if (data[i].children) {
          let ro = self.getInsArray(id, key, data[i].children, keyBack);
          if (ro !== undefined) {
            return ro.concat(data[i][keyBack]);
          }
        }
      }
    }
  },
  watch: {
    val: {
      handler: function(val, oldval) {
        this.$refs.attrList.setChecked(oldval, false);
      },
      deep: true
    }
  }
};
</script>


<style lang="less">
@import "./less/index.less";
.organiDialog {
  width: 600px;
  border-radius: 10px;
  .el-dialog__header {
    padding: 0;
  }
}

.freeze {
  padding-left: 20px;
}
.custom-tree-node {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.organizati {
  .el-col-18 {
    width: 100%;
  }
}
</style>
