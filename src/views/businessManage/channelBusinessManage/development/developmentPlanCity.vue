<template>
  <div >
    <search-bar class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="getDatas.total"
      :disabled="isNoAuthority"
      labelWidth="6em">
      <control-bar slot="extend-bar" @select="select" :options="options"></control-bar>
    </search-bar> 
    <el-table :data="tableData" border>
      <el-table-column label="序号" fixed type="index" width="60px"></el-table-column>
      <el-table-column label="所属机构" prop="insName" min-width="140px"></el-table-column>
      <el-table-column label="市属自营厅" prop="cityNewSellingHall" min-width="140px"></el-table-column>
      <el-table-column label="市属自营厅投注机" prop="citySellingMachine" min-width="150px"></el-table-column>
      <el-table-column label="市属合作厅" prop="cityCooperationHall" min-width="140px"></el-table-column>
      <el-table-column label="市属合作厅投注机" prop="cityCooperationMachine" min-width="150px"></el-table-column>
      <el-table-column label="销量计划" prop="salesPlan" min-width="150px"></el-table-column>
      <el-table-column label="发展预算金额（元）" prop="developBudget" min-width="150px">
        <!-- <template slot-scope="scope">
         {{scope.row.developBudget | NumFormat}}
        </template> -->
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="120px"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="100" align="center">
        <template slot-scope="scope">
          <el-button :id="'developmentPlanCity-detail'+scope.$index" v-has="'developmentPlanSum-cDetail'" type="primary"  v-if="scope.row.id !=-1" size="mini" @click="detail(scope.row, 'developmentPlanCityDetail')">查看</el-button>
          <!-- <el-button size="mini" @click="detail(scope.row, 'game-permission')">编辑</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <table-paging
      position="right"
      :total="getDatas.total"
      :currentPage="requestOptions.page"
      :pageSize="requestOptions.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange">
    </table-paging>
  </div>
</template>

