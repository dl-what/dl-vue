<template>
  <div class="vlt-card organizati" style="min-height:500px">
    <el-container>
      <el-aside class="organi-left" :class="{collapse:isCollapse}">
        <div class="organi-btn">
          <control-bar :options="controlOptions" @select="selectBtn"></control-bar>
          <span class="menu-collapse iconfont icon-caidan" @click="isCollapse = !isCollapse"></span>
        </div>
        <el-col :span="18">
          <div class="organi-tree prety-scroller">
            <el-tree
              node-key="id"
              :data="nodeTreeData"
              :props="setProps"
              check-strictly
              :check-on-click-node="true"
              @node-click="getnowNodeifo"
              :default-expanded-keys="[1]"
              :default-expand-all="false"
              ref="attrList"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="freeze">
                  <el-button
                    type="text"
                    size="mini"
                    @click.stop="append(node, data)"
                    v-if="data.type === 10"
                  >新增</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    :id="$route.name+'-tree-level'+data.id"
                    @click.stop="upgrade(node, data)"
                    v-if="data.type == 2"
                  >升级</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    :id="$route.name+'-tree-disabled'+data.id"
                    @click.stop="remove(node, data)"
                    v-if="(node.level != 1)"
                  >{{data.status === 0 ? '解除' : '冻结'}}</el-button>
                </span>
              </span>
            </el-tree>
            <!--添加删除功能-->
          </div>
        </el-col>
      </el-aside>

      <el-main class="info-bd">
        <div class="organi-right">
          <insFromtion ref="insIfo"></insFromtion>
          <div class="departmentinfo">
            <departmentList :id="val.id" ref="department" />
          </div>
        </div>
      </el-main>
    </el-container>
    <!--弹出框-->
    <el-dialog
      title
      :visible.sync="dialogFormVisible"
      custom-class="organiDialog"
      :close-on-click-modal="false"
    >
      <div class="vlt-edit-single">
        <h2 class="title">添加部门信息</h2>
        <div class="vlt-edit-wrap">
          <el-form
            :rules="rules2"
            :model="departmentFrom"
            ref="DepartmentBaseForm"
            labelWidth="110px"
          >
            <el-form-item label="上级部门" prop="parentId">
              <el-cascader
                :options="departmentOption"
                :props="setProps"
                clearable
                placeholder="请选择上级部门"
                v-model="departmentFrom.parentId"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="部门名称" prop="departmentName">
              <el-input v-model.trim="departmentFrom.departmentName" placeholder="请输入部门名称" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="部门负责人" prop="principal">
              <el-select
                v-model="departmentFrom.principal"
                @change="departmentPrincipal"
                placeholder="请选择部门负责人"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人电话" prop="principalMobile">
              <el-input v-model.trim="departmentFrom.principalMobile" placeholder="自动获取"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch :active-value="1" :inactive-value="0" v-model="departmentFrom.status"></el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model.trim="departmentFrom.remark" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 10}" type="textarea" maxlength="150"></el-input>
            </el-form-item>
          </el-form>
          <el-row class="vlt-edit-btn">
            <el-button
              type="primary"
              v-prevent="1000"
              size="medium"
              @click="DepartmentSubmit"
              :id="$route.name+'-depart-submit'"
            >提 交</el-button>
            <el-button size="medium" @click="departmenCancel" :id="$route.name+'-depart-cencel'">取 消</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!--弹出框2-->
    <el-dialog
      title
      :visible.sync="dialogFormVisible2"
      custom-class="organiDialog"
      :close-on-click-modal="false"
    >
      <div class="vlt-edit-single">
        <h2 class="title">添加机构</h2>
        <div class="vlt-edit-wrap">
          <base-form
            :formData="OrganizationAdd"
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
              size="small"
              :id="$route.name+'-organi-submit'"
              @click="OrganizationSubmit"
            >提 交</el-button>
            <el-button
              size="small"
              @click="OrganizationCancel"
              :id="$route.name+'-organi-cencel'"
            >取 消</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
    <!--弹出框3-->
    <el-dialog
      title
      :visible.sync="dialogFormVisibleUpgrade"
      custom-class="organiDialog"
      :close-on-click-modal="false"
    >
      <div class="vlt-edit-single">
        <h2 class="title">机构升级</h2>
        <div class="vlt-edit-wrap">
          <el-form :rules="rules2" :model="upgradeForm" ref="baseForm" labelWidth="110px">
            <el-form-item label="区域编码" prop="remark">
              <el-input v-model.trim="upgradeForm.regionCode" type="input"></el-input>
            </el-form-item>
          </el-form>
          <el-row class="vlt-edit-btn">
            <el-button
              type="primary"
              v-prevent="1000"
              size="medium"
              @click="upgradeFormSubmit"
              :id="$route.name+'-orgainUpdate-level-submint'"
            >提 交</el-button>
            <el-button
              size="medium"
              @click="upgradeFormCencle"
              :id="$route.name+'-orgainUpdate-level-cencel'"
            >取 消</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import insFromtion from "./InsIfo";
