<template>
  <!-- 明细 -->
  <div class="vlt-card">
    <panel :show="true"  title="基本信息">
      <base-info :infoList="infoList"></base-info>
    </panel >


    <panel :show="true"  title="条件列表" style="margin-top:20px">
      <condition-settings-detail :targetType="targetType" :conditionDatas="newTableData"></condition-settings-detail>

    <!-- <el-row class="card-table">
      <el-table
        :data="newTableData"
        border
        style="width: 100%"
        class="table-box"
        v-if="responseData.targetType == 1"
      >
      <el-table-column label="序号" width="60px">
        <template slot-scope="scope"> {{scope.row.itemIndex}} </template>
      </el-table-column>
      <el-table-column label="分值设置" prop="conditionScore" width="80px"></el-table-column>
      <el-table-column label="条件关系" prop="chCondRelation" width="80px">
        <template slot-scope="scope">
          {{chCondRelationArr[scope.row.chCondRelation]}}
        </template>
      </el-table-column>

      <el-table-column label="条件因素" prop="conditionName"></el-table-column>
      <el-table-column label="条件值类型"  width="">
        <template slot-scope="scope">
          <p> {{conditionTypeArrs[scope.row.conditionType]}} </p>
      </template>
      </el-table-column>
      <el-table-column label="条件类型关系" prop="relationName" width=""></el-table-column>
      <el-table-column label="条件因素配置" width="">
        <template  slot-scope="scope">
          {{scope.row.conditionTypeName}} 
        </template>
      </el-table-column>
      <el-table-column label="条件设置值" prop="conditionSetValue" width=""></el-table-column>
      <el-table-column label="条件设置值2" prop="conditionSetValue2" width=""></el-table-column>
      </el-table>
      <el-table v-else 
      :data="newTableData"
        border
        style="width: 70%; margin-left: 20px"
        class="table-box">
        <el-table-column label="序号" type="index" width="60px"></el-table-column>
        <el-table-column label="条件设置" prop="conditionValue" width=""></el-table-column>
        <el-table-column label="分值设置" prop="conditionScore" width="150"></el-table-column>
      </el-table>
    </el-row> -->
    </panel>
    <!-- <dialog-form :showForm="showdialog" :formDatas="data2" :rule="rules2" @closeDia="hideDia"></dialog-form> -->
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import conditionSettingsDetail from "@/views/businessManage/channelPerformanceManage/channelAssessment/components/conditionSettingsDetail";
export default {
  name: "indicatorDetail",
  data() {
    return {
      showdialog: false,
      positions: 'right',
      infoList: [
        { title: "指标名称", value: "", prop: "targetName" },
        { title: "指标类别", value: "", prop: "targetType" },
        { title: "考核类型", value: "", prop: "examineType" },
        { title: "考核类别", value: "", prop: "targetCategory" },
        { title: "渠道类型", value: "", prop: "channelType" }
      ],
      tableData: [],
      tableKey2: [
        { label: "条件设置", value: "rownum", width: "80" },
        { label: "分值设置", value: "cardCode", width: "" }
      ],
      data2: [],
      id: "",
      dataList: {},
      responseData: {},
      outData: {},
      targetTypeArr: ['定性考核', '定量考核'],
      targetCategoryArr: [ '大厅管理','大厅维护','业务培训','彩民服务'],
      examineTypeArr:['绩效考核','等级考核'],
      channelTypeArr: ['自营厅','合作厅'],
      newTableData: [],
      conditionTypeArrs: ['字符型', '数值型', '时间型', '真假型' ],
      chCondRelationArr: ['并且', '或者', '无联系'],
      targetType: 0
    };

    // 条件中的真假 真假   0 假  真1
  },
  components: {
    "condition-settings-detail": conditionSettingsDetail
  },
  created() {
    let id = this.$route.query.id;
    if (id) {
      this.id = id;
      this.getInfo(this.id);
    }
  },
  methods: {
    async getInfo(id) {
      const _this = this;
      let res = await _this.$api.channelExamineTargetDetail({ data: id });
      if (res && res.code === 0) {
        console.log(res);
        _this.responseData = res.data;
        this.targetType = res.data.targetType;
        //  1 为定量 2 为定性
        String(this.targetType) === '1' ? this.targetType = 1 : this.targetType = 2;
        console.log(this.targetType);


        _this.infoList.forEach(item => {
          item.value = res.data[item.prop];
          if (item.prop == 'targetType') item.value = _this.targetTypeArr[res.data[item.prop]];
          if (item.prop == 'targetCategory') item.value = _this.targetCategoryArr[res.data[item.prop] - 1];
          if (item.prop == 'examineType') item.value = _this.examineTypeArr[res.data[item.prop]];
          if (item.prop == 'channelType') item.value = _this.channelTypeArr[res.data[item.prop]];
        });
        // console.log(_this.responseData.targetConditionInfoList);
        let arrs = _this.responseData.targetConditionInfoList;
        for(let i = 0; i < arrs.length; i++){

        }
          this.newTableData =  [...new Set(_this.responseData.targetConditionInfoList)]
        // _this.responseData.targetConditionInfoList.forEach((item, aIndex) => {

        //   if (item.targetType == 1) {
        //     item.conditionSetList&&item.conditionSetList.forEach(ele => {
        //       // console.log(1, aIndex);
        //       _this.newTableData.push({
        //         itemIndex: aIndex + 1 + '',
        //         serialNo: ele.serialNo,
        //         conditionScore: item.conditionScore,
        //         conditionSetValue: ele.conditionSetValue,
        //         conditionSetValue2: ele.conditionSetValue2,
        //         chCondRelation: ele.chCondRelation,
        //         conditionType: ele.conditionType,
        //         conditionName: ele.conditionName,
        //         conditionTypeName: ele.conditionTypeName,
        //         relationName: ele.relationName
        //       })
        //     })
        //   } else {
        //     _this.positions = 'left';
        //     _this.newTableData.push({
        //       serialNo: item.serialNo,
        //       conditionValue: item.conditionValue,
        //       conditionScore: item.conditionScore
        //     })
        //   }
        // })
        console.log(_this.newTableData);
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.card-table {
  margin-top: 20px;
}
</style>
