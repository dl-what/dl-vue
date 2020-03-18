<template>
  <!-- 考核项设置新增 -->
  <div class="vlt-card">
    <panel :show="true" title="新增考核项" style="margin-bottom: 15px;">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap wrapper">
          <el-form :rules="rules" ref="form" labelWidth="8em" :model="form">
            <el-form-item label="考核名称" prop="name">
              <el-input
                v-model.trim="form.name"
                placeholder="请输入考核名称"
                show-word-limit
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="考核类型" prop="appraisalType">
              <el-select placeholder="请选择考核类型" v-model="form.appraisalType" @change="clearTableList">
                <el-option
                  v-for="item in assessType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="所属机构" prop="insId">
              <el-select placeholder="请选择" v-model="form.insId">
                <el-option
                  v-for="item in insData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="渠道类型" prop="channelType">
              <el-select placeholder="请选择渠道类型" v-model="form.channelType"  @change="clearTableList">
                <el-option
                  v-for="item in channelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生效年月" prop="date">
              <el-date-picker
                type="monthrange"
                v-model="form.date"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                :picker-options="pickOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="考核最高分" prop="highestScore">
              <el-input v-model="form.highestScore" placeholder="自动获取" :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
    <panel :show="true" title="考核指标" style="margin-bottom: 15px;">
      <div class="table-wrap">
        <el-table
          border
          ref="multipleTable"
          :data="form.channelExamineTargetList"
          tooltip-effect="dark"
          style="width: 100%;margin:0 auto"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="序号" fixed type="index" width="55"></el-table-column>
          <el-table-column prop="targetName" label="指标名称"></el-table-column>
          <el-table-column prop="targetType" label="指标类别">
            <template slot-scope="scope">{{translateTargetType(scope.row.targetType)}}</template>
          </el-table-column>
          <el-table-column prop="channelType" label="渠道类型">
            <template slot-scope="scope">{{translateChannelType(scope.row.channelType)}}</template>
          </el-table-column>
          <el-table-column prop="targetCategory" label="考核类别">
            <template slot-scope="scope">{{translateTargetCategory(scope.row.targetCategory)}}</template>
          </el-table-column>
          <el-table-column prop="conditionScores" label="考核分值"></el-table-column>
          <el-table-column label="操作" min-width="100px">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="qustionDelect(scope.row.id)"
                :id="$route.name+'-'+'delete'+scope.$index"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="addDevice vlt-add-more" @click="addType" icon="el-icon-plus" :disabled="false" :id="$route.name+'-'+'add'" >新增考核指标</el-button>
      </div>
    </panel>
    <div class="submit-wrap">
      <el-row class="btn-wrap">
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="submit()"
          :loading="showLoading"
          :id="$route.name+'-'+'submit'"
        >提 交</el-button>
        <el-button size="medium" @click="close" :id="$route.name+'-'+'cancel'">取 消</el-button>
      </el-row>
    </div>
    <el-dialog
      title="课程列表"
      :visible.sync="dialogVisible"
      width="50%"
      custom-class="setting_dialog"
      :close-on-click-modal="false"
    >
      <assessItemSetAddTable v-model="tabel" @selectionChange="selectionChange"></assessItemSetAddTable>
      <el-row class="vlt-edit-btn bit" style="text-align:right">
        <el-button size="medium" @click="dialogVisible=false">取 消</el-button>
        <el-button type="primary" v-prevent="1000" size="medium" @click="tabelListAdd">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import assessItemSetAddTable from "./assessItemSetAddTable";