import departmentList from "./departmentList";
import rules from "@/utils/rules";
import moment from "moment";
export default {
  name: "organization",
  computed: {},
  components: {
    insFromtion,
    departmentList
  },
  created() {
    this.init();
  },
  data() {
    return {
      isCollapse: false,
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: true
      },
      options: [],
      departmentOption: [],
      rules2: {
        insName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "机构名称",
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
        departmentName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "部门名称",
            trigger: ["change", "blur"]
          }
        ]
      },
      upgradeForm: {
        regionCode: ""
      },
      controlOptions: [
        {
          name: "添加部门",
          type: "primary",
          icon: "plus",
          disabled: false,
          id: 2,
          permission: "organizationChild-add"
        },
        { name: "刷新", type: "", icon: "refresh-right", id: 3 }
      ],
      departmentFrom: {
        parentId: "",
        departmentName: "",
        principal: "",
        principalMobile: "",
        status: 1,
        remark: ""
      },
      OrganizationAdd: [
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
        {
          title: "机构名称",
          type: "input",
          prop: "insName",
          value: "",
          maxlength: "20"
        },
        {
          title: "机构编码",
          type: "input",
          prop: "insCode",
          value: "",
          maxlength: "30"
        },
        {
          title: "区域",
          type: "select",
          setProps: {
            label: "regionName",
            value: "regionCode",
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
      slelectifo: "",
      dialogFormVisible2: false,
      dialogFormVisible: false,
      OrganizationParams: {},
      nodeTreeData: [],
      val: {},
      insparentId: 0,
      checked: false,
      changeOrganizationParams: {},
      isData: [],
      dialogFormVisibleUpgrade: false,
      upgradeId: ""
    };
  },
  methods: {
    async init() {
      let reslt = await this.$api.QueryInsTree();
      if (reslt && reslt.code === 0) {
        if (reslt.data && reslt.data.length > 0) {
          this.nodeTreeData = reslt.data;
          this.getnowNodeifo(reslt.data[0])
        } else {
          this.$set(this.controlOptions[0], "disabled", true);
        }
      }
    },
    departmenCancel() {
      this.dialogFormVisible = false;
      this.DepartmenParams = {};
    },
    OrganizationCancel() {
      if (this.checked) {
        this.$refs.insIfo.changeInfo(this.val.id);
      }
      this.dialogFormVisible2 = false;
      this.OrganizationParams = {};
    },
    async append(node, data) {
      this.insparentId = data;
      this.dialogFormVisible2 = true;
      this.OrganizationAdd[0].value = data.text;
      this.OrganizationAdd[1].value = data.code;
      let reslt = await this.$api.FindRegionList({
        data: data.extendAttach || data.regionCode
      });
      if (reslt && reslt.code === 0) {
        let data = reslt.data;
        let arr = data.map(item => {
          return { label: item.regionName, value: item.regionCode };
        });
        this.OrganizationAdd[4].options = arr;
      }
    },
    getId(date) {
      const self = this;
      let arr = [];
      (function find(_data) {
        arr.push(date.id);
        const children = _data.children || [];
        if (children.length) {
          children.forEach(item => {
            arr.push(item.id);
            if (item.children) {
              find(item.children);
            }
          });
        } else {
          return false;
        }
      })(date);
      return arr;
    },
    getArray(data) {
      let arr = [];
      (function find(_data) {
        const children = _data || [];
        if (children.length) {
          children.forEach(item => {
            arr.push(item);
            find(item.children);
          });
        } else {
          return false;
        }
      })(this.nodeTreeData);

      return arr;
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
      ).then(async () => {
        let data = {
          insIdList: self.getId(date),
          status: Number(!date.status)
        };
        let reslt = await this.$api.UpdateInsInfoStatus({ data });
        if (reslt && reslt.code === 0) {
          this.getArray().forEach(item => {
            data.insIdList.forEach(i => {
              if (item.id == i) {
                item.status = data.status;
              }
            });
          });
          this.$message({
            type: "success",
            message: !data.status ? "冻结成功!" : "启用成功"
          });
        }
      });
    },
    departmentPrincipal(val) {
      let phoneCode = this.isData.filter(item => item.userId === val);
      this.departmentFrom.principalMobile = phoneCode[0].mobile;
    },
    upgrade(node, data) {
      this.$set(this.upgradeForm, "regionCode", "");
      this.upgradeId = data;
      this.dialogFormVisibleUpgrade = true;
    },
    upgradeFormCencle() {
      this.dialogFormVisibleUpgrade = false;
    },
    upgradeFormSubmit() {
      let data = this.upgradeForm;
      if (this.upgradeId.extendAttach == data.regionCode) {
        this.open("区域编码不能和当前编码相同！");
      } else {
        (async () => {
          data.insId = this.upgradeId.id;
          let res = await this.$api.insUpgrade({ data });
          if (res && res.code === 0) {
            this.$set(this.upgradeForm, "regionCode", "");
            this.nodeTreeData = res.data;
            this.dialogFormVisibleUpgrade = false;
          }
        })();
      }
    },
    OrganizationChangeForm(val) {
      Object.assign(this.OrganizationParams, val);
    },
    DepartmentSubmit() {
      this.$refs["DepartmentBaseForm"].validate(async valid => {
        if (valid) {
          let data = { ...this.departmentFrom };
          data.insId = this.val.id;
          delete data.parent;
          if (data.parentId.length <= 0) {
            data.parentId = "";
          } else {
            data.parentId = data.parentId[0];
          }
          let reslt = await this.$api.AddDeptInfo({
            message: "部门新增成功",
            data
          });
          if (reslt && reslt.code === 0) {
            this.$refs.department.subsidiaryOrgan();
            this.dialogFormVisible = false;
            this.restDepartFrom();
          }
        } else {
          this.$message.error("表单验证有误，请重新输入！");
          return false;
        }
      });
    },
    restDepartFrom() {
      for (let key in this.departmentFrom) {
        if (key === "status") {
          this.departmentFrom[key] = 1;
        } else {
          this.departmentFrom[key] = "";
        }
      }
    },
    OrganizationSubmit() {
      this.$refs["OrganizationBaseForm"].validate(async valid => {
        if (valid == "true") {
          let data = JSON.parse(JSON.stringify(this.OrganizationParams));
          data.parentId = this.insparentId.id;
          if (this.insparentId.status === 1) {
            data.status = 1;
          } else {
            data.status = Number(!data.status);
          }
          let reslt = await this.$api.AddInsInfo({
            message: "新增成功",
            data
          });
          if (reslt && reslt.code === 0) {
            if (!this.insparentId.children) {
              this.$set(this.insparentId, "children", []);
            }
            let obj = JSON.parse(JSON.stringify(reslt.data));
            obj.id = reslt.data.insId;
            obj.text = reslt.data.insName;
            this.insparentId.children.push(obj);
            this.$refs.OrganizationBaseForm.resetForm();
            this.dialogFormVisible2 = false;
            this.OrganizationParams = {};
          }
        } else {
          this.$message.error("表单验证有误，请重新输入！");
          return false;
        }
      });
      return;
    },
    async selectBtn(val) {
      if (val.name === "添加部门") {
        if (this.slelectifo != "") {
          this.finddepartmentTree(this.val);
          this.dialogFormVisible = true;
        } else {
          this.open("请选择需要添加部门的机构！");
        }
      }
      if (val.name === "刷新") {
        this.init();
        this.tableList = [];
      }
    },
    open(val) {
      this.$alert(val, "温馨提示！", {
        confirmButtonText: "确定",
        callback: action => {
          close();
        }
      });
    },
    finddepartmentTree(val) {
      (async val => {
        let res = await this.$api.FindDeptTreeRoots({ data: val.id });
        if (res && res.code === 0) {
          this.departmentOption = res.data;
        }
      })(val);
    },
    findUser(val) {
      (async val => {
        let res = await this.$api.QueryAllUserInfo({ data: val.id });
        if (res && res.code === 0) {
          if (res.data) {
            this.isData = res.data;
            let option = res.data.map(item => {
              return { label: item.userName, value: item.userId };
            });
            this.options = option;
          }
        }
      })(val);
    },
    async getnowNodeifo(val) {
      this.val = val;
      this.slelectifo = val.text;
    }
  },
  watch: {
    val: {
      handler: function(val, oldval) {
        this.$refs.insIfo.changeInfo(val.id);
        this.findUser(val);
      },
      deep: true
    }
  }
};
</script>


<style lang="less">
.organiDialog {
  width: 600px;
  border-radius: 10px;
  .vlt-edit-btn {
    margin-left: 110px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    border-top: none;
  }
}
.info-bd {
  padding: 10px 10px 0 15px;
  border-left: 1px solid #e8eaec;
  margin-left: 0;
  .departmentinfo {
    margin: 20px 0;
  }
}
.organi-left{
  width: 330px !important;
  transition: width 0.3s ease-in 0s;
  .organi-btn{
    position: relative;
    .menu-collapse{
      position: absolute;
      right: 10px;
      top: 5px;
      cursor: pointer;
      color: #666;
      transition: transform 0.3s ease-in 0s;
      
    }
  }
  &.collapse{
    width: 30px !important;
    .menu-collapse{
      transform: rotate(90deg);
    }
    .control-bar-comp{
      display: none;
    }
    .el-col{
      display: none;
    }
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
  position: initial;
  .organi-tree{
    position: absolute;
    left: 20px;
    top: 70px;
    bottom: 20px;
    font-size: 14px;
    padding-right: 20px;
    width: 320px;
  }
  .el-col-18 {
    width: 100%;
  }
}
</style>
