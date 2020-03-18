<template>
  <div class="vlt-card" ref="main">
    <el-steps :active="active" align-center class="step-wrap">
      <el-step title="基础信息" icon="el-icon-edit"></el-step>
      <el-step title="选择软件" icon="el-icon-upload"></el-step>
      <el-step title="创建计划" icon="el-icon-paperclip"></el-step>
    </el-steps>
    <div class="vlt-edit-single" v-show="active==0">
      <div class="vlt-edit-wrap first">
        <el-form
          label-position="right"
          label-width="90px"
          ref="form"
          :model="form"
          class="baseInfo"
        >
          <el-form-item label="升级计划名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="软件类型" prop="softType">
            <el-select v-model="form.softType" placeholder="请选择" @change="handleOptions">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级目标" prop="targetType">
            <el-select v-model="form.targetType" placeholder="请选择" @change="handle">
              <el-option
                v-for="item in planOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属机构" v-if="target1===0" prop="target">
            <el-cascader
              @change="changeSelect"
              v-model="form.target"
              :options="insData"
              :props="setProps"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所属渠道" v-else-if="target1===1" prop="target">
            <el-select v-model="form.target" placeholder="请选择">
              <el-option
                v-for="item in channelData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择设备" v-else-if="target1===2" prop="target">
            <el-select v-model="form.target" placeholder="请选择">
              <el-option
                v-for="(item,index) in deviceData"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级方式" prop="theWay">
            <el-select v-model="form.theWay" placeholder="请选择">
              <el-option
                v-for="(item) in wayOptins"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级类型">
            <el-radio v-model="form.forcedType" label=1>强制升级</el-radio>
            <div class="flex-wrap">
              <el-radio v-model="form.forcedType" label=2>空闲升级</el-radio>
              <el-date-picker
                type="datetimerange"
                v-model="form.leisureTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="2019-10-29 0:00:00"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remark" maxlength="150"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="vlt-edit-btn">
          <el-button size="medium" @click="back" class="cancel">返 回</el-button>
          <el-button type="primary" v-prevent="1000" size="medium" @click="next">下一步</el-button>
        </el-row>
      </div>
    </div>
    <div class="vlt-edit-single" v-show="active==1">
      <div class="vlt-edit-wrap second">
        <el-tabs v-model="activeName" @tab-click="handleClick" style="width:900px;margin: 0 auto">
          <el-tab-pane label="上传应用" name="0">
            <div v-if="deviceShow===1">
              <panel title="全量升级" :show="true" style="margin-bottom:15px">
                <div class="vlt-edit-single">
                  <div class="vlt-edit-wrap">
                    <el-form label-position="right" label-width="90px" :model="form" ref="form">
                      <base-form
                        :formData="upload1"
                        labelWidth="140px"
                        ref="baseForm"
                        :rules="rules"
                        direction="right"
                        @change="changeForm1"
                      ></base-form>
                    </el-form>
                  </div>
                </div>
              </panel>
              <panel title="增量升级" :show="true" style="margin-bottom:15px">
                <div class="vlt-edit-single">
                  <div class="vlt-edit-wrap">
                    <el-form label-position="right" label-width="90px" :model="form" ref="form">
                      <base-form
                        :formData="upload2"
                        labelWidth="140px"
                        ref="baseForm"
                        :rules="rules"
                        direction="right"
                        @change="changeForm2"
                      ></base-form>
                    </el-form>
                  </div>
                </div>
              </panel>
            </div>
            <div class="vlt-edit-single" v-else-if="deviceShow===3">
              <div class="vlt-edit-wrap">
                <el-form label-position="right" label-width="90px" :model="form" ref="form">
                  <base-form
                    :formData="upload3"
                    labelWidth="140px"
                    ref="baseForm"
                    :rules="rules"
                    direction="right"
                    @change="changeForm3"
                  ></base-form>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="关联应用" name="1">
            <!-- 终端机，柜员机 -->
            <div v-if="deviceShow===1">
              <panel title="全量升级" :show="true" style="margin-bottom:15px">
                <div class="vlt-edit-single">
                  <div class="vlt-edit-wrap">
                    
                  <el-form
                  label-position="right"
                  label-width="90px"
                  ref="relevanceForm"
                  :model="relevanceForm"
                  class="baseInfo"
                >
                  <el-form-item label="升级计划名称" prop="upgradeId" >
                    <el-select
                      v-model="value"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="remoteMethod"
                      :loading="loading"
                       @change="handlerRelevance"
                    >
                      <el-option
                        v-for="item in associatedSoftware"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="软件名称">
                    <el-input v-model="relevanceForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="版本号">
                    <el-input v-model="relevanceForm.versionCode"></el-input>
                  </el-form-item>
                  <el-form-item label="软件大小">
                    <el-input v-model="relevanceForm.softwareSize"></el-input>
                  </el-form-item>
                  <el-form-item label="软件描述">
                    <el-input v-model="relevanceForm.remark"></el-input>
                  </el-form-item>
                  <el-form-item label="新版特性">
                    <el-input v-model="relevanceForm.characteristic"></el-input>
                  </el-form-item>
                  <el-form-item label="更新字段" prop="updateField">
                    <el-input
                      v-model="relevanceForm.updateField"
                      type="textarea"
                      maxlength="150"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                </el-form>
                  </div>
                </div>
              </panel>
              <panel title="增量升级" :show="true" style="margin-bottom:15px">
                <div class="vlt-edit-single">
                  <div class="vlt-edit-wrap">
                    <el-form label-position="right" label-width="90px" :model="form" ref="form">
                      <base-form
                        :formData="relevanceUpload2"
                        labelWidth="140px"
                        ref="baseForm"
                        :rules="rules"
                        direction="right"
                        @change="changeForm2"
                      ></base-form>
                    </el-form>
                  </div>
                </div>
              </panel>
            </div>
            <!-- 渠道App -->
            <div class="vlt-edit-single" v-if="deviceShow===3">
              <div class="vlt-edit-wrap">
                <el-form
                  label-position="right"
                  label-width="90px"
                  ref="relevanceForm"
                  :model="relevanceForm"
                  class="baseInfo"
                >
                  <el-form-item label="升级计划名称" prop="upgradeId">
                    <el-select
                      v-model="value"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请输入关键词"
                      :remote-method="remoteMethod"
                      :loading="loading"
                       @change="handlerRelevance"
                    >
                      <el-option
                        v-for="item in associatedSoftware"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="软件名称">
                    <el-input v-model="relevanceForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="版本号">
                    <el-input v-model="relevanceForm.versionCode"></el-input>
                  </el-form-item>
                  <el-form-item label="软件大小">
                    <el-input v-model="relevanceForm.softwareSize"></el-input>
                  </el-form-item>
                  <el-form-item label="软件描述">
                    <el-input v-model="relevanceForm.remark"></el-input>
                  </el-form-item>
                  <el-form-item label="新版特性">
                    <el-input v-model="relevanceForm.characteristic"></el-input>
                  </el-form-item>
                  <el-form-item label="更新字段" prop="updateField">
                    <el-input
                      v-model="relevanceForm.updateField"
                      type="textarea"
                      maxlength="150"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-row class="vlt-edit-btn">
          <el-button size="medium" @click="prev" class="cancel">上一步</el-button>
          <el-button type="primary" v-prevent="1000" size="medium" @click="next">下一步</el-button>
        </el-row>
      </div>
    </div>
    <div class="vlt-edit-single" v-show="active==2">
      <div class="vlt-edit-wrap third">
        <el-form label-position="right" label-width="90px" :model="form" ref="form">
        <base-form
          :formData="formData"
          labelWidth="100px"
          style="margin-left:-40px"
          ref="baseForm"
          :rules="rules"
          direction="right"
          @change="changeForm"
        ></base-form>
        </el-form>
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="name" label="软件名称"></el-table-column>
          <el-table-column prop="versionCode" label="版本号"></el-table-column>
          <el-table-column prop="softwareSize" label="软件大小"></el-table-column>
          <el-table-column prop="remark" label="软件描述"></el-table-column>
          <el-table-column prop="characteristic" label="新版特性"></el-table-column>
          <el-table-column prop="updateField" label="更新字段"></el-table-column>
        </el-table>
        <el-row class="vlt-edit-btn">
          <el-button size="medium" @click="prev" class="cancel">上一步</el-button>
          <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import moment from "moment";
