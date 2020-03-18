<template>
  <div class="vlt-card">
    <el-tabs v-model="activeName">
      <el-tab-pane label="新建回滚" name="1">
        <panel :show="true" title="新建回滚">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <el-form label-position="right" label-width="100px" ref="form" :rules="rules" :model="form" class="baseInfo" :disabled="type!=0">
                <el-form-item label="申请标题" prop="title" v-if="isValid">
                    <el-input v-model="form.title" placeholder="请输入标题" show-word-limit  maxlength='30' ></el-input> 
                  </el-form-item>
                <el-form-item label="回滚名称" prop="name">
                  <el-input v-model="form.name" placeholder="请输入回滚名称" show-word-limit  maxlength='30' ></el-input>
                </el-form-item>
                <el-form-item label="被回滚计划" prop="upgradeId">
                  <el-select v-model="form.upgradeId"  placeholder="请选择" @change="handle" >
                    <el-option
                      v-for="item in upgradeName"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计划目标" prop="targetType">
                  <el-select v-model="form.targetType"  disabled placeholder="请选择">
                    <el-option
                      v-for="item in planOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <!-- <el-cascader
                    @change="changeSelect"
                    v-model="form.targetType"
                    :options="planOptions"
                    :props="setProps"
                    placeholder=""
                    clearable
                  ></el-cascader> -->
                </el-form-item>
                <el-form-item label="计划目标名称" >
                  <el-input type="textarea" disabled v-model="form.targetName" maxlength="150"></el-input>
                </el-form-item>
                <el-form-item label="回滚目标" prop="rollbackType">
                  <el-radio v-model="form.rollbackType" :label="0" @change="handleRadi" >所有目标</el-radio>
                  <div class="flex-wrap">
                    <el-radio v-model="form.rollbackType" :label="1" @change="handleRadio">指定目标</el-radio>
                    <el-select v-model="form.rollback" multiple placeholder="请选择" v-if="leisure==1"  >
                      <el-option
                        v-for="item in options2"
                        :key="item.value" 
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                    <el-cascader
                      v-if="insdata==1"
                      placeholder="请选择机构"
                      @change="changeSelect"
                      v-model="form.rollback"
                      :options="insData"
                      :props="setProps"
                      clearable
                    ></el-cascader>
                  </div>
                </el-form-item>
                <el-form-item label="回滚开始时间">
                  <el-radio v-model="form.treatmentStatus" label="0">审核通过即时生效</el-radio>
                  <!-- <div class="flex-wrap">
                    <el-radio v-model="form.status" label="2">指定时间</el-radio>-->
                    <!-- <el-date-picker v-model="form.value2" type="beginTime" placeholder="2019-10-29 0:00:00"></el-date-picker> -->
                  
                </el-form-item>
                <el-form-item label="回滚原因" prop="remark">
                  <el-input
                  
                    v-model="form.remark"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入回滚原有"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-row class="vlt-edit-btn" v-if="type=='0'" >
                    <el-button type="primary" v-prevent="1000" size="medium" @click="submit" :id="$route.name+'-'+'submit'">提 交</el-button>
                    <el-button type="danger" plain v-prevent="1000" size="medium" @click="save" v-if="isValid" :id="$route.name+'-'+'save'">暂 存</el-button>
                    <el-button size="medium" @click="cancel" :id="$route.name+'-'+'cancel'">取 消</el-button>
                  </el-row>
                </el-form-item>
              </el-form>
              
            </div>
          </div>
        </panel>
      </el-tab-pane>
      <el-tab-pane label="新建回滚流程图" v-if="isValid" name="2">
        <img :src="diagramImg" alt="">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import ajax from "@/utils/ajax.js";
