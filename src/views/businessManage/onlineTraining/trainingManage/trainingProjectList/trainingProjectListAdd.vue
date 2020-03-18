<template>
  <div class="vlt-card">
    <panel :show="true" :title="nowtype(status)" style="margin-bottom: 15px;">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form
            :rules="rules"
            ref="training"
            labelWidth="10em"
            :model="form"
            :disabled="status==1?true:false"
          >
            <el-form-item label="培训项目" prop="title">
              <el-input v-model="form.title" placeholder="请输入培训项目" show-word-limit maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="项目级别" prop="range">
              <el-select placeholder="请选择项目级别" v-model="form.range">
                <el-option
                  v-for="item in rangeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目类别" prop="type">
              <el-select placeholder="请选择项目类别" v-model="form.type">
                <el-option
                  v-for="item in objOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否考试" prop="isExam">
              <el-select placeholder="请选择是否考试" v-model="form.isExam">
                <el-option label="是" value="0"></el-option>
                <el-option label="否" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="培训说明" prop="introduce">
              <el-input
                type="textarea"
                placeholder="请输入培训说明"
                maxlength="145"
                :autosize="{ minRows: 3, maxRows: 10}"
                v-model="form.introduce"
              ></el-input>
            </el-form-item>
            <!-- </el-form> -->
            <div v-if="form.isExam==='0'">
              <div style="margin-bottom:20px;">
                <span>考卷条件</span>
              </div>
              <!-- <el-form :rules="rules" ref="training" labelWidth="110px" :model="form"> -->

              <el-form-item label="单选题数" prop="singleNum">
                <el-input maxlength="3" type="text" show-word-limit v-model="form.singleNum"></el-input>
              </el-form-item>
              <el-form-item label="多选题数" prop="multiNum">
                <el-input maxlength="3" type="text" show-word-limit v-model="form.multiNum"></el-input>
              </el-form-item>
              <el-form-item label="每题分数" prop>
                <el-input type="text" disabled show-word-limit v-model="score">
                  <template slot="append">分</template>
                </el-input>
              </el-form-item>
              <el-form-item label="合格分数" prop="passScore">
                <el-input maxlength="3" type="text" show-word-limit v-model="form.passScore"></el-input>
              </el-form-item>
              <el-form-item label="考试时长" prop="longTime">
                <el-input maxlength="6" type="text" show-word-limit v-model="form.longTime">
                  <template slot="append">秒</template>
                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </panel>
    <panel :show="true" title="培训课程" style="margin-bottom: 15px;">
      <div class="wrapper">
        <el-table :data="form.courseName" border>
          <el-table-column label="序号" fixed type="index" width="55px"></el-table-column>
          <el-table-column label="课程名称" prop="name" min-width="140px"></el-table-column>
          <el-table-column label="课程类型" prop="courseTypeName" min-width="80px"></el-table-column>
          <el-table-column label="课件类型" prop="courseMode" min-width="80px">
            <template slot-scope="scope">{{changeType(scope.row.courseMode)}}</template>
          </el-table-column>
          <el-table-column label="单选题" prop="questionScoreVo.singleChoice" min-width="80px"></el-table-column>
          <el-table-column label="多选题" prop="questionScoreVo.multiChoice" min-width="80px"></el-table-column>
          <el-table-column label="创建人" prop="uploadPersonName" min-width="70px"></el-table-column>
          <el-table-column label="操作" prop="introduce" min-width="60px">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="qustionDelect(scope.row.id)"
                :id="$route.name+'-delect-'+scope.$index"
                :disabled="status==1?true:false"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          size="medium"
          icon="el-icon-plus "
          class="text-btn vlt-add-more"
          @click="addList"
          :id="$route.name+'-course-add'"
          :disabled="status==1?true:false"
        >添加课程</el-button>
      </div>
    </panel>
    <div class="btn-wrap">
      <el-button
        type="primary"
        v-prevent="1000"
        size="medium"
        @click="trainingSubmit"
        v-if="status==1?false:true"
        :id="$route.name+'-add-goBack'"
      >提交</el-button>
      <el-button
        size="medium"
        @click="trainingCencle"
        :id="$route.name+'-add-cencel'"
      >{{status==1?'返回':'取消'}}</el-button>
    </div>
    <el-dialog
      title="课程列表"
      :visible.sync="dialogVisible"
      width="70%"
      custom-class="setting_dialog"
      :close-on-click-modal="false"
    >
      <tabelListProject v-model="tabel" @selectionChange="selectionChange" ref="list"></tabelListProject>
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