import { debuglog } from "util";
export default {
  name: "",
  data() {
    return {
      pickOptions: {
        disabledDate(time) {
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          let currentdate = year.toString() + month.toString();
          let timeyear = time.getFullYear();
          let timemonth = time.getMonth() + 1;
          if (timemonth >= 1 && timemonth <= 9) {
            timemonth = "0" + timemonth;
          }
          let timedate = timeyear.toString() + timemonth.toString();
          return timedate < currentdate;
        }
      },
      dialogVisible: false,
      form: {
        name: null,
        highestScore: null,
        appraisalType: null,
        insId: 1,
        channelType: null,
        date: null,
        channelExamineTargetList: []
      },
      showLoading: false,
      insData: [],
      assessType: [
        { label: "绩效考核", value: 0 },
        { label: "等级考核", value: 1 }
      ],
      channelOptions: [
        { label: "自营厅", value: 0 },
        { label: "合作厅", value: 1 }
      ],
      rules: {
        name: [
          { required: true, validator: this.$rules.checkName, title:  "考核名称", trigger: ["change", "blur"] }
        ],
        highestScore: [
          { required: true, message: "考核最高分不能为空", trigger: ["change", "blur"] }
        ],
        appraisalType: [
          { required: true, message: "考核类型不能为空", trigger: ["change", "blur"] }
        ],
        channelType: [
          { required: true, message: "渠道类型不能为空", trigger: ["change", "blur"] }
        ],
        date: [
          { required: true, message: "生效年月不能为空", trigger: ["change", "blur"] }
        ],
        channelExamineTargetList: [
          { required: true, message: "请选择考核指标", trigger: ["change", "blur"] }
        ]
      },
      tableData: [],
      tabel: {
        tabelList: [],
        current: 1,
        pageSize: 20,
        total: 0
      },
      status: null,
      insId: "",
      id: null,
      param: { channelExamineTargetList: [] },
      selectList: []
    };
  },
  components: {
    assessItemSetAddTable
  },
  watch: {
    "form.channelType": {
      handler(n, o) {
        console.log(n, o);
        if (this.status == 0) {
          if (n != o) {
            this.form.channelExamineTargetList = [];
          }
        } else {
          if (o != null && o != n) {
            this.form.channelExamineTargetList = [];
          }
        }
      },
      deep: true,
      immediate: true
    },
    "form.channelExamineTargetList"(list) {
      if (!list || list.length == 0) {
        this.form.highestScore = "";
        return;
      } else {
        let scoreResult = [];
        list.forEach(item => {
          scoreResult = scoreResult.concat(item.conditionScores.split("#"));
          scoreResult = scoreResult.map(score => Number(score));
        });
        this.form.highestScore = scoreResult.reduce((i, j) => i + j);
      }
    }
  },
  created() {
    // this.insId = this.$storage.get("userInfo").insId;
    let id = this.$route.query.id;
    this.id = this.$route.query.id;
    this.status = Number(this.$route.query.status);
    if (id) {
      //编辑回显
      (async id => {
        let res = await this.$api.channelAppraisalDetail({ data: id });
        console.log("查看详情数据", res);

        if (res && res.code === 0) {
          // this.tableData = res.data.channelExamineTargetList || [];
          this.form.channelExamineTargetList =
            res.data.channelExamineTargetList;
          for (let i in this.form) {
            this.form[i] = res.data[i];
            if (i == "date") {
              this.form[i] = [res.data.effectiveTime, res.data.failureTime];
            }
          }
        }
      })(id);
    }
  },
  methods: {
    translateTargetType(val) {
      let options = { 0: "定性考核", 1: "定量考核" };
      return options[val];
    },
    translateTargetCategory(val) {
      let options = {
        0: "大厅管理",
        1: "大厅维护",
        2: "业务培训",
        3: "彩民服务"
      };
      return options[val];
    },
    translateChannelType(val) {
      let options = { 0: "自营厅", 1: "合作厅" };
      return options[val];
    },
    addType() {
      //新增
      if (this.form.appraisalType !== null && this.form.channelType !== null) {
        this.trainItemListAll();
      } else {
        this.$message.warning("考核类型和渠道类型不能为空");
      }
    },
    trainItemListAll(val) {
      (async val => {
        let data = {
          page: val || 1,
          pageSize: this.tabel.pageSize,
          param: {
            examineType: this.form.appraisalType,
            channelType: this.form.channelType
          }
        };
        let res = await this.$api.channelExamineTargetList({ data });
        console.log(res, "res");
        if (res && res.code === 0) {
          this.tabel.tabelList = res.data.records;
          this.tabel.current = res.data.current;
          this.tabel.total = res.data.total;
        }
      })(val);
      this.dialogVisible = true;
    },
    selectionChange(val) {
      console.log(val);
      this.selectList = val;
    },
    handleSelectionChange() {},
    clearTableList () {
      console.log(1);
      this.$set(this.form, 'channelExamineTargetList', []);
    },
    tabelListAdd() {
      let arr = [];
      if (
        this.form.channelExamineTargetList !== null &&
        this.form.channelExamineTargetList.length
      ) {
        this.selectList.forEach(item => {
          if (
            JSON.stringify(this.form.channelExamineTargetList).indexOf(
              JSON.stringify(item)
            ) !== -1
          ) {
            this.$message.warning(item.targetName + "已存在，请重新选择");
            console.log(item);
          } else {
            this.form.channelExamineTargetList.push(item);
            this.dialogVisible = false;
          }
        });
      } else {
        this.form.channelExamineTargetList = [...this.selectList];
        this.dialogVisible = false;
      }
    },
    qustionDelect(i) {
      //表格删除
      let arr = this.form.channelExamineTargetList.filter(item => item.id != i);
      this.form.channelExamineTargetList = [...arr];
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          console.log(this.form.date);
          let effectiveTime = this.$moment(
            Date.parse(this.form.date[0])
          ).format("YYYY-MM");
          let failureTime = this.$moment(Date.parse(this.form.date[1])).format(
            "YYYY-MM"
          );
          console.log(effectiveTime);
          // this.param.channelExamineTargetList = [...this.tableData];
          let data = {
            // ...this.param,
            ...this.form,
            effectiveTime,
            failureTime
          };
          console.log("data是", data);
          const apiName =
            this.status == 0 ? "channelAppraisalAdd" : "channelAppraisalUpdate";
          const message = this.status == 0 ? "新建成功" : "编辑成功";
          if (this.status == 1) {
            data.id = this.id;
          }

          (async data => {
            let res = await this.$api[apiName]({
              message,
              data
            });
            // console.log("新建||编辑结果", res);
            if (res && res.code === 0) {
              this.$router.push("assessItemSet");
            }
          })(data);
        }
      });
    },

    close() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-edit-single {
  .title {
    border-bottom: 0 solid #e8eaec;
  }
}

.vlt-edit-wrap.wrapper {
  margin-top: 10px;
}
.table-wrap {
  padding: 10px;
  text-align: center;
  .addDevice {
    width: 60%;
    max-width: 700px;
    margin: 16px 0;
  }
}
.submit-wrap {
  .btn-wrap {
    text-align: right;
    margin: 50px 0 0 220px;
  }
}
</style>
