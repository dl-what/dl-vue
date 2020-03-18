<template>
  <div class="vlt-card">
    <control-bar slot="extend-bar" @select="selectBtn" :options="controlOptions" position="left"></control-bar>
    <el-table :data="tableData" border style="width: 100%; margin: 10px 0 10px 0">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="memberLevelStr" label="会员级别"></el-table-column>
      <el-table-column prop="levelName" label="会员等级名称"></el-table-column>
      <el-table-column prop="growthValue" label="成长值范围"></el-table-column>
      <el-table-column prop="levelRightsVoList" label="会员权益">
        <template slot-scope="scope">
          <div>{{ rightsInfoTreeVoList(scope.row.levelRightsVoList) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="compile(scope.row, scope.$index)"
            :disabled="idstatus == 1 ? true : false"
          >编辑</el-button>
          <el-button
            type="text"
            v-if="scope.$index == tableData.length - 1"
            @click="rankDelect(scope.$index)"
            :disabled="idstatus == 1 ? true : false"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="vlt-edit-btn">
      <el-button size="medium" @click="prev" class="cancel" :id="$route.name+'aNewleve-goBack'">上一步</el-button>
      <el-button
        type="primary"
        v-prevent="1000"
        size="medium"
        :id="$route.name+'aNewleve-backFirst'"
        @click="submit"
      >{{ idstatus == 1 ? "返回首页" : "完成" }}</el-button>
    </el-row>

    <div>
      <el-dialog
        :title="button && button === '编辑' ? '编辑会员等级' : '新建会员等级'"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="40%"
      >
        <el-form
          label-position="right"
          label-width="100px"
          :model="diagForm"
          :rules="rules2"
          ref="form"
        >
          <el-form-item label="会员等级" prop="memberLevelStr">
            <el-input v-model="diagForm.memberLevelStr" placeholder="请输入内容" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="等级名称" prop="levelName">
            <el-input v-model="diagForm.levelName" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="成长值范围" prop="growthValue">
            <el-input v-model="diagForm.growthValue" placeholder="请输入内容"></el-input>
            <span style="color:#F56C6C;">提示：成长值范围不能低于已存在最高级别会员的成长值！</span>
          </el-form-item>
          <el-form-item label="关联权益" prop="levelRightsVoList">
            <el-select v-model="diagForm.levelRightsVoList" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row class="vlt-edit-btn btns">
          <el-button
            size="medium"
            @click="dialogVisible = false"
            :id="$route.name+'-aNewLevel-cencel'"
          >取消</el-button>
          <el-button
            type="primary"
            v-prevent="1000"
            size="medium"
            @click="DialogVisibleSubmit"
            :id="$route.name+'-aNewLevel-enter'"
          >保存</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "aNewLevel",
  props: ["idstatus", "newLevelData"],
  data() {
    return {
      rules2: {
        levelName: [
          {
            required: true,
            message: "等级名称不能为空",
            trigger: ["change", "blur"]
          },
          {
            min: 2,
            max: 10,
            message: "长度在2 到 10 个字符",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9.·-]+$/,
            message: "方案名称不支持特殊字符",
            trigger: ["change", "blur"]
          }
        ],
        growthValue: [
          {
            required: true,
            message: "成长值范围不能为空",
            trigger: ["change", "blur"]
          },
          {
            required: true,
            pattern: /^[0-9.·-]+$/,
            message: "成长值范围只支持数字类型字符！",
            trigger: ["change", "blur"]
          }
        ],
        levelRightsVoList: [
          {
            required: true,
            message: "关联权益不能为空",
            trigger: ["change", "blur"]
          }
        ]
      },
      dialogVisible: false,
      textarea: "",
      options: [],
      tableData: [],
      diagForm: {
        memberLevelStr: null,
        levelName: null,
        growthValue: null,
        levelRightsVoList: []
      },
      name: [],
      params: {},
      controlOptions: [
        {
          name: "新建等级",
          type: "primary",
          icon: "plus",
          disabled: false,
          permission: "MemberGradeManagement-create"
        }
      ],
      button: null,
      indx: null,
      editing: null
    };
  },
  created() {
    if (this.idstatus == 1) {
      this.controlOptions.forEach(item => {
        this.$set(item, "disabled", true);
      });
    }
    (async () => {
      let res = await this.$api.rightsTree();
      if (res && res.code === 0) {
        let options = res.data.map(item => {
          return { label: item.rightsName, value: item.rightsId };
        });
        this.options = options;
      }
    })();
  },
  components: {},
  methods: {
    submit() {
      let data = {
        memberLevelVoList: [...this.tableData]
      };
      this.$emit("submit", data);
    },
    prev() {
      this.$emit("prev");
    },
    findName(val) {
      if (val && val.length) {
        let arr = this.options.map(item => {
          let a = item.value;
          return { [a]: item.label };
        });
        let obj = {};
        arr.forEach(item => {
          Object.assign(obj, item);
        });
        let n = val.map(item => {
          return obj[item];
        });
        return n;
      }
    },
    rightsInfoTreeVoList(val) {
      let arr = [];
      let arr3 = JSON.parse(JSON.stringify(this.name));
      val.forEach((item, index) => {
        if (item.rightsId) {
          arr.push(item.rightsId);
        }
      });
      let a;
      if (arr.length) {
        a = this.findName(arr);
        return a.join(",");
      }
    },
    compile(val, index) {
      this.button = "编辑";
      this.indx = index;
      this.editing = val;
      this.dialogVisible = true;
      for (let key in this.diagForm) {
        if (key != "levelRightsVoList") {
          this.$set(this.diagForm, key, val[key]);
        }
        let arr = [];
        if (key === "levelRightsVoList") {
          val[key].forEach(item => {
            if (item.rightsId) {
              arr.push(item.rightsId);
            }
          });
          this.diagForm[key] = arr;
        }
      }
    },
    clearForm() {
      for (let key in this.diagForm) {
        if (key != "levelRightsVoList") {
          this.diagForm[key] = null;
        } else {
          this.diagForm.levelRightsVoList = [];
        }
      }
    },
    DialogVisibleSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.button === "新建等级") {
            let form = this.diagForm;
            let levelRightsVoList = form.levelRightsVoList.map(item => {
              return { rightsId: item };
            });
            form.growthValue = Number(form.growthValue);
            form.memberLevel = Number(
              form.memberLevelStr.substr(6, form.memberLevelStr.length)
            );
            let data = {
              ...form,
              levelRightsVoList
            };
            this.tableData.push(data);
          }
          if (this.button === "编辑") {
            let form = this.diagForm;
            form.memberLevel = Number(
              form.memberLevelStr.substr(6, form.memberLevelStr.length)
            );
            let levelRightsVoList = form.levelRightsVoList.map(item => {
              return { rightsId: item };
            });
            form.growthValue = Number(form.growthValue);
            form = { ...form, levelRightsVoList };
            form.levelId = this.editing.levelId;
            let obj = this.tableData.map((item, index) => {
              if (index == this.indx) {
                return form;
              } else {
                return item;
              }
            });
            this.tableData = [...obj];
          }
          this.dialogVisible = false;
          this.clearForm();
        } else {
          this.$message.error("表单填写有误，请重新输入！");
          return false;
        }
      });
    },
    rankDelect(val) {
      this.$confirm("你确认要删除此等级？", "提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          let arr = this.tableData.filter((item, index) => index != val);
          this.tableData = arr;
          this.$message({
            type: "success",
            message: "删除完成"
          });
        })
        .catch(action => {
          this.$message({
            type: "info",
            message: action === "cancel" ? "取消删除" : ""
          });
        });
    },
    selectBtn(val) {
      if (val.name === "新建等级") {
        this.button = "新建等级";
        let num = this.tableData.length;
        let data = "level_" + (Number(num) + 1);
        this.diagForm.memberLevelStr = data;
        this.dialogVisible = true;
      }
    }
  },
  watch: {
    newLevelData: {
      handler: function(n, o) {
        if (Object.keys(n).length > 0) {
          this.tableData = n.memberLevelVoList;
        }
      }
    }
  }
};
</script>

<style lang="less">
.el-dialog {
  border-radius: 10px;
}
.el-dialog .el-dialog__body {
  padding: 20px 40px 20px 20px;
}
.vlt-edit-btn {
  text-align: center;
}
.el-radio {
  margin: 0;
}
</style>
