<template>
  <div class="vlt-card">
    <div class="TerminSearch">
      <search-bar
        ref="searchForm"
        class="search-bar-demo"
        @search="search"
        :options="searchOptions"
        :total="responseData.total"
        labelWidth="6em"
        @change="changeSearch"
        @searchReset="reset"
      >
        <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions"></control-bar>
      </search-bar>
    </div>
    <div class="TerminTabel">
      <el-table :data="responseData.records" border style="width: 100%" ref="print">
      <el-table-column label="序号" width="80" fixed>
        <template slot-scope="scope">
        {{responseData.size*(responseData.current-1)+(scope.$index+1)}}
        </template>
      </el-table-column>
        <!-- <el-table-column type="index" prop="date" label="序号"></el-table-column> -->
        <el-table-column prop="insName" label="机构名称"></el-table-column>
        <!-- <el-table-column prop="channelId" label="编号"></el-table-column> -->
        <el-table-column prop="channelName" label="所属渠道"></el-table-column>
        <el-table-column prop="terminalType" label="终端类型"></el-table-column>
        <el-table-column prop="deviceModel" label="设备型号"></el-table-column>
        <el-table-column prop="terminalCode" label="设备序列号"></el-table-column>
        <el-table-column prop="sendTime" label="发生时间" width="160"></el-table-column>
        <el-table-column prop="eventType" label="事件类型"></el-table-column>
        <el-table-column prop="executeResult" label="执行结果"></el-table-column>
      </el-table>
      <div class="pagintion">
         <table-paging
      position="right"
      :total="responseData.total"
      :currentPage="requestData.page"
      :pageSize="requestData.pageSize"
      @handleSizeChange="pageSizeChange"
      @handleCurrentChange="pageCurrentChange"
    ></table-paging>
      </div>
    </div>
    <send-terminal :isShow="dialogFormVisible" :insData="insData" @hideDia="hideDia"></send-terminal>

    <el-dialog
      title="打印预览"
      :visible.sync="isPrint"
      class="print-fullscreen"
      :fullscreen="true">
      <print :data="printData" @cancel="isPrint=false"></print>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import {mapGetters} from 'vuex'
