<template>
  <div class="vlt-card">
    <panel title="流程审批进度历史" :show="true" style="margin-bottom:15px">
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" border class="table-box">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="审批节点" min-width="150"></el-table-column>
          <el-table-column prop="type" label="处理人" min-width="150">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.assignees" :key="index" class="icon-circle" :class="[item.isExecutor?'green':'grey']">
                {{item.username}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="deleteReason" label="审批操作" min-width="120"></el-table-column>
          <el-table-column prop="comment" label="审批意见" min-width="120"></el-table-column>
          <el-table-column label="耗时" min-width="100">
            <template slot-scope="scope">
              {{countTime(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
          <el-table-column prop="endTime" label="完成时间" min-width="160"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="120" >
            <template slot-scope="scope">
              <span v-if="scope.row.endTime" class="tag tag-blue">已办</span>
              <span v-else class="tag">待处理</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </panel>
    <panel title="实时流程图" :show="true" style="margin-bottom:15px; padding-bottom: 100px">
      <img :src="processImg" alt="">
    </panel>
  </div>
</template>

<script type="text/javascript">
import ajax from "@/utils/ajax.js"

export default {
  name: "",
  data() {
    return {
      tableData: [],
      form: {},
      gameOtherPath: [],
      processImg: '',
      res: '',
    };
  },
  created() {
    // let data = {
    //   id: this.$route.query.id
    // }
    let data = this.$route.query.id;
    this.processImg = `${ajax.baseURL}/act/business/getHighlightImg/${this.$route.query.id}`
    this.getHistoricFlow(data);
    // this.getHighlightImg(data)
  },
  methods: {
    // 耗时
    countTime(val) {
      if(!val.endTime) {
        return ''
      }
      let usedTime = new Date(val.endTime).getTime() - new Date(val.createTime).getTime();
      let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
      let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
      let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
      let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
      let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
      return days + '天' + hours + '时' + minutes + '分';
    },
    // 申请详情-历史
    getHistoricFlow(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getHistoricFlow({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.tableData = res.data;
        } else {

        }
      })(data);
    },
    // 申请详情-流程图
    getHighlightImgs(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getHighlightImg({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.tableData = res.data.records;
        } else {

        }
      })(data);
    },
        // 下载
    async getHighlightImg(val) {
      let formData = new FormData();
      formData.append('filePath', val);
      const res = await this.$api.getHighlightImg({
        data: val,
        responseType: "blob"
      });
      var blob = new Blob([res], {
        type: "image/png"
      });
      // var url = window.URL.createObjectURL(blob);
      // var aLink = document.createElement("a");
      // aLink.style.display = "none";
      // aLink.href = url;
      // aLink.setAttribute("download", val.split('/')[val.split('/').length-1]);
      // document.body.appendChild(aLink);
      // aLink.click();
      // document.body.removeChild(aLink); //下载完成移除元素
      // window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
  }
};
</script>

<style lang="less" scoped>
@import "./less/index.less";
.table-wrap {
  padding: 16px;
}
.tag{
  display: inline-block;
  height: 22px;
  line-height: 20px;
  margin: 2px 4px 2px 0;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-radius: 3px;
  background: #f7f7f7;
  font-size: 12px;
  vertical-align: middle;
  opacity: 1;
  overflow: hidden;
  color: #515a6e;
}
.tag-blue{
  line-height: 20px;
  background: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}
</style>
