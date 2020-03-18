<template>
  <div class="vlt-card">
    <div class="memberEquity">
      <search-bar :options="memberEquityOptions" :total="total" @search="search" labelWidth="6em">
        <controlBar
          slot="extend-bar"
          @select="memberEquityBtn"
          :options="memberEquityBtnOption"
          position="left"
        ></controlBar>
      </search-bar>
      <el-table ref="memberEquityTable" :data="equitiesList" tooltip-effect="dark" border>
        <el-table-column type="index" label="序号" fixed width="60">
          <template slot-scope="scope">{{pageSize*(page-1)+(scope.$index+1)}}</template>
        </el-table-column>
        <el-table-column prop="rightsName" label="权益名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="icon" label="权益图标">
          <template slot-scope="scope">
            <div class="img">
              <img :src="scope.row.icon" alt srcset />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="briefIntr" label="权益简介" show-overflow-tooltip></el-table-column>
        <el-table-column prop="serviceMode" label="服务方式" min-width="100">
          <template slot-scope="scope">{{typeChange(scope.row.serviceMode)}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150"></el-table-column>
        <el-table-column prop="rightsStatus" label="状态" min-width="170" fixed="right">
          <template slot-scope="scope">
            <table-row-status
              statusField="rightsStatus"
              idField="rightsId"
              :scope="scope"
              :tableData="equitiesList"
              :rowName="scope.row.name"
              :option="{
                'enable': {
                  apiName: 'memberRightsStatusUpdate', // 接口名称
                  label: '启用', // 按钮文字
                  value: 1,// 接口字段传值
                  permission:'MemberEquityManagement-enable'
                },
                'disable': {
                  apiName: 'memberRightsStatusUpdate',
                  label: '冻结',
                  value: 0,
                  permission:'MemberEquityManagement-disable'
                },
                'logout': {
                  apiName: 'memberRightsStatusUpdate',
                  label: '注销',
                  value: 2,
                  permission:'MemberEquityManagement-logout'
                }
              }"
            ></table-row-status>
          </template>
        </el-table-column>
        <el-table-column prop="handles" label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="memberEquityDetail(scope.row)"
              :id="$route.name+'-details'+scope.$index"
              v-has="'MemberEquityManagement-details'"
            >查看</el-button>
            <el-button
              type
              size="mini"
              :id="$route.name+'-edit'+scope.$index"
              @click="memberEquityWrite(scope.row)"
              v-has="'MemberEquityManagement-edit'"
              :disabled="scope.row.rightsStatus ==0 ?false:true"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table_paging">
        <tablePaging
          class="table_paging_right"
          :total="total"
          :currentPage="current"
          @handleSizeChange="pageSizeChange"
          @handleCurrentChange="pageCurrentChange"
          :pageSize="pageSize"
        ></tablePaging>
      </div>
    </div>
    <!--弹框-->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="850px"
      :close-on-click-modal="false"
      custom-class="intersest-dialo"
      :before-close="close"
    >
      <interstsForm v-model="intersData" ref="inter"></interstsForm>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="closeCancel "
          :id="$route.name+'-'+'cencel'+'create'"
        >{{title=='详情'?'关闭':'取 消'}}</el-button>
        <el-button
          type="primary"
          @click="dialogVisibleSubmit"
          :id="$route.name+'-'+'enter'+'create'"
          v-if="title !== '详情'"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import interstsForm from "./MemberEquityManagementAdd";
