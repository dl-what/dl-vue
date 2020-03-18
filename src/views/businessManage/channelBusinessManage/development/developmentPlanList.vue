<template>
  <div class="vlt-card plan-list">
    <control-bar slot="extend-bar" @select="select" :options="options"></control-bar>
    <!-- {{insDatas.insLevel}} -->
    <el-table :data="tableData" border>
      <el-table-column label="序号" fixed type="index" width="60px"></el-table-column>
      <el-table-column label="计划年份" prop="planDate" min-width="160px"></el-table-column>
      <el-table-column label="省属自营厅" prop="provinceNewSellingHall" min-width="140px" v-if="insDatas.insLevel!=2"></el-table-column>
      <el-table-column label="市属自营厅" prop="cityNewSellingHall" min-width="140px"></el-table-column>
      <el-table-column label="省属自营厅投注机" prop="provinceSellingMachine" min-width="150px" v-if="insDatas.insLevel!=2"></el-table-column>
      <el-table-column label="市属自营厅投注机" prop="citySellingMachine" min-width="150px"></el-table-column>
      <!-- 如果查询的是市属数据，那就隐藏下边两调省属数据 -->
      <el-table-column label="省属合作厅" prop="provinceCooperationHall" min-width="140px" v-if="insDatas.insLevel!=2"></el-table-column>
      <el-table-column label="市属合作厅" prop="cityCooperationHall" min-width="140px"></el-table-column>
      <el-table-column label="省属合作厅投注机" prop="provinceCooperationMachine" min-width="150px" v-if="insDatas.insLevel!=2"></el-table-column>
      <el-table-column label="市属合作厅投注机" prop="cityCooperationMachine" min-width="150px"></el-table-column>
      <el-table-column label="销量计划" prop="salesPlan" min-width="150px"></el-table-column>
      <el-table-column label="发展预算金额（元）" prop="developBudget" min-width="170px" >
        <!-- <template slot-scope="scope">
         {{scope.row.developBudget | NumFormat}}
        </template> -->
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="140px"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="120px"  >
        <template slot-scope="scope">
          <div style="text-align: left;"> 
            <el-button :id="'developmentPlanList-detail'+scope.$index" v-has="'developmentPlanList-detail'" type="primary" size="mini" @click="detail(scope.row, 'developmentPlanDetail')">查看</el-button>
            <el-button :id="'developmentPlanList-edit'+scope.$index" v-has="'developmentPlanList-edit'" size="mini" v-if="scope.row.status !='已通过'" @click="edit(scope.row, 'developmentPlanEdit')">编辑</el-button>
        </div>
        </template>
      </el-table-column>
    </el-table>
    <table-paging
      position="right"
      :total="getDatas.total"
      :currentPage="requestData.page"
      :pageSize="requestData.pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></table-paging>
  </div>
</template>

<script type="text/javascript">
import { async } from "q";