import rules from "@/utils/rules.js";
import { async } from "q";
export default {
  name: "",
  data() {
    return {
      activeName: "1",
      title: "",
      upgradeName: [
        // {label:"计划1",value:0},
        // {label:"计划2",value:1}
      ],
      planOptions: [
        { label: "机构", value: 0 },
        { label: "渠道", value: 1 },
        { label: "设备", value: 2 }
      ],
      options2: [], //指定目标
      form: {
        title: "",
        name: "",
        upgradeId: "",
        rollback: "",
        rollbackType: "",
        targetType: "",
        targetName: "",
        // beginTime:"",
        remark: "",
        treatmentStatus: "0"
      },
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        multiple: true, // 多选
        checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
      },
      rules: {
        title: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title:  "回滚申请标题",
            trigger: ["change", "blur"]
          }
        ],
        name: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title:  "回滚名称",
            trigger: ["change", "blur"]
          }
        ],
        upgradeId: [
          {
            required: true,
            message: "请选择被回滚计划",
            trigger: ["change", "blur"]
          }
        ],
        rollbackType: [
          {
            required: true,
            message: "请选择回滚目标",
            trigger: ["change", "blur"]
          }
        ],
        rollback: [
          {
            required: true,
            message: "请选择回滚目标",
            trigger: ["change", "blur"]
          }
        ]
      },
      leisure: 2,
      insdata: 2,
      insData: [],
      updateData: [],
      target: "",
      isValid: false,
      diagramImg: "",
      actBusinessInsId: null,
      type: this.$route.query.type,
    };
  },
  async created() {
    this.validProcess();
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get("userInfo").insId;
    // this.getTaskData();
    this.title = this.$route.query.title;
    let reslt = await this.$api.queryUserUpgrade(); //升级计划查询
    console.log("升级查询", reslt);
    if (reslt && reslt.code === 0) {
      let gameData = reslt.data;
      this.updateData = reslt.data;
      gameData.forEach(item => {
        let obj = {};
        obj.label = item.name;
        obj.value = item.id;
        this.upgradeName.push(obj);
      });
    }
    if (this.$route.query.id) {
      // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    }
    // if (this.$route.query.ifo) {       //编辑回显
    //   let arr = Object.keys(this.form);
    //   console.log("ifo是", this.$route.query.ifo);
    //   // let arr2 = Object.keys(this.$route.query.ifo);
    //   arr.forEach(item => {
    //     this.form[item] = this.$route.query.ifo[item];
    //     // console.log("item是",item)
    //     this.form.upgradeId = this.$route.query.ifo.upgradeName;
    //     this.form.rollbackType = this.$route.query.ifo.rollbackType;
    //   });
    // }
  },
  methods: {
    //表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          let data = JSON.parse(res.data.data);
          console.log("data是", data);
          self.init(data);
        } else {
        }
      })(data);
    },
    init(data) {
      console.log("回填的参数", data);
      for (let item in this.form) {
        this.form[item] = data[item];
      }
    },
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = { router, actBusinessInsId: this.actBusinessInsId };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${
            self.$route.name
          }/${this.actBusinessInsId}`;
        }
      })(data);
    },
    changeForm() {},
    changeSelect() {},
    handle(val) {
      console.log("val是", val);
      this.updateData.forEach(async item => {
        if (val == item.id) {
          this.rollbackTargetType = item.targetType;
          console.log(this.rollbackTargetType);
          this.form.targetType = item.targetType;
          this.form.targetName = item.targetName.replace(/,/, "");
          this.target = item.target;
          console.log(this.target);
          this.options2 = [];
          item.targetList.forEach(i => {
            let obj = {};
            obj.label = i.value;
            obj.value = i.key;
            this.options2.push(obj);
          });
          if (item.targetType == 0) {
            let data = val;
            let res = await this.$api.rollbackIns({ data });
            console.log(res);
            this.insData = res.data;
          }
        }
      });
    },
    handleRadi(val) {
      if (val == 0) {
        this.leisure = 2;
        this.insdata = 2;
      }
    },
    handleRadio(val) {
      //指定目标显示
      console.log(this.form.targetType);
      if (val) {
        if (this.form.targetType == 0) {
          this.insdata = 1;
        } else if (this.form.targetType == 1 || this.form.targetType == 2) {
          this.leisure = 1;
        }
      }
    },
    // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("保存成功");
          self.$router.push({ name: "myApplication" });
        } else {
        }
      })(data);
    },
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // if (this.title === "编辑回滚信息") {
          //   this.form.id = this.$route.query.ifo.id;
          //   this.form.upgradeId = this.$route.query.ifo.upgradeId;
          //   let data = this.form;
          //   let res = await this.$api.rollbackEdit({ data });
          //   console.log("编辑data", data);
          //   if (res && res.code == 0) {
          //     this.$message.success("修改成功");
          //     this.$router.push({ path: "./rollbackSet" });
          //   } else {
          //     // self.$message.warning(res.msg)
          //   }
          // } else if (this.title === "新建回滚") {

          if (this.form.rollbackType == 0) {
            //所有目标
            this.form.rollback = this.target;
          } else if (this.form.rollbackType == 1) {
            //指定目标
            //机构单独选择
            console.log(this.rollbackTargetType);
            // this.form.rollback = this.form.rollback.join(",");
            if (this.rollbackTargetType == 0) {
              //判断是否为机构
              let arr = this.form.rollback.map(item => {
                item = item.pop();
                return item;
              });
              console.log(arr);
              this.form.rollback = arr.join(",");
            } else if (
              this.rollbackTargetType == 1 ||
              this.rollbackTargetType == 2
            ) {
              //是否为柜员机或渠道
              this.form.rollback = this.form.rollback.join(",");
            }
          }
          console.log(new Date());
          this.form.beginTime = Date.parse(new Date());
          let data = this.form;

          if (this.isValid) {
            // 走流程de参数
            let str = JSON.stringify(data);
            console.log("data是", data);
            data = {
              router: "rollbackSetAdd",
              title: this.form.title,
              // id: self.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str
            };
          } else {
            delete data.title;
          }

          // if(!self.$route.query.id) { // 直接提交 不需要带上
          //   delete data.actBusiness.id;
          // }
          if (
            this.form.rollbackType == 0 ||
            (this.form.rollbackType == 1 && this.form.rollback != "")
          ) {
            console.log("暂存的参数", data);
            this.saveDraft(data);
          } else {
            this.$message.error("回滚指定目标不能为空");
          }
        }
        // }
      });
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // if (this.title === "编辑回滚信息") {
          //   this.form.id = this.$route.query.ifo.id;
          //   this.form.upgradeId = this.$route.query.ifo.upgradeId;
          //   let data = this.form;
          //   let res = await this.$api.rollbackEdit({ data });
          //   console.log("编辑data", data);
          //   if (res && res.code == 0) {
          //     this.$message.success("修改成功");
          //     this.$router.push({ path: "./rollbackSet" });
          //   } else {
          //     // self.$message.warning(res.msg)
          //   }
          // } else if (this.title === "新建回滚") {

          let rollback = "";
          if (this.form.rollbackType == 0) {
            rollback = this.target;
          } else if (this.form.rollbackType == 1) {
            //指定目标
            //机构单独选择
            if (this.rollbackTargetType == 0) {
              //判断是否为机构
              rollback = this.form.rollback
                .map(item => item[item.length - 1])
                .join(",");
              // let arr = this.form.rollback.map(item => {
              //   item = item.pop();
              //   return item;
              // });
              // // this.form.rollback = arr.join(",");
              // rollback = arr.join(",");
            } else if (
              this.rollbackTargetType == 1 ||
              this.rollbackTargetType == 2
            ) {
              //是否为柜员机或渠道
              rollback = this.form.rollback.join(",");
            }
          }
          console.log(new Date());
          this.form.beginTime = Date.parse(new Date());
          let data = { ...this.form, rollback: rollback };

          if (this.isValid) {
            // 走流程de参数
            let str = JSON.stringify(data);
            console.log("data是", data);
            data.actBusiness = {
              router: "rollbackSetAdd",
              title: this.form.title,
              id: this.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str
            };
            if (!this.$route.query.id) {
              // 直接提交 不需要带上
              delete data.actBusiness.id;
            }
          } else {
            delete data.title;
          }

          if (
            this.form.rollbackType == 0 ||
            (this.form.rollbackType == 1 && this.form.rollback != "")
          ) {
            let res = await this.$api.addRollback({
              message: "新增成功",
              data
            });
            console.log("新增data", data);
            if (res && res.code == 0) {
              // this.$message.success("新增成功");
              // this.$router.push({ name: "myApplication" });
              if (this.isValid) {
                this.$router.push({ name: "myApplication" });
              } else {
                this.$router.back();
              }
            }
          } else {
            this.$message.error("指定目标不能为空");
            return;
          }
        }
        // }
      });
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index.less";
.vlt-edit-wrap {
  width: 100%;
  margin: 0 30px;
}
.vlt-edit-single .vlt-edit-btn {
  margin-left: 0;
}
.flex-wrap {
  display: flex;
  align-items: center;
}
.vlt-card {
  padding: 16px;
}
// .wrap {
//   max-width: 900px;
//   margin: 0 auto;
// }
</style>
