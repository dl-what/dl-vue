<template>
  <div class="vlt-card">
    <panel :show="true" title="新建培训计划" style="margin-bottom: 15px;">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form :rules="rules" ref="training" labelWidth="110px" :model="form">
            <el-form-item label="计划标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入计划标题" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="计划范围" prop="range">
              <el-cascader
                placeholder="请选择计划范围"
                :options="rangeOptions"
                :props="setProps"
                clearable
                v-model="form.range"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="培训对象" prop="objects">
              <el-select placeholder="请选择培训对象" multiple v-model="form.objects">
                <el-option
                  v-for="item in objOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="渠道等级" prop="channelLevel">
              <el-select placeholder="请选择渠道等级" multiple v-model="form.channelLevel">
                <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训时间" prop="trainingTime">
              <el-date-picker
                v-model="form.trainingTime"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                :default-time="['12:00:00']"
                :picker-options="completeTime"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="计划描述" prop="description">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 10}"
                maxlength="145"
                placeholder="请输入计划描述"
                v-model="form.description"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
    <panel :show="true" title="培训项目" style="margin-bottom: 15px;">
      <div class="wrapper">
        <el-table :data="form.trainItemName" border>
          <el-table-column label="序号" fixed type="index" width="55px"></el-table-column>
          <el-table-column label="项目标题" prop="title" min-width="100px"></el-table-column>
          <el-table-column label="项目级别" prop="rangeName" min-width="70px"></el-table-column>
          <el-table-column label="项目类型" prop="typeName" min-width="70px">
            <template slot-scope="scope">
              <span
                class="icon-tag"
                :class="{
              blue:scope.row.type=='2',
              green:scope.row.type=='1',
              grey:scope.row.type=='0',
              yellow:scope.row.type=='3',
              red:scope.row.type=='4',
              }"
              >{{scope.row.typeName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="培训课程" prop="courseName" min-width="100px"></el-table-column>
          <el-table-column label="是否关联考试" prop="isExamName" min-width="70px">
            <template slot-scope="scope">
              <span
                class="icon-circle"
                :class="{
                blue:scope.row.isExam=='4',
                green:scope.row.isExam=='0',
                grey:scope.row.isExam=='2',
                yellow:scope.row.isExam=='3',
                red:scope.row.isExam=='1',
                }"
              >{{scope.row.isExamName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="培训说明" prop="introduce" min-width="160px"></el-table-column>
          <el-table-column label="操作" prop="introduce" min-width="60px">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="qustionDelect(scope.row.id)"
                :id="$route.name+'-delect-'+scope.$index"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          size="medium"
          class="text-btn vlt-add-more"
          icon="el-icon-plus "
          @click="addList"
          :id="$route.name+'-triningproject-add'"
        >添加项目</el-button>
      </div>
    </panel>
    <div class="btn-wrap">
      <el-button
        type="primary"
        v-prevent="1000"
        size="medium"
        @click="trainingSubmit"
        :id="$route.name+'-add-goBack'"
      >提交</el-button>
      <el-button size="medium" @click="trainingCencle" :id="$route.name+'-add-cencel'">取消</el-button>
    </div>
    <el-dialog
      title="培训项目列表"
      :visible.sync="dialogVisible"
      width="70%"
      custom-class="setting_dialog"
      :close-on-click-modal="false"
    >
      <tabelList v-model="tabel" @selectionChange="selectionChange" ref="list"></tabelList>
      <el-row class="vlt-edit-btn bit">
        <el-button
          type="primary"
          v-prevent="1000"
          size="medium"
          @click="tabelListAdd"
          :id="$route.name+'-list-submit'"
        >确 定</el-button>
        <el-button size="medium" @click="dialogVisible=false" :id="$route.name+'-list-cencel'">取 消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import tabelList from "./tableList";
import { mapGetters } from "vuex";
export default {
  name: "trainingAdd",

  data() {
    return {
      dialogVisible: false,
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: true
      },
      status: 0,
      form: {
        title: null,
        range: [],
        objects: null,
        channelLevel: null,
        trainingTime: [],
        description: null,
        trainItemName: []
      },
      rangeOptions: [],
      objOptions: [],
      selectList: [],
      levelOptions: [],
      tabel: {
        tabelList: [],
        copyList: [],
        current: 1,
        pageSize: 20,
        total: 0
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入计划标题",
            trigger: ["change", "blur"]
          },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "计划标题不支持特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        range: [
          {
            required: true,
            message: "请选择计划范围",
            trigger: ["change", "blur"]
          }
        ],
        objects: [
          { required: true, message: "请选择培训对象", trigger: ["blur"] }
        ],
        // channelLevel: [ { required: true, message: "请选择渠道等级", trigger: ["change", "blur"] } ],
        trainingTime: [
          {
            required: true,
            message: "请选择培训时间",
            trigger: ["change", "blur"]
          }
        ]
      },
      completeTime: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      insId: null,
      trainList: []
    };
  },
  components: {
    tabelList
  },
  computed: {
    ...mapGetters(["insData"])
  },
  created() {
    this.findAllUser();
    this.insId = this.$storage.get("userInfo").insId;
    this.getChannelGradeList();
  },
  methods: {
    // 获取等级下拉列表
    getChannelGradeList() {
      const _this = this;
      (async () => {
        const res = await _this.$api.getChannelGradeList({});
        if (res && res.code === 0) {
          console.log("获取的列表", res);
          res.data &&
            res.data.forEach(item => {
              _this.levelOptions.push({
                value: item.chGradeId,
                label: item.chLevelName
              });
            });
        }
      })();
    },
    trainingSubmit() {
      let data = JSON.parse(JSON.stringify(this.form));
      if (data.trainingTime.length) {
        let startDate = this.$moment(data.trainingTime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        let expireDate = this.$moment(data.trainingTime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        data = { ...data, startDate, expireDate };
        delete data.trainingTime;
      }
      let trainItemName, objects, channelLevel, range;
      if (data.objects.length) {
        objects = data.objects.join(",");
      }
      if (data.channelLevel) {
        channelLevel = data.channelLevel.toString();
      }
      if (data.range.length) {
        range = data.range[data.range.length - 1];
      }
      if (data.trainItemName.length) {
        trainItemName = data.trainItemName.map(item => item.id).join(",");
      } else {
        this.$message.warning("请至少添加一项培训项目");
        return false;
      }

      data = {
        ...data,
        trainItemName,
        range,
        channelLevel,
        objects,
        insId: this.insId
      };
      this.$refs["training"].validate(valid => {
        if (valid) {
          (async () => {
            let res = await this.$api.trainOnlineCreate({
              message: "新建成功",
              data
            });
            if (res && res.code === 0) {
              this.$router.push({ name: "trainingPlanList" });
            }
          })();
        } else {
          return false;
        }
      });
    },
    findAllUser() {
      (async () => {
        let res = await this.$api.tChannelRoleInfoFindAll();
        if (res && res.code == 0) {
          this.objOptions = res.data;
        }
      })();
    },
    qustionDelect(i) {
      let arr = this.form.trainItemName.filter(item => item.id != i);
      this.form.trainItemName = [...arr];
    },
    tabelListAdd() {
      let falg = true;
      let arr = [];
      if (this.form.trainItemName.length) {
        this.selectList.forEach(item => {
          this.form.trainItemName.forEach(i => {
            if (item.id === i.id) {
              arr.push(item);
              falg = false;
            }
          });
        });
      }
      if (falg) {
        this.form.trainItemName = [
          ...this.form.trainItemName,
          ...this.selectList
        ];
      } else {
        let str = arr.map(item => item.title).join(" , ");
        this.$message.warning(
          "培训项目" + str + "已存在，项目添加不能重复，请重新选择！"
        );
        return;
      }
      this.$refs.list.$refs.multipleTable.clearSelection();
      this.dialogVisible = false;
    },
    selectionChange(val) {
      this.selectList = [...val];
    },
    addList() {
      this.trainItemListAll();
    },
    trainItemListAll(val) {
      (async val => {
        let data = {
          page: val || 1,
          pageSize: this.tabel.pageSize,
          param: {
            insId: this.insId
          }
        };
        let res = await this.$api.trainItemListAll({ data });
        if (res && res.code === 0) {
          this.tabel.tabelList = res.data.records;
          this.tabel.current = res.data.current;
          this.tabel.total = res.data.total;
        }
      })(val);
      this.dialogVisible = true;
    },
    trainingCencle() {
      this.$router.push({ name: "trainingPlanList" });
    },
    trainingSave() {},
    filterInsdata(val) {}
  },
  watch: {
    insData: {
      handler(n, o) {
        const insData = JSON.parse(JSON.stringify(n));
        (function filter(_data) {
          const children = _data || [];
          if (children.length) {
            children.forEach((item, i) => {
              if (item.type === 1) {
                delete item.children;
              }
              filter(item.children);
            });
          } else {
            return false;
          }
        })(insData);
        this.rangeOptions = insData;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
.text-btn {
  width: 60%;
  max-width: 700px;
  margin: 20px 0 10px;
}
.bit {
  text-align: right;
  margin: 30px 10px 0px;
}
.btn-wrap {
  text-align: right;
}
.wrapper {
  padding: 10px;
  text-align: center;
}
</style>