import { async } from "q";
import moment from 'moment';
import sendTerminal from './sendTermina'
export default {
  name: "TerminalEventControl",
  data() {
    return {
      params: {
        channelId: '',
        channelName: "",
        createBy: 0,
        createTime: "",
        deviceModel: "",
        eventType: 0,
        insId: 0,
        insName: "",
        terminalCode: "",
        terminalType: 0
      },
      dialogFormVisible: false,
      controlOptions: [
        { name: "发送", type: "primary", icon: "s-promotion", permission: 'TerminalEventControl-send' },
        { name: "导出", type: "", icon: "download", permission: 'TerminalEventControl-send' },
        { name: "打印", type: "", icon: "printer", permission: 'TerminalEventControl-send' }
      ],
      searchOptions: [
        {
          title: "所属机构",
          type: "cascader",
          prop: "insId",
          value: '',
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            checkStrictly: true 
          }
        },
        {
          title: "所属渠道",
          type: "select",
          prop: "channelId",
          value: "",
          options: [],
          disabled: true
        },
        {
          title: "终端类型",
          type: "select",
          prop: "terminalType",
          value: "",
          options: [
            {
              label: "全部",
              value: 0
            },
            {
              label: "终端机",
              value: 1
            },
            {
              label: "柜员机",
              value: 2
            }]
        },
        {
          title: "设备型号",
          type: "select",
          prop: "deviceModel",
          value: "",
          options: [],
          disabled: true
        },
        {
          title: "终端编号",
          type: "input",
          prop: "terminalCode",
          value: ""
        },
        {
          title: "事件类型",
          type: "select",
          prop: "eventType",
          value: "",
          options: [
            {label: "重启",value: 0},
            {label: "关机",value: 1},
            {label: "截屏上传",value: 2},
            {label: "日志上传",value: 3}
          ]
        }
      ],
      requestData: {
        page: 1,
        pageSize: 20,
        param:{}
      },
      responseData: {},
      forms:{},
      terminalTypeArr: ['全部','投注终端','柜员机'],
      executeResultArr: ['未发送','已发送'],
      eventTypeArr: ['重启','关机','截屏上传','日志上传','版本回滚'],
      
      isPrint: false,
      printData: {
        title: '终端事件控制列表' ,
        params: {
          page: 1,
          pageSize: 20
        },
        props: [
          {prop:'index', label:'序号',width:''},
          {prop:'insName', label:'机构名称',width:''},
          {prop:'channelName', label:'所属渠道',width:''},
          {prop:'terminalType', label:'终端类型',width:''},
          {prop:'deviceModel', label:'设备型号',width:''},
          {prop:'terminalCode', label:'终端编号',width:''},
          {prop:'sendTime', label:'发生时间',width:''},
          {prop:'eventType', label:'事件类型',width:''},
          {prop:'executeResult', label:'执行结果',width:''}
        ],
        tableData: [],
      }
    };
  },
  components: {
    "send-terminal": sendTerminal
  },
  created () {
    this.getList(this.requestData);
    this.$nextTick(()=> {
      // console.log(this.insData);
    })
  },
  mounted () {
    setTimeout(() => {
      if (this.insData.length) {
        this.$set(this.searchOptions[0], "options", this.insData);
      }
    }, 2000)
  },
  watch: {
    insData: {
      handler(val, oldVal) {
        this.$set(this.searchOptions[0], "options", val);
        // console.log(val);
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['insData'])
  },
  methods: {
    getList(data) {
      const _this = this;
      (async data => {
        let res = await _this.$api.queryTerminalExecuteByPage({ data });
        // console.log(%%,res);
        if (res.code == 0) {
          if (res.data != null) {
            _this.responseData = res.data;
            _this.responseData.records&& _this.responseData.records.forEach(item => {
              if (item.sendTime) {
                item.sendTime = moment(item.sendTime).format('YYYY-MM-DD HH:mm:SS');
              }
              item.terminalType =   _this.terminalTypeArr[item.terminalType];
              item.eventType =   _this.eventTypeArr[item.eventType];
              item.executeResult = _this.executeResultArr[item.executeResult];
            });

            _this.printData.tableData =  _this.responseData.records;
          } else {
            _this.responseData = {}
          }
        }
      })(data);
    },
    changeSearch (val, oldVal) {
      // console.log(val);
      let arrs = Object.keys(val);
      // arrs.every(item => {
      //   if () {}
      // })
      // 改变下拉框的值，获取到insId 和insName
      if(val.insId && val.insId.length) {
        let insObj = {
          insId: val.insId[val.insId.length - 1]
        }
        insObj.insName =  this.$formMethods.getInsArray(insObj.insId,'id', this.insData, 'text')[0]
        if (!this.requestData.param.insId) {
          Object.assign(this.requestData.param, insObj);
          this.getCurrentChannels(insObj.insId);
        } else if (this.requestData.param.insId != insObj.insId) {
          Object.assign(this.requestData.param, insObj);
          // 根据insId获取渠道数据
          this.getCurrentChannels(insObj.insId);
        } else {}
      }
      if (val.channelId) {
        let opts = this.searchOptions[1].options;
        let channelObj = {};
        opts&&opts.forEach(item => {
          if (item.value == val.channelId) {
            channelObj = {
              channelId: val.channelId,
              channelName: item.label
            }
          }
        })
        // console.log('----', this.requestData.param.channelId);
        if (!this.requestData.param.channelId) {
          // console.log(1);
          Object.assign(this.requestData.param, channelObj);
          this.getQueryDeviceModel(channelObj.channelId);
        } else if (this.requestData.param.channelId != val.channelId) {
          // console.log(2);
          Object.assign(this.requestData.param, channelObj);
          this.getQueryDeviceModel(channelObj.channelId);
        }
      }
      if (val.deviceModel) {
        this.requestData.param.deviceModel = val.deviceModel
      }
      if (val.terminalType) {
        this.requestData.param.terminalType = val.terminalType
      }
      if (val.terminalCode) {
        // console.log(val.terminalCode);
        if (val.terminalCode != '') {
          this.requestData.param.terminalCode = val.terminalCode
        } else {
          delete this.requestData.param.terminalCode
        }
      }else {
          delete this.requestData.param.terminalCode
      }
      if (val.eventType) {
        this.requestData.param.eventType = val.eventType
      }
      // console.log('改变后的最后请求参数', this.requestData);
    },
    reset () {
      this.$set(this.searchOptions[1], "options", []);
      this.$set(this.searchOptions[3], "options", []);
      this.$set(this.searchOptions[1], "disabled", true);
      this.$set(this.searchOptions[3], "disabled", true);
      this.requestData.param = {};
    },
    search() {
      // console.log(this.requestData);
      this.requestData.page = 1;
      this.getList(this.requestData);
    }, //搜索按钮
    
    // 根据机构树id获取渠道
     getCurrentChannels(id, channelId) {
      let self = this;
      self.$set(self.searchOptions[1], "options", []);
      // console.log(self.searchOptions[1].options);
      (async id => {
        let res = await self.$api.getCurrentChannels({ data: id });
        if (res && res.code == 0) {
          if (res.data.length) {
            let channelList = res.data;
            let options = [];
            channelList && channelList.forEach(item => {
              options.push({
                label: item.channelAddress,
                value: item.channelId
              });
            });
            self.$set(self.searchOptions[1], "options", options);
            self.$set(self.searchOptions[1], "disabled", false);
          }else {
            self.$set(self.searchOptions[1], "options", []);
            self.$set(self.searchOptions[1], "disabled", true);
          }
          // 清空 数据
          self.$set(self.$refs.searchForm.form, self.searchOptions[1].prop, '');
          self.$set(self.$refs.searchForm.form, self.searchOptions[3].prop, '');
        } else {
          // self.$message.warning(res.msg)
        }
      })(id);
    },
    // 根据渠道获取设备型号
    getQueryDeviceModel (id) {
      let self = this;
      if (id) {
        (async id => {
          console.log(id);
          let res = await self.$api.getQueryDeviceModel({ data: id });
          if (res && res.code == 0) {
            console.log("设备型号------", res.data);
            if (res.data.length) {
              let channelList = res.data;
              let options = [];
              channelList && channelList.forEach(item => {
                options.push({
                  label: item.deviceModel,
                  value: item.deviceModel
                });
              });
              self.$set(this.searchOptions[3], "options", options);
              self.$set(this.searchOptions[3], "disabled", false);
            }else {
              self.$set(this.searchOptions[3], "options", []);
              self.$set(this.searchOptions[3], "disabled", true);
            }
            self.$set(self.$refs.searchForm.form, self.searchOptions[3].prop, '');
          } else {
            // self.$message.warning(res.msg)
          } 
        })(id);
      }
    },
    selectBtn(val) {
      //点击按钮类型
      if (val.name === "发送") {
        this.dialogFormVisible = true;
      } 
      if (val.name === '导出') {
        this.exportExcel()
      }
      if (val.name === '打印') {
        this.isPrint = true;
        this.printData.params.page = this.params.page;
        this.printData.params.pageSize = this.params.pageSize;
        // this.$print(this.$refs.print);
      }
    },
    async exportExcel() {
      console.log(this.requestData);
      // this.requestData = {};
      const data = JSON.parse(JSON.stringify(this.requestData));
      let result = await this.$api.terminalExportExcel({
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
      aLink.setAttribute("download", "终端事件控制信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log("res", result);
    },
    pageSizeChange(val) {
      this.requestData.pageSize = val;
      this.requestData.page = 1;
      this.getList(this.requestData);
      //每页显示条数
      console.log(val);
    },
    pageCurrentChange(val) {
      this.requestData.page = val;
      console.log(this.requestData);
      this.getList(this.requestData);
      //当前显示页数
      console.log(val);
    },
    hideDia (val) {
      if (val == 'true') {
        this.getList(this.requestData);
      }
      this.dialogFormVisible = false;
    } 
  }
};
</script>

<style lang="less" >
.TerminaDialog {
  width: 700px;
  // .el-dialog__header {
  //   padding: 0;
  // }
}
</style>
