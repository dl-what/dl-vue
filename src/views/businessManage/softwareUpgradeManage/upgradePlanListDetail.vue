<template>
  <div class="vlt-card">

    <panel :show="true" v-for="(item, index) in listArr" :key="index" :title="index == 0 ?  '全量升级': '增量升级'" style="margin-bottom: 15px;">
      <base-info :infoList="item"></base-info>
    </panel>

    <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" v-if="tableShow==1" >
      <el-table-column label="序号" fixed type="index" width="60"></el-table-column>
      <el-table-column prop="channelNo" label="渠道编号" min-width="120px"></el-table-column>
      <el-table-column prop="serial" label="设备序列号" min-width="160px"></el-table-column>
      <el-table-column prop="status" label="升级状态" min-width="120px">
        <template slot-scope="scope">
          <span
          class="icon-circle"
          :class="{
          blue:scope.row.status=='0',
          green:scope.row.status=='1',
          grey:scope.row.status=='3',
          yellow:scope.row.status=='4',
          red:scope.row.status=='2',
          }"
        >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="160px"></el-table-column>
    </el-table>

    <el-table  border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%; margin-top:50px" @selection-change="handleSelectionChange" v-if="tableShow==2" > 
      <el-table-column label="序号" fixed type="index"></el-table-column>
      <el-table-column prop="userName" label="名称"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span
          class="icon-circle"
          :class="{
          blue:scope.row.status=='0',
          green:scope.row.status=='1',
          grey:scope.row.status=='3',
          yellow:scope.row.status=='4',
          red:scope.row.status=='2',
          }"
        >{{scope.row.strStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
    </el-table>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
export default {
  name: "",
  data() {
    return {
      tableShow: 0,
      tableData: [],
      listArr: [
        [
          { title: "计划名称", value: "", prop: "planName" },
          { title: "软件名称", value: "", prop: "name" }, //
          { title: "版本号", value: "", prop: "versionCode" }, //
          { title: "软件大小", value: "", prop: "softwareSize" }, //
          { title: "软件类型", value: "", prop: "softType" },
          { title: "升级目标", value: "", prop: "targetType" },
          { title: "目标名称", value: "", prop: "targetName" },
          { title: "升级开始时间", value: "", prop: "beginTime" },
          { title: "软件描述", value: "", prop: "remark" }, //
          { title: "新版特性", value: "", prop: "characteristic" }, //
          { title: "更新字段", value: "", prop: "updateField" }, //
          { title: "发布人", value: "", prop: "createByName" },
          { title: "发布时间", value: "", prop: "createTime" },
          { title: "状态", value: "", prop: "status" },
          { title: "升级类型", value: "", prop: "forcedType" },
          { title: "备注", value: "", prop: "remark" }
        ],
      ],
      showInfo2: false
    };
  },
  components: {},
  created() {
    const routerQuery = this.$route.query;
    if (routerQuery && routerQuery.id) {
      let upgradeId = routerQuery.id;
      console.log("data是", upgradeId);
      let data = upgradeId;
      this.upgradeListDetail(data);
    }
  },
  methods: {
    async upgradeListDetail(data) {
      let res = await this.$api.upgradeListDetail({ data });
      if (res && res.code == 0) {
        console.log("查看结果", res);
        if (res.data) {
          let obj = JSON.parse( JSON.stringify(res.data));
          delete obj.upgradeSoftList;
          delete obj.upgradeStatusList;
          obj.planName = obj.name;
          delete obj.name;
          let  softList  = res.data.upgradeSoftList;
          let newList = [];

          if (res.data.softType != 3) {
            console.log(res.data.targetName.slice(1));
            res.data.targetName = res.data.targetName.slice(1);
          } else {
            this.listArr[0].splice(5, 2);
            // console.log(this.listArr[0]);
          }

          let arr = [];
          if (res.data.upgradeSoftList.length > 1) {
            arr = JSON.parse( JSON.stringify(this.listArr[0]));
            this.listArr.push(arr);
          }

          // console.log(obj,res.data);
          softList.forEach (item => {
            console.log(item);
            let arr = Object.assign(item, obj);
            newList.push(arr);
          });

          console.log(newList);
        
          this.listArr.forEach(( i, n) => {
            i.forEach((item, index) => {
              item.value = newList[n][item.prop];
              if (item.prop == 'name') {
                item.value = res.data.upgradeSoftList[n].name;
              }
              if (item.prop == "beginTime" || item.prop == "createTime") {
                item.value = this.translateTime(res.data[item.prop]);
              }
              if (item.prop == "insId") {
                console.log(item.prop);
                item.value = res.data[item.prop].replace(/,/g, '');
              }
              if (item.prop == "targetName") {
                item.value = res.data[item.prop].replace(/,/g, '');
              }
              if (item.prop == "targetType") {
                item.value = this.translateTargetType(res.data[item.prop]);
              }
              if (item.prop == "softType") {
                item.value = this.translateSoftType(res.data[item.prop]);
              }
              if (item.prop == "status") {
                item.value = this.translateStatus(res.data[item.prop]);
              }
              if (item.prop == "forcedType") {
                item.value = this.translateForcedType(res.data[item.prop]);
              }
            })
          });
          let options = { 0: "初始化", 1: "成功", 2: "失败" };
          // console.log(res.data.upgradeStatusList);
          this.tableData =  res.data.upgradeStatusList&&res.data.upgradeStatusList.map((item)=>{
            item.strStatus = options[item.status];
            item.createTime = item.createTime ? this.$moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'): '';
            return item;
          })
          console.log(this.tableData);
          // this.tableData = res.data.upgradeStatusList;
          // this.tableDat&&this.tableData.forEach( item => {
          //   console.log(item.createTime);
          // })

          if (res.data.softType == 1 || res.data.softType == 2) {
            //投注终端和柜员机有表格展示
            this.tableShow = 1;
          } else {
            //维护APP不展示表格
            this.tableShow = 2;
          }

        }
      } else {
        this.$message.warning(res.msg);
      }
    },
    handleSelectionChange() {},
    translateTime(val) {
      return moment(val).format("YYYY-MM-DD HH:mm:ss");
    },
    translateTargetType(val) {
      let options = { 0: "机构", 1: "渠道", 2: "设备" };
      return options[val];
    },
    translateSoftType(val) {
      let options = { 1: "投注终端", 2: "柜员机软件", 3: "维护APP" };
      return options[val];
    },
    translateStatus(val) {
      let options = { 0: "未开始", 1: "升级中", 2: "升级成功", 3: "升级失败", 4: "已推送" };
      return options[val];
    },
    translateForcedType(val) {
      let options = { 0: "强制升级", 1: "空闲升级" };
      return options[val];
    },
    translateUpgradeStatus(val) {
      let options = { 1: "成功", 2: "失败" };
      return options[val];
    },
    handleSelectionChange() {},
    findChange(val, name) {
      let arr = [];
      arr = val.map(item => {
        return item[name];
      });
      console.log(arr);
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
</style>