import rules from "@/utils/rules.js";
export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      value: false,
      userlist: [],
      memberEquityOptions: [
        {
          type: "input",
          prop: "rightsName",
          value: "",
          title: "权益名称",
          placeholder: "请输入"
        },
        {
          type: "select",
          prop: "rightsStatus",
          value: "",
          title: "状态",
          options: [{ label: "启用", value: 1 }, { label: "冻结", value: 0 }],
          placeholder: "请输入"
        }
      ],
      intersData: {
        intersDataForm: {
          rightsName: null,
          briefIntr: null,
          giveGrowth: 0,
          giveIntegral: 0,
          icon: null,
          serviceMode: 0,
          trialIntegral: null,
          rightsType: null
        },
        trialThresholds: 0,
        disabledStatus: false,
        trialGameValuesList: [],
        dialogVisible: false,
        disabled: false,
        typeId: -1
      },
      title: null,
      equitiesList: [],
      memberEquityBtnOption: [
        {
          name: "添加权益",
          type: "primary",
          icon: "plus",
          permission: "MemberEquityManagement-add"
        }
      ],
      total: 0,
      pageSize: 20,
      current: 1,
      page: 1,
      searchForm: {},
      rightsId: {}
    };
  },
  components: {
    interstsForm
  },
  created() {
    this.init();
  },
  methods: {
    init(val) {
      (async val => {
        let data = {
          page: val || 1,
          pageSize: this.pageSize,
          param: {
            ...this.searchForm
          }
        };
        let res = await this.$api.memberRightsPage({ data });
        if (res && res.code === 0) {
          this.equitiesList = res.data.records;
          this.total = res.data.total;
          this.page = res.data.current;
        }
      })(val);
    },
    search(val) {
      this.searchForm = { ...val };
      this.init();
    },
    close(done) {
      done();
      this.$refs.inter.imgList = [];
    },
    closeCancel() {
      this.$refs.inter.imgList = [];
      this.dialogVisible = false;
    },
    dialogVisibleSubmit() {
      if (this.title === "编辑") {
        let data = {
          ...this.intersData.intersDataForm,
          rightsId: this.rightsId.rightsId
        };
        data.giveGrowth = Number(data.giveGrowth);
        data.trialThresholds = this.intersData.trialThresholds;

        if (this.intersData.typeId == 1) {
          let list = JSON.parse(
            JSON.stringify(this.intersData.trialGameValuesList)
          );
          list.forEach(item => {
            item.trialValue = item.trialValue * 100;
          });

          data.trialGameValuesList = [...list];
          let check = false;

          data.trialGameValuesList.forEach(item => {
            if (!item.trialValue) {
              check = true;
            }
          });

          if (check) {
            this.$message.warning("游戏点数不能为空");
            return;
          }
          let check2 = false;
          if (data.trialThresholds == 1) {
            if (!data.trialIntegral) {
              this.$message.warning("积分不能为空");
              return;
            } else {
              if (data.trialIntegral < 100) {
                this.$message.warning("试玩积分不能少于100");
                return;
              } else {
                data.trialIntegral = Number(data.trialIntegral);
              }
            }
          } else {
            data.trialIntegral = 0;
          }
        }

        (async () => {
          let res = await this.$api.memberRightsUpdate({
            message: "权益修改成功",
            data
          });
          if (res && res.code === 0) {
            this.init(this.current);
            this.dialogVisible = false;
            this.$refs.inter.imgList = [];
          }
        })();
      } else {
        this.dialogVisible = false;
      }
    },
    typeChange(val) {
      let option = {
        0: "系统",
        1: "线下"
      };
      return option[val];
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.init();
    },
    pageCurrentChange(page) {
      this.current = page;
      this.init(page);
    },
    memberEquityBtn(val) {
      if (val.name == "添加权益") {
        this.$router.push({ path: "navigationShow" });
      }
    },
    memberEquityDetail(row) {
      this.intersData.typeId = 0;
      this.title = "详情";
      this.intersData.disabledStatus = true;
      if (row.rightsName === "游戏试玩权益") {
        this.intersData.typeId = 1;
      }
      if (row.rightsName === "积分奖励权益") {
        this.intersData.typeId = 2;
      }
      if (row.rightsName === "积分兑换权益") {
        this.intersData.typeId = 3;
      }
      this.getRightDetials(row.rightsId);
      this.dialogVisible = true;
    },
    memberEquityWrite(val) {
      this.intersData.typeId = 0;
      this.title = "编辑";
      this.rightsId = val;
      this.intersData.disabledStatus = false;
      if (val.rightsName === "游戏试玩权益") {
        this.intersData.typeId = 1;
      }
      if (val.rightsName === "积分奖励权益") {
        this.intersData.typeId = 2;
      }
      if (val.rightsName === "积分兑换权益") {
        this.intersData.typeId = 3;
      }
      this.getRightDetials(val.rightsId);
      this.dialogVisible = true;
    },
    getRightDetials(id) {
      (async () => {
        let res = await this.$api.memberRightsDetails({ data: id });
        if (res && res.code === 0) {
          this.intersData.trialThresholds = res.data.trialThresholds;
          let list = JSON.parse(JSON.stringify(res.data.trialGameValuesList));
          list.forEach(item => {
            item.trialValue = item.trialValue / 100;
          });
          this.intersData.trialGameValuesList = list;
          this.eventBus.$emit("url", res.data.icon);
          for (let key in this.intersData.intersDataForm) {
            this.intersData.intersDataForm[key] = res.data[key];
            if (key === "icon") {
              this.$refs.inter.imgList.push({ filePath: res.data[key] });
            }
          }
        }
      })();
    }
  }
};
</script>

<style lang="less" scoped>
.img {
  padding-top: 4px;
  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
