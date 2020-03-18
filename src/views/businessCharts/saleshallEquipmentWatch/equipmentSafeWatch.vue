<template>
  <div class="vlt-card">
    <el-tabs v-model="activeName">
      <el-tab-pane label="进程监控" name="first">
        <section class="comp-item">
           、、<search-bar  :showHandler='true' 
            ref="searchForm"
            class="search-bar-demo"
            @search="searchCourse"
            :options="searchOptionsCourse"
            :total="totalCountCourse"
            labelWidth="80px"
          >
            <control-bar
              @select="selectCourse"
              slot="extend-bar"
              :options="controlOptionsCourse"
              position="left"
            ></control-bar>
          </search-bar>
        </section>
        <div class="tab-container">
          <el-table
            :data="tableDataCourse"
            border
            style="width: 100%"
            :header-cell-style="{background:'rgba(240,240,240,.5)'}"
            :cell-style="{align:'center'}"
            fit
          >
            <el-table-column align="center" label="序号" min-width="65">
              <template slot-scope="scope">
                <div style="text-align:center;">{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="terminalNo" min-width="85" label="设备编码" ></el-table-column>
            <el-table-column align="center" prop="hallName" min-width="85" label="销售厅" ></el-table-column>
            <el-table-column align="center" prop="cityName" label="城市" ></el-table-column>
            <el-table-column align="center" prop="provinceName" label="省份" ></el-table-column>
            <el-table-column align="center" prop="threadName" min-width='120' label="异常进程名称" ></el-table-column>
            <el-table-column align="center" prop="threadId" min-width='120' label="异常进程ID" ></el-table-column>
            <el-table-column align="center" prop="startTime" label="启动时间" min-width="180"></el-table-column>
            <el-table-column
              label="操作"
              class-name="peripheralStatus"
              fixed="right"
              align="center"
            >
              <template slot-scope="scope">
                <span type="primary" @click="closeThread(scope.row)" size="mini">关闭进程</span>
              </template>
            </el-table-column>
          </el-table>
          <table-paging            
            :current-page="courseListQuery.pageNum"
            :page-size="20"
            :total="totalCountCourse"
            @handleSizeChange="pageSizeChangeCourse"
            @handleCurrentChange="pageCurrentChangeCourse"
          ></table-paging>
        </div>
      </el-tab-pane>
      <el-tab-pane label="事件监控" name="second">
         <search-bar  :showHandler='true' 
          ref="searchForm"
          class="search-bar-demo"
          @search="searchEvent"
          :options="searchOptionsEvent"
          :total="totalCountEvent"
          labelWidth="80px"
        >
          <control-bar
            @select="selectBtnEvent"
            slot="extend-bar"
            :options="controlOptionsEvent"
            position="left"
          ></control-bar>
        </search-bar>
        <el-table
          :data="tableDataEvent"
          border
          style="width: 100%"
          :header-cell-style="{background:'rgba(240,240,240,.5)'}"
          :cell-style="{align:'center'}"
        >
          <el-table-column align="center" label="序号" min-width="65">
            <template slot-scope="scope">
              <div style="text-align:center;">{{scope.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="terminalNo" min-width="85" label="设备编码"></el-table-column>
          <el-table-column align="center" prop="hallName" min-width="85" label="销售厅"></el-table-column>
          <el-table-column align="center" prop="cityName" label="城市"></el-table-column>
          <el-table-column align="center" prop="provinceName" label="省份"></el-table-column>
          <el-table-column align="center" prop="eventType" label="事件编码">
          </el-table-column>
          <el-table-column align="center" prop="eventStatusDetail" min-width="85" label="事件类型">      
          </el-table-column>
          <el-table-column align="center" prop="openLockTime" min-width='160' label="时间"></el-table-column>
        </el-table>
        <table-paging         
          :current-page="eventListQuery.pageNum"
          :page-size="20"
          :total="totalCountEvent"
          @handleSizeChange="pageSizeChangeEvent"
          @handleCurrentChange="pageCurrentChangeEvent"
        ></table-paging>
      </el-tab-pane>
      <el-tab-pane label="位置监控" name="third">
         <search-bar  :showHandler='true' 
          ref="searchForm"
          class="search-bar-demo"
          @search="searchLocation"
          :options="searchLocationLocation"
          :total="totalCountLocation"
          labelWidth="80px"
        >
          <control-bar
            @select="selectBtnLocation"
            slot="extend-bar"
            :options="controlOptionsLocation"
            position="left"
          ></control-bar>
        </search-bar>
        <el-table
          :data="tableDataLocation"
          border
          style="width: 100%"
          :header-cell-style="{background:'rgba(240,240,240,.5)'}"
          :cell-style="{align:'center'}"
        >
          <el-table-column align="center" label="序号" width="65">
            <template slot-scope="scope">
              <div style="text-align:center;">{{scope.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="terminalNo"  label="设备编码"></el-table-column>
          <el-table-column align="center" prop="hallName"  label="销售厅"></el-table-column>
          <el-table-column align="center" prop="cityName"  label="城市"></el-table-column>
          <el-table-column align="center" prop="provinceName"   label="省份"></el-table-column>
          <el-table-column align="center" prop="sourceLocation" label="原位置">
            <el-table-column prop="sourceLongitude" align="center"  label="经度"></el-table-column>
            <el-table-column prop="sourceLatitude" align="center"  label="纬度"></el-table-column>
          </el-table-column>
          <el-table-column align="center" prop="currentLocation" label="当前位置">
            <el-table-column prop="currentLongitude" align="center"  label="经度"></el-table-column>
            <el-table-column prop="currentLatitude" align="center"  label="纬度"></el-table-column>
          </el-table-column>
          <el-table-column align="center" prop="exceptionTime"  min-width='180' label="异常时间"></el-table-column>
        </el-table>
        <table-paging         
          :current-page="gpsListQuery.pageNum"
          :page-size="20"
          :total="totalCountLocation"
          @handleSizeChange="pageSizeChangeLocation"
          @handleCurrentChange="pageCurrentChangeLocation"
        ></table-paging>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    const self = this;
    return {
      courseInsId: null,//进程机构id
      courseHallId: null,//进程销售厅id
      eventInsId: null,//事件机构id
      eventHallId: null,//事件销售厅id
      positionInsId: null,//位置机构id
      positionHallId: null,//位置销售厅id
      timeName:null,//定时器
      //进程搜索参数配置
      searchOptionsCourse: [  
        {
          type: "cascader",
          prop: "area",
          value: '',
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text", checkStrictly: true },
          change(val) {
            self.getCourseInsId(val);
          }
        },
        {
          type: "select",
          prop: "hallId",
          value: "",
          title: "销售厅",
          placeholder: "请选择",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ],
          change(val) {
            self.getCourseHallId(val);
          }
        },
         {
          type: "select",
          prop: "terminalId",
          value: "",
          title: "设备编码",
          placeholder: "请选择",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ],
        },
      ],
      //事件搜索参数配置
      searchOptionsEvent: [
        // { title: "所在区域", type: "input", prop: "areaName", value: "",disabled: true },
        {
          type: "cascader",
          prop: "area",
          value: '',
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text", checkStrictly: true },
          change(val) {
            self.getDoorLockInsId(val);
          }
        },
        {
          type: "select",
          prop: "hallId",
          value: "",
          title: "销售厅",
          placeholder: "请选择",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ],
          change(val) {
            self.getDoorLockHallId(val);
          }
        },
         {
          type: "select",
          prop: "terminalId",
          value: "",
          title: "设备编码",
          placeholder: "请选择",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ],
        },
      ],
      //位置搜索参数配置
      searchLocationLocation: [
        // { title: "所在区域", type: "input", prop: "areaName", value: "",disabled: true },
        {
          type: "cascader",
          prop: "area",
          value: '',
          title: "所在区域",
          options: [],
          setProps: { value: "id", label: "text", checkStrictly: true },
          change(val) {
            self.getPositionInsId(val);
          }
        },
        {
          type: "select",
          prop: "hallId",
          value: "",
          title: "销售厅",
          placeholder: "请选择",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ],
          change(val) {
            self.getPositionHallId(val);
          }
        },
         {
          type: "select",
          prop: "terminalId",
          value: "",
          title: "设备编码",
          placeholder: "请选择",
          options: [
            {
              label: "选项1",
              value: 1
            },
            {
              label: "选项2",
              value: 2
            }
          ],
        },
      ],
      //进程按钮参数配置
      controlOptionsCourse: [{ name: "导出", type: "primary", icon: "download",permission: "thread-export"  }],
      //事件按钮参数配置
      controlOptionsEvent: [{ name: "导出", type: "primary", icon: "download",permission: "event-export" }],
      //位置按钮参数配置
      controlOptionsLocation: [{ name: "导出", type: "primary", icon: "download",permission: "position-export" }],
      activeName: "first",//标签页默认显示第一页(进程)
      totalCountCourse: 0,//进程表格总条数
      totalCountEvent: 0,//事件表格总条数
      totalCountLocation: 0,//位置表格总条数
      tableDataCourse: [],//进程接收表格数据数组
      tableDataEvent: [],//事件接收表格数据数组
      tableDataLocation: [],//位置接收表格数据数组
      //进程搜索请求参数
      courseListQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      //事件搜索请求参数
      eventListQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      },
      //位置搜索请求参数
      gpsListQuery: {
        pageNum: 1,
        pageSize: 20,
        param: {}
      }
    };
  },
  methods: {
    //获取进程监控销售厅id
    getCourseHallId(val) {
      this.courseHallId = val;
    },
     //获取进程监控区域id
    getCourseInsId(val) {
      this.courseInsId = val
        ? val[val.length - 1] == 0
          ? val[val.length - 2]
          : val[val.length - 1]
        : "";
        //4表示查进程的销售厅和终端信息
        this.getTerminaList(4, this.courseInsId )
        this.getHallList(4, this.courseInsId )
    },
    //获取事件监控销售厅id
    getDoorLockHallId(val) {
      this.eventHallId = val;
    },
    //获取事件监控区域id
    getDoorLockInsId(val) {
      this.eventInsId = val
        ? val[val.length - 1] == 0
          ? val[val.length - 2]
          : val[val.length - 1]
        : "";
        //5表示查事件的销售厅和终端信息
        this.getTerminaList(5, this.eventInsId )
        this.getHallList(5, this.eventInsId )
    },
    //获取位置监控销售厅id
    getPositionHallId(val) {
      this.positionInsId = val;
    },
    //获取位置监控区域id
    getPositionInsId(val) {
      this.positionInsId = val
        ? val[val.length - 1] == 0
          ? val[val.length - 2]
          : val[val.length - 1]
        : "";
          //6表示查位置的销售厅和终端信息
        this.getTerminaList(6,this.positionInsId)
        this.getHallList(6,this.positionInsId)
    },
    //进程监控查询
    searchCourse(form) {
      this.courseListQuery.pageNum = 1;
      this.courseListQuery.param = {
        insId: form.area
          ? form.area[form.area.length - 1] == 0
            ? form.area[form.area.length - 2]
            : form.area[form.area.length - 1]
          : "",
        hallId: form.hallId,
        terminalId:form.terminalId
      };
      this.getExceptionThreadList(1);
    },
    //进程监控导出按钮
    selectCourse(val) {
      if (val.name === "导出") {
        this.exportExcel(4);
      }
    },
    //4.导出进程监控记录5.导出门锁监控记录6.导出位置监控记录
    async exportExcel(type) {
      var param = null;
      var name = null;
      if (type == 4) {
        param = {
          hallId: this.courseHallId,
          insId: this.courseInsId,
          exportType: 4,
          exportStatus: 1
        };
        name = "销售厅设备进程信息.xls";
      } else if (type == 5) {
        param = {
          hallId: this.eventHallId,
          insId: this.eventInsId,
          exportType: 5,
          exportStatus: 1
        };
        name = "销售厅设备事件信息.xls";
      } else {
        param = {
          hallId: this.positionHallId,
          insId: this.positionInsId,
          exportType: 6,
          exportStatus: 1
        };
        name = "销售厅设备位置信息.xls";
      }
      const res = await this.$api.hallExport({
        data: {
          param: param
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
      aLink.setAttribute("download", name);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
    },
    //进程监控页数改变事件
    pageSizeChangeCourse(pageSize) {
      this.courseListQuery.pageSize = pageSize;
      this.courseListQuery.pageNum = 1;
      this.getExceptionThreadList(1);
    },
     //进程监控页码改变事件
    pageCurrentChangeCourse(currentPage) {
      this.courseListQuery.pageNum = currentPage;
      this.getExceptionThreadList(1);
    },
    //事件监控查询
    searchEvent(form) {
      this.eventListQuery.pageNum = 1;
      this.eventListQuery.param = {
        insId: form.area
          ? form.area[form.area.length - 1] == 0
            ? form.area[form.area.length - 2]
            : form.area[form.area.length - 1]
          : "",
        hallId: form.hallId,
        terminalId:form.terminalId
      };
      this.getEventList(1);
    },
    //事件监控导出按钮
    selectBtnEvent(val) {
      if (val.name === "导出") {
        this.exportExcel(5);
      }
    },
    //事件监控页数改变事件
    pageSizeChangeEvent(pageSize) {
      this.eventListQuery.pageSize = pageSize;
      this.eventListQuery.pageNum = 1;
      this.getEventList(1);
    },
    //事件监控页码改变事件
    pageCurrentChangeEvent(currentPage) {
      this.eventListQuery.pageNum = currentPage;
      this.getEventList(1);
    },
    //
    searchLocation(form) {
      this.gpsListQuery.pageNum = 1;
      this.gpsListQuery.param = {
        insId: form.area
          ? form.area[form.area.length - 1] == 0
            ? form.area[form.area.length - 2]
            : form.area[form.area.length - 1]
          : "",
        hallId: form.hallId,
        terminalId:form.terminalId
      };
      this.getLocationList(1);
    },
    selectBtnLocation(val) {
      if (val.name === "导出") {
        this.exportExcel(6);
      }
    },
    //位置监控页数改变事件
    pageSizeChangeLocation(pageSize) {
      this.gpsListQuery.pageSize = pageSize;
      this.gpsListQuery.pageNum = 1;
      this.getLocationList(1);
    },
    //位置监控页码改变事件
    pageCurrentChangeLocation(currentPage) {
      this.gpsListQuery.pageNum = currentPage;
      this.getLocationList(1);
    },
    //递归绑定机构树
    async queryInsTree() {
      let res = await this.$api.queryInsTree();
      if (res && res.code == 0) {
        this.setLabelAndValue(res.data);
      }
    },

    setLabelAndValue(area) {
      area.forEach(item => {
        if (item.children) {         
          this.setLabelAndValue(item.children);
        }
      });
      this.searchOptionsCourse.forEach(item => {
        if (item.type === "cascader") {
          item.options = area;
        }
      });
      this.searchOptionsEvent.forEach(item => {
        if (item.type === "cascader") {
          item.options = area;
        }
      });
      this.searchLocationLocation.forEach(item => {
        if (item.type === "cascader") {
          item.options = area;
        }
      });
    },
    //获取设备编码下拉框数据(4:进程监控 5:事件监控 6:位置监控)
    async getTerminaList(type,insIdType) {
      var insId = this.$storage.get("userInfo").insId;
      const self = this;    
      var list = [4, 5, 6];
      if(type){
        list=[type]
      }
      list.forEach(async item => {
        const res = await self.$api.getHallList({
          data: {
            hallType: item,
            scopeType: 1,
            insId: insIdType ? insIdType : insId
          }
          
        });
        if (res && res.code == 0) {
          if (item == 4) {
            this.searchOptionsCourse.forEach((item, index) => {
              if (item.prop === "terminalId") {
                res.data.forEach(item => {
                  item.value = item.terminalId;
                  item.label = item.terminalNo;
                });
                item.options = res.data;
              }
            });
          } else if (item == 5) {
            this.searchOptionsEvent.forEach((item, index) => {
              if (item.prop === "terminalId") {
                res.data.forEach(item => {
                  item.value = item.terminalId;
                  item.label = item.terminalNo;
                });
                item.options = res.data;
              }
            });
          } else {
            this.searchLocationLocation.forEach((item, index) => {
              if (item.prop === "terminalId") {
                res.data.forEach(item => {
                  item.value = item.terminalId;
                  item.label = item.terminalNo;
                });
                item.options = res.data;
              }
            });
          }
        }
      });
    },
    //4.进程监控;5.事件监控;6.位置监控
    getHallList(type,insIdType) {
      var insId = this.$storage.get("userInfo").insId;
      const self = this;
      var list = [4, 5, 6];
      if(type){
        list=[type]
      }
      list.forEach(async item => {
        const res = await self.$api.getHallList({
          data: {
            hallType: item,
            scopeType: 0,
            insId: insIdType ? insIdType: insId
          }
        });
        if (res && res.code == 0) {
          if (item == 4) {
            this.searchOptionsCourse.forEach((item, index) => {
              if (item.prop === "hallId") {
                res.data.forEach(item => {
                  item.value = item.hallId;
                  item.label = item.hallName;
                });
                item.options = res.data;
              }
            });
          } else if (item == 5) {
            this.searchOptionsEvent.forEach((item, index) => {
              if (item.prop === "hallId") {
                res.data.forEach(item => {
                  item.value = item.hallId;
                  item.label = item.hallName;
                });
                item.options = res.data;
              }
            });
          } else {
            this.searchLocationLocation.forEach((item, index) => {
              if (item.prop === "hallId") {
                res.data.forEach(item => {
                  item.value = item.hallId;
                  item.label = item.hallName;
                });
                item.options = res.data;
              }
            });
          }
        }
      });
    },
    //获取事件监控列表数据
    async getEventList(type) {
      const self = this;
      const res = await self.$api.getDoorLockList({
        data: this.eventListQuery,
        closeLoading: type!==1
      });
      if (res.data && res.code == 0) {
        res.data.dataList.forEach(item=>{
          if(item.cityName &&item.cityName==item.provinceName){
            item.cityName='省直属'
          }
        })
        this.tableDataEvent = res.data.dataList;
        this.totalCountEvent = res.data.totalRecord;
      }
    },
    //获取进程监控列表数据
    async getExceptionThreadList(type) {
      const self = this;
      const res = await self.$api.getExceptionThreadList({
        data: this.courseListQuery,
        closeLoading: type!==1
      });
      if (res.data && res.code == 0) {
        console.log(res.data)
        res.data.dataList.forEach(item=>{
          if(item.cityName &&item.cityName==item.provinceName){
            item.cityName='省直属'
          }
        })
        this.tableDataCourse = res.data.dataList;
        this.totalCountCourse = res.data.totalRecord;
      }
    },
    //获取位置记录列表数据
    async getLocationList(type) {
      const self = this;
      const res = await self.$api.getLocationList({
        data: this.gpsListQuery,
        closeLoading: type!==1
      });
      if (res.data && res.code == 0) {
        console.log(res)
        res.data.dataList.forEach(item=>{
          if(item.cityName &&item.cityName==item.provinceName){
            item.cityName='省直属'
          }
        })
        this.tableDataLocation = res.data.dataList;
        this.totalCountLocation = res.data.totalRecord;
      }
    },
    //关闭进程
    async closeThread(row) {
      this.$confirm(`确定要关闭该设备的异常进程吗? `, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const self = this;
          const res = await self.$api.closeThread({
            data: {
              terminalId: row.terminalId,
              threadId: row.threadId,
              hallId:row.hallId
            },
            message: "关闭成功"
          });
          if ( res.code == 0) {
            this.getExceptionThreadList(1)
          }
        })
        .catch(() => {});
    },
    //30s刷新数据
    timer(){
      this.timeName=setInterval(v=>{
        this.getHallList();
        this.getTerminaList()
        this.getEventList();
        this.getExceptionThreadList();
        this.getLocationList();
      },30000)
    }
  },
  mounted() {
    this.getHallList();
    this.queryInsTree();
    this.getEventList(1);
    this.getExceptionThreadList(1);
    this.getLocationList(1);
    this.timer()
    this.getTerminaList()
    
  },
  beforeDestroy(){
    clearInterval(this.timeName);
    this.timeName = null;
  }
};
</script>

<style lang="less" scoped>
.main-body .el-table {
  /deep/ td.peripheralStatus > .cell {
    color: blue;
    cursor: pointer;
  }
}
/deep/.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>