<script>
import tabelListProject from "./tableListProject";
export default {
  name: "",
  data() {
    const self = this;
    return {
      dialogVisible: false,
      form: {
        title: null,
        range: null,
        type: null,
        isExam: null,
        introduce: null,
        singleNum: null,
        multiNum: null,
        passScore: null,
        longTime: null,
        courseName: []
      },

      tabel: {
        tabelList: [],
        current: 1,
        pageSize: 20,
        total: 0
      },
      rangeOptions: [{ label: "全国", value: 1 }, { label: "省级", value: 2 }],
      objOptions: [
        { label: "必做", value: "1" },
        { label: "选做", value: "2" }
      ],
      levelOptions: [],
      selectList: [],
      rules: {
        title: [
          {
            required: true,
            message: "请输入培训项目名称",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "项目名称不支持特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        range: [
          {
            required: true,
            message: "请选择培训项目级别",
            trigger: ["change", "blur"]
          }
        ],
        isExam: [
          {
            required: true,
            message: "请选择是否考试",
            trigger: ["change", "blur"]
          }
        ],
        singleNum: [
          {
            required: true,
            message: "请填写单选题数",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[0-9.·-]+$/,
            message: "单选题数只支持数字",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            validator: (rule, value, callback) => {
              const _value = String(value).trim();
              if (_value !== '') {
                if (!self.singleQuesTotal) {
                  return callback(new Error('请先添加培训课程'));
                }
                if (Number(_value) > self.singleQuesTotal) {
                  return callback(new Error('单选题数不能大于所选课程单选题数总和'));
                }
              }
              callback();
            },
            trigger: ["change", "blur"]
          }
        ],
        type: [
          {
            required: true,
            message: "请选择项目类别",
            trigger: ["change", "blur"]
          }
        ],
        multiNum: [
          {
            required: true,
            message: "请填写多选题数",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[0-9.·-]+$/,
            message: "多选题数只支持数字",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            validator: (rule, value, callback) => {
              const _value = String(value).trim();
              if (_value !== '') {
                if (!self.multiQuesTotal) {
                  return callback(new Error('请先添加培训课程'));
                }
                if (Number(_value) > self.multiQuesTotal) {
                  return callback(new Error('多选题数不能大于所选课程多选题数总和'));
                }
              }
              callback();
            },
            trigger: ["change", "blur"]
          }
        ],
        passScore: [
          {
            required: true,
            message: "请填写合格分数",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[0-9.·-]+$/,
            message: "合格分数只支持数字",
            trigger: ["change", "blur"]
          }
        ],
        longTime: [
          {
            required: true,
            message: "请填写考试时长",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[0-9.·-]+$/,
            message: "考试时长只支持数字",
            trigger: ["change", "blur"]
          }
        ]
      },
      insId: null,
      status: null,
      id: null,
      score: 2
    };
  },
  components: {
    tabelListProject
  },
  computed: {
    // 单选题目总数
    singleQuesTotal() {
      if (this.form.courseName.length) {
        const quesCounts = this.form.courseName.map(item => item.questionScoreVo ? item.questionScoreVo.singleChoice : 0);
        return quesCounts.reduce((pre, cur) => pre + cur)
      }
      return 0;
    },
    // 多选题目总数
    multiQuesTotal() {
      if (this.form.courseName.length) {
        const quesCounts = this.form.courseName.map(item => item.questionScoreVo ? item.questionScoreVo.multiChoice : 0);
        return quesCounts.reduce((pre, cur) => pre + cur)
      }
      return 0;
    }
  },
  created() {
    const self = this;
    this.insId = this.$storage.get("userInfo").insId;
    let id = this.$route.query.id;
    this.id = id;
    this.status = Number(this.$route.query.status);
    console.log('123')
    if (id) {
      (async id => {
        let res = await this.$api.trainItemDetails({ data: id });
        console.log(res, "培训项目详情");
        if (res && res.code === 0) {
          for (let key in this.form) {
            if (key !== "courseName") {
              this.form[key] = res.data[key];
              if (
                key === "multiNum" ||
                key === "passScore" ||
                key === "longTime" ||
                key === "singleNum"
              ) {
                this.form[key] = res.data[key] || 0;
              }
            }
            if (key === "courseName") {
              if (res.data.courseList && res.data.courseList.length) {
                let arr = JSON.parse(JSON.stringify(res.data.courseList));
                arr.forEach((item, index) => {
                  if (item) {
                    this.form[key].push(item);
                  }
                });
              }
            }
          }
        }
      })(id);
    }

    console.log(this.insId);
  },
  methods: {
    addList() {
      this.trainItemListAll();
    },
    nowtype(key) {
      let option = {
        0: "新建培训项目",
        1: "培训项目详情",
        2: "培训项目编辑"
      };
      return option[key];
    },
    changeType(key) {
      let option = {
        1: "视频",
        2: "音频",
        3: "图片",
        4: "pdf"
      };
      return option[key];
    },
    tabelListAdd() {
      console.log(this.form.courseName);
      let falg = true;
      let arr = [];
      if (this.form.courseName.length) {
        this.selectList.forEach(item => {
          this.form.courseName.forEach(i => {
            if (item.id === i.id) {
              arr.push(item);
              falg = false;
            }
          });
        });
      }
      if (falg) {
        this.form.courseName = [...this.form.courseName, ...this.selectList];
      } else {
        let str = arr.map(item => item.name).join(" , ");
        this.$message.warning(
          "培训课程 '" + str + "' 已存在，课程添加不能重复，请重新选择！"
        );
        return;
      }
      console.log(  this.$refs.list);
      this.$refs.list.$refs.multipleTable.clearSelection();

      this.dialogVisible = false;
    },
    qustionDelect(i) {
      let arr = this.form.courseName.filter(item => item.id != i);
      this.form.courseName = [...arr];
    },
    selectionChange(val) {
      console.log(val);
      this.selectList = [...val];
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
        let res = await this.$api.trainCourseList({ data });
        console.log(res, "res");
        if (res && res.code === 0) {
          this.tabel.tabelList = res.data.records;
          this.tabel.current = res.data.current;
          this.tabel.total = res.data.total;
        }
      })(val);
      this.dialogVisible = true;
      this.$nextTick (() => {
        console.log(this.$refs.list);
        this.$refs.list.$refs.multipleTable.doLayout();
      })
      
    },
    trainingSubmit() {
      this.$refs["training"].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form));
          let courseName;
          if (data.courseName.length) {
            courseName = data.courseName.map(item => item.id).join(",");
          } else {
            this.$message.warning("请至少添加一项培训课程");
            return false;
          }

          data = { ...data, courseName, insId: this.insId };

          if (this.status === 0) {
            (async data => {
              let res = await this.$api.trainItemCerate({
                message: "新建成功",
                data
              });
              if (res && res.code === 0) {
                this.$router.push("trainingProjectList");
              }
            })(data);
          }
          if (this.status === 2) {
            data.id = this.id;
            (async data => {
              let res = await this.$api.trainItemUpdate({
                message: "修改成功",
                data
              });
              if (res && res.code === 0) {
                this.$router.push("trainingProjectList");
              }
            })(data);
          }
        } else {
          return false;
        }
      });
    },
    trainingCencle() {
      this.$router.push({ name: "trainingProjectList" });
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
.btn {
  margin-left: 100px;
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