export default {
  name: "developmentPlanList",
  data() {
    return {
      searchOptions: [],
      options: [
        { name: "新建发展计划", type: "primary", icon: "plus", permission: 'developmentPlanList-new'}, // type为按钮的五种颜色， icon为具体的图标
        { name: "导出当前", type: "", icon: "s-promotion", permission: 'developmentPlanList-exportCur'},
        { name: "导出全部", type: "", icon: "s-promotion", permission: 'developmentPlanList-exportAll'}
      ],
      tableData: [],
      status: ["计划中", "已通过"],
      outData: {},
      getDatas: {},
      requestData: {
        page: 1,
        pageSize: 20,
        param: {}
      },
      insDatas: {
        insId: null,
        insLevel:null // 1为省级 2为市级 类型为数字
      },
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
    // 权限配置
    this.getUserInsInfoList();
    console.log('this.requestData', this.insDatas);
    // 用户所在机构
    if (true) {
      // 省级用户 调省查市接口
      // 市级数据 不能输入
    } else {
      // 市级用户
      // 只需要市级数据  省级不用
    }
  },
  methods: {

     getUserInsInfoList() {
      const _this = this;
      (async data => {
        let res = await _this.$api.getUserInsInfoList({});
        // 返回的data 有0 时 表示有计划列表的权限 那么计划列表的tab显示，反之隐藏，
        // 同理 有一级的时候 则显示省级的数据，市级亦是如此
        if (res.data) {
          _this.insData = res.data;
          console.log('insData ... ',this.insData.type,  this.insData);
          if (_this.insData.type == 1) { // 如果是 0的话 中福彩 显示省级
            _this.insData.type = 1;
            _this.requestData.param.insId = _this.insData.insId;
            _this.requestData.param.insLevel = _this.insData.type;
            _this.insDatas = {
              insId: _this.insData.insId,
              insLevel: _this.insData.type
            }
            _this.getDevelopPlanList(_this.requestData);
          } else if (_this.insData.type == 2 ) {
            _this.insData.type = 2;
            _this.requestData.param.insId = _this.insData.insId;
            _this.requestData.param.insLevel = _this.insData.type;
            _this.insDatas = {
              insId: _this.insData.insId,
              insLevel: _this.insData.type
            }
            _this.getDevelopPlanList(_this.requestData);
        
          } else {
            _this.isNoAuthority = true;
            _this.$set(_this.options[0], 'disabled', true);
            _this.$set(_this.options[1], 'disabled', true);
            _this.$set(_this.options[2], 'disabled', true);
            _this.$message({
              message: '您暂无权限访问计划列表页面！',
              type: 'warning'
            });
          }
        }
      })();
    },
    search(data) {
      if(!this.isNoAuthority) {
        this.getDevelopPlanList(data);
      } else { 
        this.$message({
          message: '您暂无权限访问省属计划汇总页面！',
          type: 'warning'
        });
      }
    },
    getDevelopPlanList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getDevelopPlanList({ data });
        if (res && res.code == 0) {
          if (res.data != null) {
            self.getDatas = res.data;
            res.data.records.forEach((item)=>{
              item.developBudget = this.$common.thousandMark(item.developBudget*100)
            })
            self.tableData = res.data.records
            // .map(item => {
            //   item.status = self.status[item.status];
            //   // item.developBudget = item.developBudget / 100;
            //   return item;
            // });
            console.log(self.getDatas);
          }
        }
      })(data);
    },
    select(val) {
      if (val.name == "新建发展计划") {
        this.$router.push({
          name: "developmentPlanCreate",
          query: {
            ...this.insDatas
          }
        });
      } else if (val.name == "导出当前") {
        this.exportExcel("now");
      } else if (val.name == "导出全部") {
        this.exportExcel("all");
      }
    },

    // 导出年度发展计划信息
    async exportExcel(val) {
      // console.log(val);
      if (val == "now") {
        console.log("导出当前数据");
        this.outData = {
          page: this.getDatas.current,
          pageSize: this.getDatas.size,
          param: {
            all: false,
            ...this.insDatas
          }
        };
      } else if (val == "all") {
        console.log("导出全部数据");
        this.outData = {
          page: 0,
          pageSize: 0,
          param: {
            all: true,
            ...this.insDatas
          }
        };
      }
      
      const times = this.$moment().format('YYYYMMDD_HHmmss');
      const data = JSON.parse(JSON.stringify(this.outData));
      let result = await this.$api.exportDevelopPlanList({
        data,
        responseType: "blob"
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
    detail(row, name) {
      this.$router.push({
        name: name,
        query: {
          id: row.id,
          insLevel: this.insDatas.insLevel // 此数据是省市属的参数 需要根据用户获取， 目前是定值
        }
      });
    },
    edit(row, name) {
      this.$router.push({
        name: name,
        query: {
          id: row.id,
          insLevel: this.insDatas.insLevel // 此数据是省市属的参数 需要根据用户获取， 目前是定值
        }
      });
    },
    handleSizeChange(val) {
      if(!this.isNoAuthority) {
        this.requestData.pageSize = val;
        this.getDevelopPlanList(this.requestData);
        console.log(`每页 ${val} 条`);
      }
    },
    handleCurrentChange(val) {     
      if(!this.isNoAuthority) {
        this.requestData.page = val; 
        this.getDevelopPlanList(this.requestData);
        console.log(`当前页: ${val}`);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
</style>