<script type="text/javascript">
import moment from 'moment'
export default {
  name: "developmentPlanCity",
  props: {
    activePage: {
      tyep: Number
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
          type: "cascader", prop: "insId", value: "", title: "所属机构", options: [],
          setProps: { label: "text", value: "id", children: "children",  } // multiple: true, // 多选 checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
        },
      ],
      options: [
        {name: '导出当前', type: 'primary', icon: 's-promotion', permission: 'developmentPlanSum-cExportCur', disabled: false}, 
        {name: '导出全部', type: '', icon: 's-promotion', permission: 'developmentPlanSum-cExportAll', disabled: false}
      ],
      tableData: [],
      requestOptions: {
        page: 1,
        pageSize: 20,
        param: {
          all: false,
          id: 0,
          insId: '',
          insLevel: '',
          planDate: new Date().getFullYear()
        }
      },
      status: ['计划中','已通过'],
      outData: {},
      getDatas: {},
      isNoAuthority: false,
      actived: null
    }
  },
  watch: {
    activePage: {
      handler (newVal, oldVal) {
        this.actived = newVal;
        console.log(this.actived);
        if (this.actived == 2) {
          this.init();
          this.nomarlInit(false);
        } else {
          this.nomarlInit(true);
        }
      },
      deep: true,
      immediate: true
    }
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
    // 权限配置
    // this.getUserInsInfoList();
    this.getInsData();
  },
  methods: {
    init () {
      // 搜索里面只查询该用户市级机构
      const fullYear = new Date().getFullYear();
      this.requestOptions.param.planDate = fullYear;
      this.requestOptions.param.insId = this.insData.insId;
      this.requestOptions.param.insLevel= this.insData.type;
      this.getCityPlanList(this.requestOptions);
    },
    nomarlInit (isBool) {
      this.isNoAuthority = isBool;
      this.$set(this.options[0], 'disabled', isBool);
      this.$set(this.options[1], 'disabled', isBool);
    },
    select(val) {
      if (val.name == '导出当前') {
        this.exportExcel('now');
      } else if (val.name == '导出全部') {
        this.exportExcel('all');
      }
    },
    search(form) {
      if (!this.isNoAuthority) {
        // 请求数据修改格式
        console.log(form,  Object.keys(form).length);
        if ( Object.keys(form).length) {
          this.requestOptions.param = Object.assign(this.requestOptions.param, form);

          if (form.insId && Array.isArray(form.insId)) {     
            this.requestOptions.param.insId = form.insId[form.insId.length - 1];
            this.requestOptions.param.insLevel= 2;
          } else {
            this.requestOptions.param.insLevel= this.insData.type;
          }
          // 请求数据修改格式
          if(form.planDate != null) {
            this.requestOptions.param.planDate = moment(form.planDate).format("YYYY")
            console.log(1);
          } else {
            console.log(2);
            this.requestOptions.param.planDate = new Date().getFullYear();
          }
          this.requestOptions.page = 1;
        } else {
          this.requestOptions = {
              page: 1,
              pageSize: 20,
              param: {
                all: false,
                id: 0,
                insId:  this.insData.insId,
                insLevel: this.insData.type,
                planDate: new Date().getFullYear()
              }
            }
          console.log(11, this.requestOptions, this.insData);
        }
        console.log(this.requestOptions);
        this.getCityPlanList(this.requestOptions)
      } else {
        this.$message({
          message: '您暂无权限访问省属计划汇总页面！',
          type: 'warning'
        });
      }
    },
    getCityPlanList(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getCityPlanList({data})
				if(res && res.code == 0) {
            self.getDatas = res.data;
          if (res.data.records && res.data.records.length > 0) {
            console.log(res);
            res.data.records.forEach((item)=>{
              item.developBudget = this.$common.thousandMark(item.developBudget*100)
            })
              self.tableData = res.data.records;
              self.tableData&&self.tableData.forEach(item => {
                if (item.id == -1) {
                  item.status = ''
                }
              }) 
          } else {
            self.tableData = []
          }
				} else {
          self.nomarlInit (true)
        }
      })(data)
    },
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          let newData = res.data;
          self.$set(self.searchOptions[1], "options", newData);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    //  导出年度发展计划市级信息

    async exportExcel(val) {
      if (val == 'now') {
        console.log('导出当前数据');
        // planDate 和机构 insId 都是通过筛选出来的 默认 为当前年份和机构 后续更改 
        this.outData = {
          page: this.getDatas.current,
          pageSize: this.getDatas.size,
          param: {
            all: false,
            insId: this.requestOptions.param.insId,
            insLevel: this.requestOptions.param.insLevel,
            planDate: this.requestOptions.param.planDate
          }
        }
      } else if (val == 'all'){
        this.outData = {
          page: 0,
          pageSize: 0,
          param: {
            all: true,
            insId: this.requestOptions.param.insId,
            insLevel: this.requestOptions.param.insLevel,
            planDate: this.requestOptions.param.planDate
          }
        }
      }

      const times = this.$moment().format('YYYYMMDD_HHmmss');
      const data = JSON.parse(JSON.stringify(this.outData));
      let result = await this.$api.exportCityDevelopPlanList({
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
    changeForm(val) {
      console.log(val);
    },
    detail (row, name) {
      this.$router.push({
        name: name,
        query: {
          id: row.id
        }
      })
    },
    handleSizeChange(val) {
      if (!this.isNoAuthority) {
        this.requestOptions.pageSize = val;
        this.getCityPlanList(this.requestOptions);
        console.log(`每页 ${val} 条`);
      }
    },
    handleCurrentChange(val) {
      if (!this.isNoAuthority) {
        // console.log(`当前页: ${val}`);
        this.requestOptions.page = val;
        // console.log(this.requestOptions);
        this.getCityPlanList(this.requestOptions)
      }
    },
  },
}
</script>

<style lang="less" scoped>
@import '../less/index.less';
</style>
