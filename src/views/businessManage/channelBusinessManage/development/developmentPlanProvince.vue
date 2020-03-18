<template>
  <div class=" plan-list">
    <search-bar
      class="search-bar-demo"
      @search="search"
      :disabled="isNoAuthority"
      :options="searchOptions"
      :total="getDatas.total"
      labelWidth="6em"
    >
      <control-bar slot="extend-bar" @select="select" :options="controlOptions"></control-bar>
    </search-bar>
    <!-- <el-dropdown @command="exportExcel" class="plan-export-btn">
      <el-button  size="small"> <i class="el-icon-s-promotion"></i>导出</el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command ="now">当页数据</el-dropdown-item>
        <el-dropdown-item command ="all">全部数据</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
    <el-table :data="tableData" border>
      <el-table-column label="序号" fixed type="index" width="60px"></el-table-column>
      <el-table-column label="所属机构" prop="insName" min-width="140px"></el-table-column>
      <el-table-column label="省属自营厅" prop="provinceNewSellingHall" min-width="140px"></el-table-column>
      <el-table-column label="市属自营厅" prop="cityNewSellingHall" min-width="140px"></el-table-column>
      <el-table-column label="省属自营厅投注机" prop="provinceSellingMachine" min-width="150px"></el-table-column>
      <el-table-column label="市属自营厅投注机" prop="citySellingMachine" min-width="150px"></el-table-column>
      <el-table-column label="省属合作厅" prop="provinceCooperationHall" min-width="140px"></el-table-column>
      <el-table-column label="市属合作厅" prop="cityCooperationHall" min-width="140px"></el-table-column>
      <el-table-column label="省属合作厅投注机" prop="provinceCooperationMachine" min-width="150px"></el-table-column>
      <el-table-column label="市属合作厅投注机" prop="cityCooperationMachine" min-width="150px"></el-table-column>
      <el-table-column label="销量计划" prop="salesPlan" min-width="150px"></el-table-column>
      <el-table-column label="发展预算金额（元）" prop="developBudget" min-width="170px">
         <!-- <template slot-scope="scope">
         {{scope.row.developBudget | NumFormat}}
        </template> -->
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="100px"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="120px" align="center">
        <template slot-scope="scope" >
          <el-button :id="'developmentPlanProvince-detail'+scope.$index" v-has="'developmentPlanSum-pDetail'" type="primary" :disabled="scope.row.id ==-1" size="mini" @click="detail(scope.row, 'developmentPlanProvinceDetail')">查看</el-button>
          <el-button :id="'developmentPlanProvince-Approv'+scope.$index" v-has="'developmentPlanSum-Approv'" size="mini" :disabled="scope.row.id ==-1 || scope.row.status == '已通过' || scope.row.flag != 0" @click="approval(scope.row, 'game-permission')">审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="getDatas.total"
      :currentPage="options.page"
      :pageSize="options.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
    </table-paging>
    <approval-dialog :showDia="approvalData" @hideDia="hideDialog"></approval-dialog>
  </div>
</template>

