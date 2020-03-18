<template>
  <div class="vlt-card">
    <panel :show="true" title="详细资料" style="margin-bottom: 15px;">
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel :show="true" title="评估记录" style="margin-bottom: 15px;">
      <base-info :infoList="recordsList"></base-info>
    </panel>
    <panel :show="true" title="表格" style="margin-bottom: 15px;">
      <el-table
        ref="tabel"
        :data="tableData"
        tooltip-effect="dark"
        :row-key="getRowKeys"
        @selection-change="selectionChange"
        border
      >
        <el-table-column prop="equitiesId" type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="questionType" label="题目类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <div>{{scope.row.questionType == 0 ? "单选题" : '多选题'}}</div> -->
          </template>
        </el-table-column>
        <el-table-column prop="topicCode" label="题目编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="questionName" label="题目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="questionOptionVoList" label="题目选项" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="topicOption">
              <p
                v-for="(item,i) in scope.row.questionOptionVoList"
                :key="i"
              >{{generateBig_1(Number(i+65))+'.'+item.optionName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="questionOptionVoList" label="选项分值" min-width="100">
          <template slot-scope="scope">
            <div class="topicOption">
              <p
                v-for="(item,i) in scope.row.questionOptionVoList"
                :key="i"
              >{{generateBig_1(Number(i+65))+'.'+item.score}}分</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="topicPoints" label="题目总分" min-width="100">10分</el-table-column>
        <el-table-column prop="topicPoints" label="答题选项" min-width="100">10分</el-table-column>
        <el-table-column prop="topicPoints" label="答题得分" min-width="100">10分</el-table-column>
      </el-table>
    </panel>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      infoList: [
        { title: "会员账户", value: "", prop: "recordId" },
        { title: "会员卡号", value: "", prop: "recordId" },
        { title: "会员等级", value: "", prop: "recordId" },
        { title: "风险等级", value: "", prop: "recordId" },
        { title: "手机号码", value: "", prop: "recordId" },
        { title: "邮箱地址", value: "", prop: "recordId" },
        { title: "真实姓名", value: "", prop: "recordId" },
        { title: "性别", value: "", prop: "recordId" },
        { title: "民族", value: "", prop: "recordId" },
        { title: "地区", value: "", prop: "recordId" },
        { title: "证件类型", value: "", prop: "recordId" },
        { title: "证件号码", value: "", prop: "recordId" },
        { title: "年龄", value: "", prop: "recordId" },
        { title: "地区", value: "", prop: "recordId" },
        { title: "联系地址", value: "", prop: "recordId" },
        { title: "学历", value: "", prop: "recordId" },
        { title: "投注预算", value: "", prop: "recordId" },
        { title: "月可支配收入", value: "", prop: "recordId" },
        { title: "偏好", value: "", prop: "recordId" },
        { title: "标签", value: "", prop: "recordId" },
        { title: "是否实名认证", value: "", prop: "recordId" },
        { title: "账户类型", value: "", prop: "recordId" },
        { title: "账户状态", value: "", prop: "recordId" },
        { title: "会员权益", value: "", prop: "recordId" },
        { title: "注册渠道编号", value: "", prop: "recordId" },
        { title: "客服经理", value: "", prop: "recordId" },
        { title: "注册时间", value: "", prop: "recordId" },
        { title: "更新时间", value: "", prop: "recordId" }
      ],
      recordsList: [
        { title: "评估方案", value: "", prop: "recordId" },
        { title: "风险等级", value: "", prop: "recordId" },
        { title: "总得分", value: "", prop: "recordId" },
        { title: "单选题得分", value: "", prop: "recordId" }
      ],
      tableData: []
    };
  },
  components: {},
  methods: {}
};
</script>

<style lang="less" scoped>
.topicOption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
