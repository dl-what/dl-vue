<template>
  <div class="vlt-card" style="padding-top:10px;">
    <div class="MemberGrade">
      <el-table ref="multipleTable" :data="MemberGradeTableData" tooltip-effect="dark" border>
        <el-table-column prop="programCode" label="方案编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="programName" label="方案名称"></el-table-column>
        <el-table-column prop="briefIntr" label="方案简介" show-overflow-tooltip></el-table-column>
        <el-table-column prop="effectiveTime" label="生效时间" min-width="100"></el-table-column>
        <!-- <el-table-column prop="programStatus" label="状态" fixed="right">
          <template slot-scope="scope">
            <table-row-status
              statusField="programStatus"
              idField="programId"
              :scope="scope"
              :tableData="MemberGradeTableData"
              :rowName="scope.row.name"
              @change="changeRest"
              :option="{
                'enable': {
                  apiName: 'memberLevelProgramStatusUpdate', 
                  label: '启用',
                  value: 1,
                  permission:'MemberGradeManagement-enable'
                },
                'disable': {
                  apiName: 'memberLevelProgramStatusUpdate',
                  label: '冻结',
                  value: 0,
                  permission:'MemberGradeManagement-disable'
                },
             
              }"
            ></table-row-status>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" min-width="120px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.programStatus"
              v-has="'MemberGradeManagement-switch'"
              @change="changeStatus(scope.row)"
              :active-text="scope.row.programStatus==1?'启用':'冻结'"
              :inactive-value="0"
              :active-value="1"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="handles" label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="lookDetails(scope.row)"
              v-has="'MemberGradeManagement-details'"
              :id="$route.name+'-'+'details-'+scope.$index"
            >查看</el-button>
            <el-button
              type="primary"
              size="mini"
              :id="$route.name+'-'+'edit-'+scope.$index"
              :disabled=" scope.row.programStatus ===0  ? false :true"
              @click="MemberGradeWrite(scope.row)"
              v-has="'MemberGradeManagement-edit'"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagintion"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      dialogFormVisible: false,
      searchOptions: [
        {
          type: "input",
          prop: "MemberGrade",
          value: "",
          title: "方案编号",
          placeholder: "请输入"
        },
        {
          type: "input",
          prop: "MemberName",
          value: "",
          title: "创建人",
          placeholder: "请输入"
        }
      ],
      controlOptions: [{ name: "新建方案", type: "primary", icon: "plus" }],
      MemberGradeTableData: [],
      memberGradeWriteParam: {},
      page: 1,
      pageSize: 10,
      total: 0,
      current: 1,
      searchForm: {}
    };
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    // 修改状态
    memberLevelProgramStatusUpdate(data) {
      const self = this;
      (async data => {
        let res = await self.$api.memberLevelProgramStatusUpdate({ data });
        if (res && res.code == 0) {
          // self.tableData = res.data.records;
          self.$message.success("修改成功");
          // self.getGameTypeList(self.params)
        }
      })(data);
    },
    changeStatus(val) {
      const self = this;
      let text = val.programStatus==1?'启用': '冻结';
      self.$confirm(`此操作将状态变更为${text}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.item = val;
        let data = {
          programId: val.programId,
          programStatus: val.programStatus,
        };
        self.memberLevelProgramStatusUpdate(data);
      }).catch(() => {
        self.$message({
          type: 'warning',
          message: '已取消'
        }); 
        val.programStatus = val.programStatus==1?0:1;         
      });
    },
    init(val) {
      const self = this;
      (async val => {
        let data = {
          page: 1,
          pageSize: 10,
          param: {}
        };
        let reslt = await self.$api.memberLevelProgramPage({ data });
        if (reslt && reslt.code === 0) {
          self.MemberGradeTableData = reslt.data.records;
        }
      })(val);
    },
    changeRest() {
      this.init();
    },

    MemberGradeWrite(val) {
      this.$router.push({
        name: "theNewPlan",
        query: { idstatus: 2, programId: val.programId }
      });
    },
    lookDetails(val) {
      this.$router.push({
        path: "theNewPlanDetails",
        query: { idstatus: 1, programId: val.programId }
      });
    }
  }
};
</script>

<style lang="less">
.MemberGradeManagement {
  width: 574px;
  border-radius: 10px;
}
</style>