<script type="text/javascript">
import moment from 'moment'
import approvalDialog from './approvalDialog.vue'
export default {
  name: "developmentPlanProvince",
  props: {
    activePage: {
      type: Number
    },
    insData: {
      type: Object
    }
  },
  data() {
    return {
      searchOptions: [
         {title: '计划年份', type: 'year', prop: 'planDate', dateType:'year', value: ''},
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "所属机构",
          options: [],
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
      ],
      controlOptions: [
        {name: '导出当前', type: 'primary', icon: 's-promotion', permission: 'developmentPlanSum-pExportCur' }, 
        {name: '导出全部', type: '', icon: 's-promotion', permission: 'developmentPlanSum-pExportAll' }
      ],
      tableData: [],
      options: {
        page: 1,
        pageSize: 20,
        param: {
          all: false,
          id: 0,
          insId: '',
          insLevel: '',
          planDate: "2019"
        }
      },
      status: ['计划中','已通过', '未通过'],
      approvalData: {
        showApproval: false
      },
      outData: {},
      getDatas: {},
      isNoAuthority: false
    };
  },
  filters: {
    /*
      判读是否带有小数点，有则以num.toLocaleString()的方式实现。
      没有小数点，就用正则匹配实现。
    */ 
    NumFormat(num) {
			if(!num) return '0.00';
			let newVal = (num.toString().indexOf ('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      return newVal;
		}
  },
  created() {
    // 获取权限
    // this.getUserInsInfoList()

    // 根据stoage里边存储的个人数据 拿到用户的insId，然后根据id获取到他的下一级的机构信息
    // console.log(storage.get());
    console.log(this.activePage);
    this.getInsData();
    if (this.activePage) {
      this.init();
    }
  },
  methods: {
    init () {
      const fullYear = new Date().getFullYear();
      this.options.param.planDate = fullYear;
      // 搜索里面只查询两级 中心到省级机构
      this.getProvincePlanList(this.options);
    },
    nomarlInit() {
      this.isNoAuthority = true;
      this.$set(this.controlOptions[0], 'disabled', true);
      this.$set(this.controlOptions[1], 'disabled', true);
    },

    getProvincePlanList(data) {
      const self = this;
      (async data => {
        console.log(data);
        let res = await self.$api.getProvincePlanList({ data });
        if (res && res.code == 0) {
            self.getDatas = res.data;
          if (res.data.records && res.data.records.length > 0) {
            res.data.records.forEach((item)=>{
              item.developBudget = this.$common.thousandMark(item.developBudget*100)
            })
            self.tableData = res.data.records;
          } else {
            self.tableData = []
          }
        } else {
          self.nomarlInit();
          // self.$message.warning(res.msg)
        }
      })(data);
    },

    search(form) {
      if (!this.isNoAuthority) {
        if ( Object.keys(form).length) {
          // 请求数据修改格式
            if(!form.planDate) {
            form.planDate = new Date().getFullYear()
          } else {
            form.planDate = moment(form.planDate).format("YYYY")
          }
          this.options.param = Object.assign(this.options.param, form);
          console.log('form.insId', this.options.param, form.insId);
          if (form.insId && Array.isArray(form.insId)) {     
            this.options.param.insId = form.insId[form.insId.length - 1];
          }
          this.options.page = 1;
        } else {
          this.options= {
              page: 1,
              pageSize: 20,
              param: {
                all: false,
                id: 0,
                insId: "",
                insLevel: 1,
                planDate: new Date().getFullYear()
              }
            }
        }
        this.getProvincePlanList(this.options);
      } else { 
        this.$message({
          message: '您暂无权限访问省属计划汇总页面！',
          type: 'warning'
        });
      }
    },
    select(val) {
      if (val.name == '导出当前') {
        this.exportExcel('now');
      } else if (val.name == '导出全部') {
        this.exportExcel('all');
      }
    },
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          let newData = res.data[0].type == 0 ? res.data[0].children : res.data;

          newData&&newData.forEach(ele => {
            delete ele.children;
          });

          self.$set(self.searchOptions[1], "options", newData);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    // 导出年度发展计划 省级信息

    // 导出年度发展计划信息
    async exportExcel(val, form) {
      this.options.param = Object.assign(this.options.param, form);
        // console.log(val);
        console.log(this.options.param);
      if (val == 'now') {
        // console.log('导出当前数据');
        // planDate 和机构 insId 都是通过筛选出来的 默认 为当前页
        this.outData = {
          page: this.getDatas.current,
          pageSize: this.getDatas.size,
          param: {
            all: false,
            insId: this.options.param.insId,
            // insLevel: 1,
            planDate: this.options.param.planDate
          }
        }
      } else if (val == 'all'){
        this.outData = {
          page: 0,
          pageSize: 0,
          param: {
            all: true,
            insId: this.options.param.insId,
            // insLevel: 1,
            planDate: this.options.param.planDate
          }
        }
      }
      // console.log(this.outData);

      const times = this.$moment().format('YYYYMMDD_HHmmss');
      const data = JSON.parse(JSON.stringify(this.outData));
      let result = await this.$api.exportProvinceDevelopPlanList({
        data,
        responseType: 'blob'
      });
      var blob = new Blob([result.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "年度发展计划列表_"+times+".xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      //console.log("res", result);
    },
    detail (row, name) {
      this.$router.push({
        name: name,
        query: {
          id: row.id
        }
      })
    },
    approval (row, name) {
      console.log(row, name);
      this.approvalData = {
        showApproval: true,
        id: row.id
      } 
    },
    handleSizeChange(val) {
      this.options.pageSize = val;
      if (!this.isNoAuthority) {
        this.getProvincePlanList(this.options)
      }
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.options.page = val;
      if (!this.isNoAuthority) {
        this.getProvincePlanList(this.options)
      }
      console.log(`当前页: ${val}`);
    },
    hideDialog () {
      this.getProvincePlanList(this.options);
    },
  },
  components: {
    'approval-dialog': approvalDialog
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
</style>