export default {
  name: "upgradePlanListEdit",
  data() {
    return {
      relevanceName: [],
      value: [],
      list: [],
      loading: false,
      states: [],
      relevanceForm: {},
      relevanceForm: {
        name: "",
        versionCode: "",
        softwareSize: "",
        remark: "",
        characteristic: "",
        updateField: "",
        beginTime: ""
      },
      form: {
        name: "",
        softType: "",
        targetType: "",
        target: "",
        theWay: "",
        forcedType: "",
        remark: "",
        leisureTime: ""
      },
      rules: {},
      active: 0,
      options: [
        { label: "投注终端", value: 1 },
        { label: "柜员机软件", value: 2 },
        { label: "渠道APP", value: 3 }
      ],
      wayOptins: [
        { label: "全量升级", value: 0 },
        { label: "增量升级", value: 1 }
      ],
      planOptions: [
        { label: "机构", value: 0 },
        { label: "渠道", value: 1 },
        { label: "设备", value: 2 }
      ],
      tableData: [],
      activeName: "0",
      upload1: [
        {
          title: "升级类型",
          type: "select",
          prop: "packageType",
          value: 0,
          placeholder: "全量升级",
          disabled: true,
          options: [
            { label: "全量升级", value: 0 },
            { label: "增量升级", value: 1 }
          ]
        },
        {
          title: "软件名称",
          type: "select",
          prop: "name",
          value: "",
          placeholder: "",
          options: []
        },
        // {title: "版本名称",type: "input",prop: "versionName",value: "",placeholder: ""},
        {
          title: "版本号",
          type: "input",
          prop: "versionCode",
          value: "",
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          placeholder: ""
        },
        { title: "更新字段", type: "textarea", prop: "updateField", value: "" }
      ],
      upload2: [
        {
          title: "升级类型",
          type: "select",
          prop: "packageType",
          value: 1,
          placeholder: "",
          disabled: true,
          options: [
            { label: "全量升级", value: 0 },
            { label: "增量升级", value: 1 }
          ]
        },
        {
          title: "软件名称",
          type: "select",
          prop: "name",
          value: "",
          placeholder: "",
          options: []
        },
        // {title: "版本名称",type: "input",prop: "versionName",value: "",placeholder: ""},
        {
          title: "版本号",
          type: "input",
          prop: "versionCode",
          value: "",
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          placeholder: ""
        },
        { title: "更新字段", type: "textarea", prop: "updateField", value: "" }
      ],
      upload3: [
        {
          title: "软件名称",
          type: "select",
          prop: "name",
          value: "",
          placeholder: "",
          options: []
        },
        // {title: "版本名称",type: "input",prop: "versionName",value: "",placeholder: ""},
        {
          title: "版本号",
          type: "input",
          prop: "versionCode",
          value: "",
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          placeholder: ""
        },
        { title: "更新字段", type: "textarea", prop: "updateField", value: "" }
      ],
      relevanceUpload2: [
        {
          title: "软件名称",
          type: "input",
          prop: "name",
          value: "",
          placeholder: ""
        },
        // {title: "版本名称",type: "input",prop: "versionName",value: "",placeholder: ""},
        {
          title: "版本号",
          type: "input",
          prop: "versionCode",
          value: "",
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          placeholder: ""
        },
        { title: "更新字段", type: "textarea", prop: "updateField", value: "" }
      ],
      formData: [
        {
          title: "升级时间",
          type: "datetime",
          prop: "beginTime",
          value: ""
        }
      ],
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        multiple: true, // 多选
        checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
      },
      params: {
        upgradeSoftList: []
      },
      flag: "",
      insData: [],
      channelData: [],
      deviceData: [],
      target1: 1,
      deviceShow: 1,
      handleOption: "",
      full: [],
      increment: [],
      channel: [],
      obj1: {
        softId: ""
      },
      obj2: {},
      reslt: "",
      obj3: {},
      associatedSoftware: []
    };
  },
  async created() {
    // this.softType = this.$route.query.softType;
    let data = this.$route.query.ifo.id;
    let res = await this.$api.upgradeListDetail({ data });
    if (res && res.code == 0) {
      console.log("查看结果", res);
    }
    if (this.$route.query.ifo) {
      //编辑-基础信息
      console.log("ifo是", this.$route.query.ifo);

      let time; //升级开始时间回填
      time = this.$moment(this.$route.query.ifo.beginTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      console.log(time);
      this.formData[0].beginTime = time;
      
      let arr = Object.keys(this.form);
      console.log("form是", arr);
      arr.forEach(item => {
        // item.value = this.$route.query.ifo[item.prop];
        // console.log("item是", item);
        // console.log("2222", this.$route.query.ifo[item]);
        this.form[item] = this.$route.query.ifo[item];
      });
      if(this.$route.query.ifo.softType==1||this.$route.query.ifo.softType==2){    //软件包回填 
         this.deviceShow = 1;
         this.upload1.forEach(i=>{                        // 投注终端、柜员机app 全量回填
           i.value=res.data.upgradeSoftList[0][i.prop]
         })
         this.upload2.forEach(j=>{                        // 投注终端、柜员机app 增量回填
           j.value=res.data.upgradeSoftList[1][j.prop]
         }) 
         this.tableData=res.data.upgradeSoftList          //表格回显
      } else if (this.$route.query.ifo.softType==3) {
        this.deviceShow = 3;
        this.upload3.forEach(n=>{                          //渠道APP回填
           n.value=res.data.upgradeSoftList[0][n.prop]
         }) 
        this.tableData=res.data.upgradeSoftList
      }
    }
  },
  methods: {
    relevanceUpgradeList(data) {
      //关联应用接口
      const self = this;
      (async data => {
        let res = await self.$api.relevanceUpgradeList({ data });
        if (res && res.code == 0) {
          this.associatedSoftware = res.data;
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    async handleOptions(val) {
      console.log(111, val);
      this.handleOption = val;
      if (this.handleOption == 1 || this.handleOption == 2) {
        this.deviceShow = 1;
        let res = await this.$api.querySoftPackageList({
          data: { softType: val, packageType: 0 }
        });
        let resl = await this.$api.querySoftPackageList({
          data: { softType: val, packageType: 1 }
        });
        if (res && res.code == 0) {
          //所有全量升级软件包
          console.log("res是", res);
          this.upload1[1].options = [];

          this.full = res.data;
          console.log("full是", this.full);
          this.full.forEach(item => {
            let obj = {};
            obj.label = item.name;
            obj.value = item.id;
            this.upload1[1].options.push(obj);
          });
        }
        if (resl && resl.code == 0) {
          //所有增量升级软件包
          console.log("resl是", resl);
          this.upload2[1].options = [];

          this.increment = resl.data;
          console.log("increment是", this.increment);
          this.increment.forEach(item => {
            let obj = {};
            obj.label = item.name;
            obj.value = item.id;
            this.upload2[1].options.push(obj);
          });
        }
      } else if (this.handleOption == 3) {
        this.deviceShow = 3;
        let reslt = await this.$api.querySoftPackageList({
          data: { softType: 3 }
        });
        if (reslt && reslt.code == 0) {
          //所有渠道APP软件包
          console.log("reslt是", reslt);
          this.upload3[0].options = [];
          this.channel = reslt.data;
          console.log("channel是", this.channel);
          this.channel.forEach(item => {
            let obj = {};
            obj.label = item.name;
            obj.value = item.id;
            this.upload3[0].options.push(obj);
          });
        }
      }
    },
    changeForm1(val) {
      //全量升级软件包数据回填
      let id = val.name;
      // this.obj1.softId=i
      // this.obj1.softId=val.name
      // this.obj1= Object.assign(this.obj1, val)
      this.full.forEach(item => {
        if (id == item.id) {
          this.obj1.softId = item.id;
          this.obj1 = item;
          this.upload1.forEach(j => {
            j.value = item[j.prop];
            if (j.prop == "name") {
              j.value = item.id;
            }
          });
        }
      });
      console.log("obj1", this.obj1);
    },
    changeForm2(val) {
      //增量升级软件包数据回填
      let i = val.name;
      console.log("val是", val);
      console.log("i是", i);
      this.increment.forEach(item => {
        if (i == item.id) {
          this.obj2.softId = item.id;
          this.obj2 = item;
          this.upload2.forEach(j => {
            j.value = item[j.prop];
            if (j.prop == "name") {
              j.value = item.id;
            }
          });
        }
      });
      
    },
    changeForm3(val) {
      //渠道APP软件包数据
      let i = val.name;
      // console.log("val是",i);
      // this.obj2.softId=i
      this.channel.forEach(item => {
        if (i == item.id) {
          this.obj3.softId = item.id;
          this.obj3 = item;
          this.upload3.forEach(j => {
            j.value = item[j.prop];
            if (j.prop == "name") {
              j.value = item.id;
            }
          });
        }
      });
    },
    remoteMethod(query) {
      if (query !== "") {
        if (this.form.softType == 1) {
          this.relevanceUpgradeList({ softType: 1, name: query });
        } else if (this.form.softType == 2) {
          this.relevanceUpgradeList({ softType: 2, name: query });
        } else if (this.form.softType == 3) {
          this.relevanceUpgradeList({ softType: 3, name: query });
        }

        console.log(111, this.associatedSoftware);
      }
    },
    handlerRelevance(val) {
      //关联应用回显
      console.log(val);
      this.associatedSoftware.forEach(item => {
        if (item.id == val) {
          var arr1 = item.upgradeSoftList;
          console.log(arr1);
          let arr2 = Object.keys(this.relevanceForm);
          arr2.forEach(i => {
            this.relevanceForm[i] = arr1[0][i];
          });
          this.relevanceUpload2.forEach(j => {
            j.value = arr1[1][j.prop];
          });
        }
      });
    },
    async handle(val) {
      if (val == 0) {
        this.target1 = 0;
        this.insData.length = 0;
        let reslt = await this.$api.QueryUserAndInsTree(); // 机构
        console.log("机构查询", reslt);
        if (reslt && reslt.code === 0) {
          this.insData = reslt.data;
        }
      } else if (val == 1) {
        this.target1 = 1;
        this.channelData.length = 0;
        let resl = await this.$api.upgradeChannel(); //渠道
        console.log("渠道查询", resl);
        if (resl && resl.code === 0) {
          let gameData = resl.data;
          gameData.forEach(item => {
            let obj = {};
            obj.label = item.channelNo;
            obj.value = item.channelId;
            this.channelData.push(obj);
          });
        }
      } else if (val == 2) {
        this.deviceData.length = 0;
        this.target1 = 2;
        let data = this.handleOption;
        let res = await this.$api.upgradeEquipment({ data }); //设备
        console.log("设备查询", res);
        if (res && res.code === 0) {
          let gameData = res.data;
          this.deviceData.length = 0;
          gameData.forEach(item => {
            let obj = {};
            obj.label = item.serial;
            obj.value = item.serial;

            this.deviceData.push(obj);
          });
        }
      }
    },

    handleClick(tab, event) {},
    back() {
      this.$router.back();
    },
    prev() {
      this.$refs.main.scrollTop = 0;
      if (this.active-- < 1) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    changeForm() {},
    changeSelect() {},
    handleSelectionChange() {},
    handleClick() {},
    async submit() {
      //提交
      //空闲时间段
      if (this.form.forcedType == 0) {
        this.form.leisureTime = "";
      } else {
        let leisureTime = this.form.leisureTime.map(item => {
          return this.$moment(Date.parse(item)).format("YYYY-MM-DD HH:mm:ss");
        });
        this.form.leisureTime = leisureTime.join(",");
      }
      //判断是投注||柜员机 还是渠道app
      if (this.form.softType == 1 || this.form.softType == 2) {
        if (this.obj1.versionCode == this.obj2.versionCode) {
          //判断软件版本号
          this.params.upgradeSoftList.push(this.obj1, this.obj2);
        } else {
          this.$message.error("所选软件版本号不一致");
          return;
        }
      } else if (this.form.softType == 3) {
        this.params.upgradeSoftList.push(this.obj3);
      }

      this.form.id = this.$route.query.ifo.id;
      this.form.softId = this.$route.query.ifo.softId;
      let data = {
        ...this.form,
        ...this.params
      };
      let res = await this.$api.upgradeEdit({ data });
      console.log(999, data);
      if (res && res.code == 0) {
        this.$message.success("修改成功");
        this.$router.push({ path: "./upgradePlanList" });
      } else {
        // self.$message.warning(res.msg)
      }
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-edit-wrap.first {
  width: 100%;
  margin: 50px 200px;
  .vlt-edit-btn {
    margin: 50px 0 0 300px;
    .el-button {
      width: 120px;
    }
  }
}
.vlt-edit-wrap.second {
  .vlt-edit-btn {
    margin: 0 0 0 500px;
    .el-button {
      width: 120px;
    }
  }
}
.vlt-edit-wrap.third {
  width: 900px;
  margin: 50px auto;
  .vlt-edit-btn {
    margin: 50px 0 0 350px;
    .el-button {
      width: 120px;
    }
  }
}
</style>
