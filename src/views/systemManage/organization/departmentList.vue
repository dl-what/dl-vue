<template>
  <div class="vlt-card" style="padding:0">
    <section class="comp-item">
      <panel title="部门信息" :show="true">
        <div class="wrapper">
          <el-table
            ref="singleTable"
            :data="tableList"
            highlight-current-row
            style="width: 100%"
            border>
            <el-table-column type="index" fixed width="55" label="序号">
              <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
            </el-table-column>
            <el-table-column prop="departmentName" label="部门名称" width="120"></el-table-column>
            <el-table-column prop="insName" label="所属机构" width="120"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-has="'organizationChild-Switch'"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.status"
                  @change="switchChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="parentName" label="上级部门"></el-table-column>
            <el-table-column prop="principalName" label="部门负责人" min-width="130"></el-table-column>
            <el-table-column prop="principalMobile" label="负责人电话" min-width="140"></el-table-column>
            <el-table-column prop="address" fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="derparModifine(scope.row)"
                  :id="$route.name+'-edit-'+scope.$index"
                  v-has="'organizationChild-Change'"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="total">
            <table-paging
              :current-page="page"
              :page-size="pageSize"
              :total="total"
              @handleSizeChange="pageSizeChange"
              @handleCurrentChange="pageCurrentChange"
            ></table-paging>
          </div>
        </div>
      </panel>
    </section>
    <el-dialog
      title
      :visible.sync="dialogFormVisible"
      custom-class="organiDialog"
      :close-on-click-modal="false"
    >
      <div class="vlt-edit-single">
        <h2 class="title">更改部门信息</h2>
        <div class="vlt-edit-wrap">
          <el-form :rules="rules2" ref="DepartmentBaseForm" labelWidth="110px">
            <el-form-item label="上级部门" prop="parentId">
              <el-cascader
                :options="departmentOption"
                :props="setProps"
                clearable
                v-model="departmentFrom.parentId"
                :disabled="true"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="部门名称" prop="departmentName">
              <el-input v-model="departmentFrom.departmentName" disabled></el-input>
            </el-form-item>
            <el-form-item label="部门负责人" prop="principal">
              <el-select
                v-model="departmentFrom.principal"
                @change="departmentPrincipal"
                placeholder="请选择"
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
              <el-input v-model="departmentFrom.principalMobile" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="departmentFrom.status"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model.trim="departmentFrom.remark" type="textarea" maxlength="150"></el-input>
            </el-form-item>
          </el-form>
          <el-row class="vlt-edit-btn">
            <el-button
              type="primary"
              v-prevent="1000"
              size="medium"
              @click="DepartmentSubmit"
              :id="$route.name+'-department-submit-'"
            >提 交</el-button>
            <el-button
              size="medium"
              @click="departmenCancel"
              :id="$route.name+'-department-cencel-'"
            >取 消</el-button>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import rules from "@/utils/rules";
export default {
  name: "",
  props: ["id"],
  data() {
    return {
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: true
      },
      rules2: {},
      departmentOption: [],
      departmentFrom: {
        departmentName: "",
        principalMobile: "",
        principal: "",
        status: 1,
        remark: "",
        parentId: ""
      },
      tableList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      current: 1,
      dialogFormVisible: false,
      departmenIfo: {},
      options: [],
      isData: []
    };
  },
  components: {},
  created() {},
  methods: {
    async subsidiaryOrgan(num) {
      let data = {
        param: { insId: this.id },
        pageSize: this.pageSize,
        page: num || 1
      };
      let resl = await this.$api.QueryDeptInfoPage({ data });
      if (resl && resl.code === 0) {
        let obj = JSON.parse(JSON.stringify(resl.data.records));
        this.tableList = obj;
        this.page = data.page;
        this.pageSize = resl.data.size;
        this.total = resl.data.total;
      }
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.subsidiaryOrgan();
    },
    pageCurrentChange(page) {
      this.current = page;
      this.subsidiaryOrgan(page);
    },
    departmentPrincipal(val) {
      let phoneCode = this.isData.filter(item => item.userId === val);
      this.departmentFrom.principalMobile = phoneCode[0].mobile;
    },
    derparModifine(val) {
      (async val => {
        let resl = await this.$api.FindDeptTreeRoots({ data: val.insId });
        if (resl && resl.code === 0) {
          this.departmentOption = resl.data;
        }
      })(val);
      this.getUser(val);
      this.dialogFormVisible = true;
      this.departmenIfo = val;
      for (let key in this.departmentFrom) {
        if (key !== "principal") {
          this.departmentFrom[key] = val[key];
        }
        if (key === "principal") {
          let falg = this.options.some(item => item.value === val[key]);
          if (falg) {
            this.departmentFrom[key] = val[key];
          } else {
            this.departmentFrom[key] = null;
          }
        }
      }
    },
    getUser(val) {
      (async val => {
        let res = await this.$api.QueryAllUserInfo({ data: val.insId });
        this.isData = res.data;
        let option = res.data.map(item => {
          return { label: item.userName, value: item.userId };
        });
        this.options = option;
      })(val);
    },
    switchChange(val) {
      let ifo;
      if (!val.status) {
        ifo = "此操作会冻结此部门，请确认是否冻结此部门？";
      } else {
        ifo = "此操作会解冻结此部门，请确认是否要解冻结此部门？";
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
            val.status = data.status;
            this.$message({
              type: "success",
              message: val.status ? "部门解冻成功!" : "部门冻结成功"
            });
          } else {
            val.status = Number(!val.status);
            this.$message({
              type: "info",
              message: "状态更改失败"
            });
          }
        })
        .catch(() => {
          val.status = Number(!val.status);
          this.$message({
            type: "info",
            message: "取消更改"
          });
        });
    },
    departmenCancel() {
      this.dialogFormVisible = false;
    },
    async DepartmentSubmit() {
      let data = JSON.parse(JSON.stringify(this.departmentFrom));
      data.departmentId = this.departmenIfo.departmentId;
      data.status = Number(data.status);
      let reslt = await this.$api.UpdateDeptInfo({
        message: "更新成功！",
        data
      });
      if (reslt && reslt.code === 0) {
        this.subsidiaryOrgan(this.current);
        this.dialogFormVisible = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.wrapper{
  padding: 10px;
}
</style>
