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
          label-width="120px"
          ref="formbase"
          :rules="rules1"
          :model="form"
          class="baseInfo"
          :disabled="type!='0'"
        >
          <el-form-item label="申请标题" prop="title" v-if="isValid">
            <el-input v-model.trim="form.title" placeholder="请输入申请标题" show-word-limit maxlength="30"></el-input>
            <!-- :disabled="type!='0'" -->
          </el-form-item>
          <el-form-item label="升级计划名称" prop="name">
            <el-input
              v-model.trim="form.name"
              placeholder="请输入升级计划名称"
              show-word-limit
              maxlength="30"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="软件类型" prop="softType">
            <el-select v-model="form.softType" placeholder="请选择软件类型" @change="handleOptions">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级目标" prop="targetType" v-if="targetTypeShow===0">
            <el-select v-model="form.targetType" placeholder="请选择升级目标" @change="handle">
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
                :label="item.channelNo"
                :value="item.channelId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择设备" v-else-if="target1===2" prop="target">
            <el-select v-model="form.target" placeholder="请选择">
              <el-option
                v-for="(item,index) in deviceData"
                :key="index"
                :label="item.serial"
                :value="item.serial"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级方式" prop="theWay">
            <el-select v-model="form.theWay" placeholder="请选择升级方式" :disabled="theWayDisabled">
              <el-option
                v-for="(item) in wayOptins"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级类型" prop="forcedType">
            <el-radio v-model="form.forcedType" :label="0" @change="handleLeisur">强制升级</el-radio>
              <el-radio
                v-model="form.forcedType"
                :label="1"
                @change="handleLeisure"
                :disabled="radioDisabled"
              >空闲升级</el-radio>
          </el-form-item>
          <el-form-item label="空闲升级时间" prop="leisureTime" v-if="form.forcedType==1">
            <el-date-picker
              type="datetimerange"
              :picker-options="pickOptions"
              v-model="form.leisureTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              v-if="leisure==1"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" placeholder="请输入备注" :autosize="{minRows: 3, maxRows: 10}" v-model="form.remark" maxlength="100"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="vlt-edit-btn">
          <el-button size="medium" @click="back" class="cancel">返 回</el-button>
          <el-button type="primary" v-prevent="1000" size="medium" @click="next('base')">下一步</el-button>
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
                        ref="fullUpgrade"
                        :rules="rules"
                        direction="right"
                        @change="changeForm1"
                        :disabled="type!='0'"
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
                        ref="incrementalUpgrade"
                        :rules="rules"
                        direction="right"
                        @change="changeForm2"
                        :disabled="type!='0'"
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
                    ref="channelApp"
                    :rules="rules"
                    direction="right"
                    @change="changeForm3"
                    :disabled="type!='0'"
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
                      label-width="140px"
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
                        <el-input v-model="relevanceForm.name" placeholder="请输入软件名称" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="版本号">
                        <el-input v-model="relevanceForm.versionCode" placeholder="请输入版本号" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="软件大小">
                        <el-input
                          v-model="relevanceForm.softwareSize"
                          placeholder="请输入软件大小"
                          disabled
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="软件描述">
                        <el-input v-model="relevanceForm.remark" placeholder="请输入软件描述" disabled></el-input>
                      </el-form-item>
                      <el-form-item label="新版特性">
                        <el-input
                          v-model="relevanceForm.characteristic"
                          placeholder="请输入新版特性"
                          disabled
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="更新字段" prop="updateField">
                        <el-input
                          v-model="relevanceForm.updateField"
                          type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          placeholder="请输入更新字段"
                          maxlength="150"
                          disabled
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
                  label-width="100px"
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
                    <el-input v-model="relevanceForm.name" disabled placeholder="请输入软件名称"></el-input>
                  </el-form-item>
                  <el-form-item label="版本号">
                    <el-input v-model="relevanceForm.versionCode" disabled placeholder="请输入版本号"></el-input>
                  </el-form-item>
                  <el-form-item label="软件大小">
                    <el-input v-model="relevanceForm.softwareSize" disabled placeholder="请输入软件大小"></el-input>
                  </el-form-item>
                  <el-form-item label="软件描述">
                    <el-input v-model="relevanceForm.remark" disabled placeholder="请输入软件描述"></el-input>
                  </el-form-item>
                  <el-form-item label="新版特性">
                    <el-input v-model="relevanceForm.characteristic" disabled placeholder="请输入新版特性"></el-input>
                  </el-form-item>
                  <el-form-item label="更新字段" prop="updateField">
                    <el-input
                      v-model="relevanceForm.updateField"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入更新字段"
                      disabled
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-row class="vlt-edit-btn">
          <el-button size="medium" @click="prev" class="cancel">上一步</el-button>
          <el-button type="primary" v-prevent="1000" size="medium" @click="next('table')">下一步</el-button>
        </el-row>
      </div>
    </div>
    <div class="vlt-edit-single" v-show="active==2">
      <div class="vlt-edit-wrap third">
        <el-tabs v-model="selected" @tab-click="handleClick" style="width:900px;margin: 0 auto">
          <el-tab-pane label="升级计划" name="0">
            <!-- <base-form
              :formData="formData"
              labelWidth="100px"
              style="margin-top:20px"
              ref="baseForm"
              :rules="rules"
              direction="right"
              @change="changeForm"
              :disabled="type!='0'"
            ></base-form> -->
            <el-form
              label-position="right"
              label-width="100px"
              ref="baseForm"
              :rules="rules"
              :model="formDatas"
              class="baseInfo"
              :disabled="type!='0'">
              <el-form-item label="升级时间" prop="beginTime">
                <el-date-picker type="datetime"
                  :picker-options="pickerOptions"
                  v-model="formDatas.beginTime"
                  @change="changeTime"
                  placeholder="请选择升级时间">
                </el-date-picker>
              </el-form-item>
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
            <!-- v-if="type=='0'" -->
            <el-row class="vlt-edit-btn" v-if="type=='0'">
              <el-button
                size="medium"
                @click="prev('table')"
                class="cancel"
                :id="$route.name+'-'+'prev'"
              >上一步</el-button>
              <el-button
                type="danger"
                plain
                v-prevent="1000"
                size="medium"
                @click="save"
                v-if="isValid"
                :id="$route.name+'-'+'save'"
              >暂 存</el-button>
              <el-button
                type="primary"
                v-prevent="1000"
                size="medium"
                @click="submit"
                :id="$route.name+'-'+'submit'"
              >提 交</el-button>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="升级计划流程图" name="1">
            <div>
              <img :src="diagramImg" alt />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import { mapGetters } from "vuex";
import ajax from "@/utils/ajax.js";
import { delimiter } from "path";

export default {
  name: "upgradePlanListEdit",
  data() {
    return {
      selected: "0",
      targetTypeShow: 0,
      radioDisabled: null,
      pickOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      relevanceName: [],
      value: [],
      list: [],
      loading: false,
      states: [],
      relevanceForm: {
        name: "",
        versionCode: "",
        softwareSize: "",
        remark: "",
        characteristic: "",
        updateField: ""
      },
      form: {
        title: "",
        name: "",
        softType: "",
        targetType: null,
        target: "",
        theWay: "",
        forcedType: "",
        remark: "",
        leisureTime: "",
        beginTime: ""
      },
      rules1: {
        title: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "申请标题",
            trigger: ["change", "blur"]
          }
        ],
        name: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "升级计划名称",
            trigger: ["change", "blur"]
          }
        ],
        softType: [
          {
            required: true,
            message: "软件类型不能为空",
            trigger: ["change", "blur"]
          }
        ],
        targetType: [
          {
            required: true,
            message: "升级目标不能为空",
            trigger: ["change", "blur"]
          }
        ],
        target: [
          {
            required: true,
            message: "所属渠道不能为空",
            trigger: ["change", "blur"]
          }
        ],
        theWay: [
          {
            required: true,
            message: "升级方式不能为空",
            trigger: ["change", "blur"]
          }
        ],
        forcedType: [
          {
            required: true,
            message: "升级类型不能为空",
            trigger: ["change", "blur"]
          }
        ],
        leisureTime: [
          {required: true,message: "空闲升级时间不能为空",trigger: ["change", "blur"]}
        ]
      },
      rules: {
        beginTime: [
          {
            required: true,
            message: "请输入升级时间",
            trigger: ["change", "blur"]
          }
        ],
        name: [
          {
            required: true,
            validator: this.$rules.checkName,
            message: "名称",
            trigger: ["change", "blur"]
          }
        ]
      },
      active: 0,
      options: [
        { label: "投注终端", value: 1 },
        { label: "柜员机软件", value: 2 },
        { label: "维护APP", value: 3 }
      ],
      wayOptins: [
        { label: "全量升级", value: 1 },
        { label: "增量升级", value: 2 }
      ],
      planOptions: [
        { label: "机构", value: 0 },
        { label: "渠道", value: 1 },
        { label: "设备", value: 2 }
      ],
      tableData: [],
      activeName: "0",
      pickerOptions: this.beginDate(),
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
          disabled: true,
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "更新字段",
          type: "textarea",
          prop: "updateField",
          disabled: true,
          value: ""
        }
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
          disabled: true,
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "更新字段",
          type: "textarea",
          prop: "updateField",
          disabled: true,
          value: ""
        }
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
          disabled: true,
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "更新字段",
          type: "textarea",
          prop: "updateField",
          disabled: true,
          value: ""
        }
      ],
      relevanceUpload2: [
        {
          title: "软件名称",
          type: "input",
          prop: "name",
          value: "",
          disabled: true,
          placeholder: ""
        },
        // {title: "版本名称",type: "input",prop: "versionName",value: "",placeholder: ""},
        {
          title: "版本号",
          type: "input",
          prop: "versionCode",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "版本大小",
          type: "input",
          prop: "softwareSize",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "软件描述",
          type: "input",
          prop: "remark",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "新版特性",
          type: "input",
          prop: "characteristic",
          value: "",
          disabled: true,
          placeholder: ""
        },
        {
          title: "更新字段",
          type: "textarea",
          prop: "updateField",
          disabled: true,
          value: ""
        }
      ],
      formData: [
        {
          title: "升级时间",
          type: "datetime",
          prop: "beginTime",
          value: ""
        }
      ],
      formDatas: {
        beginTime: ""
      },
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
      theWayDisabled: null,
      insData: [],
      channelData: [],
      deviceData: [],
      target1: 4,
      deviceShow: 1,
      leisure: 2,
      handleOption: "",
      full: [],
      increment: [],
      channel: [],
      obj1: {
        softId: ""
      },
      obj2: {},
      obj3: {},
      relevanceTable: [],
      associatedSoftware: [],
      isValid: false,
      diagramImg: "",
      tabsIndex: "",
      actBusinessInsId: null,
      queryId: null,
      type: this.$route.query.type
    };
  },
  watch: {
    "formDatas.beginTime": {
      handler(newValue) { // 对于过去的时分秒置灰不能选择
        let time = new Date().setHours(0, 0, 0, 0) + 86400000;
        let now = new Date(newValue).getTime()
        if(now-time>0) { // 选择的是明天之后的时间
          this.pickerOptions.selectableRange = '00:00:00-23:59:59'
        }else{
          this.pickerOptions.selectableRange = `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
        }
      },
      deep: true,
    }
  },
  async created() {
    this.validProcess();
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get("userInfo").insId;
    if (this.$route.query.id) {
      // 获取表单数据详情
      this.queryId = this.$route.query.id;
      console.log(this.queryId);
      let data = this.$route.query.id;
      this.getTaskData(data);
    }
  },
  // computed: {
  //   ...mapGetters(["insData"])
  // },
  methods: {
    changeTime(val) {
      let time = new Date(val).getTime();
      let now = new Date().getTime()
      if(now-time>0) { // 选择的是过去时间
        this.formDatas.beginTime = now;
      }
    },
    beginDate(){
      let self = this
      return {
        disabledDate(time)  {
          return time.getTime() < Date.now() - 8.64e7 // 过去时间不可选
        },
        selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
      }
    },
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
    async init(data) {
      console.log("回填的参数", data);
      const self = this;
      //基础信息回显
      for (let i in self.form) {
        self.form[i] = data[i];
      }
      if (data.softType == 3) {
        self.targetTypeShow = 1;
        self.target1 = 4;
        self.theWayDisabled = true;
        self.form.forcedType = 0;
        self.radioDisabled = true;
        self.deviceShow = 3;
      }
      //机构回显
      if (data.targetType == 0) {
        //机构回显
        self.target1 = 0;
        this.QueryUserAndInsTree();
      } else if (data.targetType == 1) {
        //渠道回显
        self.target1 = 1;
        this.upgradeChannel();
      } else if (data.targetType == 2) {
        //设备回显
        self.target1 = 2;
        // this.upgradeEquipment(self.form.softType);
      }
      //空闲时间回显
      if (data.forcedType == 1) {
        self.leisure = 1;
        self.form.leisureTime = data.leisureTime.split(",");
      }
      //选择软件回显
      if (data.softType == 1 || data.softType == 2) {
        this.upload1.forEach(item => {
          item.value = data.upgradeSoftList[0][item.prop];
        });
        this.upload2.forEach(j => {
          j.value = data.upgradeSoftList[1][j.prop];
        });
      } else if (data.softType == 3) {
        this.upload3.forEach(i => {
          i.value = data.upgradeSoftList[0][i.prop];
        });
      }
      //创建计划回显
      self.tableData = data.upgradeSoftList;
      console.log("123", self.tableData);
      self.params.upgradeSoftList = data.upgradeSoftList;
      self.formData[0].value = data.beginTime;
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
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.actBusinessInsId}`;
          // ajax.baseURL + "/act/business/diagram/upgradePlanListAdd";
        }
      })(data);
    },
    relevanceUpgradeList(data) {
      //关联应用接口
      const self = this;
      (async data => {
        let res = await self.$api.relevanceUpgradeList({ data });
        if (res && res.code == 0) {
          this.associatedSoftware = res.data;
          console.log(this.associatedSoftware);
        } else {
        }
      })(data);
    },
    async handleOptions(val) {
      console.log(111, val);
      this.handleOption = val;
      if (this.handleOption == 1 || this.handleOption == 2) {
        this.targetTypeShow = 0;
        this.radioDisabled = false;
        this.theWayDisabled = false;
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
        //选择维护APP时隐藏升级目标 所属渠道
        this.targetTypeShow = 1;
        this.target1 = 4;
        this.theWayDisabled = true;
        this.form.forcedType = 0;
        this.radioDisabled = true;
        this.form.theWay = 1;
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
      // console.log("val是", val);
      // console.log("id是", id);
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
      // console.log("val是",i);
      // this.obj2.softId=i
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
      // this.list.push(this.obj1, this.obj2);
      // this.tableData = this.list;
    },
    changeForm3(val) {
      //渠道APP软件包数据回填
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
      //关联应用
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
      //关联应用——所有软件包
      console.log(val);
      this.associatedSoftware.forEach(item => {
        if (item.id == val) {
          this.relevanceTable = item.upgradeSoftList;
          console.log(this.relevanceTable);
          let arr1 = item.upgradeSoftList;
          // console.log(arr1);
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
    QueryUserAndInsTree(data) {
      //机构数据
      const self = this;
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          this.insData = res.data;
          console.log("机构数据", res.data);
        }
      })(data);
    },
    upgradeChannel(data) {
      //渠道数据
      const self = this;
      (async data => {
        let res = await self.$api.upgradeChannel({ data });
        if (res && res.code == 0) {
          this.channelData = res.data;
          console.log("渠道数据", res.data);
        }
      })(data);
    },
    upgradeEquipment(data) {
      //设备数据
      const self = this;
      (async data => {
        let res = await self.$api.upgradeEquipment({ data: self.handleOption });
        if (res && res.code == 0) {
          this.deviceData = res.data;
          console.log("设备数据", res.data);
        }
      })(data);
    },
    async handle(val) {
      //选择升级目标
      if (val == 0) {
        this.target1 = 0;
        this.QueryUserAndInsTree(); //机构
      } else if (val == 1) {
        this.target1 = 1;
        //获取渠道编号列表-下拉框
        this.upgradeChannel(); //渠道
      } else if (val == 2) {
        this.target1 = 2;
        this.upgradeEquipment(); //设备
      }
    },
    handleLeisur(val) {
      console.log(val);
      if (val == 0) {
        this.leisure = 2;
      }
    },
    handleLeisure(val) {
      //空闲升级时间显示
      console.log(val);
      if (val) {
        this.leisure = 1;
      }
    },
    handleClick(tab, event) {
      this.tabsIndex = tab.index;
      console.log(this.tabsIndex);
    },
    back() {
      this.$router.back();
    },
    prev(flag) {
      this.$refs.main.scrollTop = 0;
      if (this.active-- < 1) this.active = 0;
      if (flag == "table") {
        //返回上一步 表格清空
        this.list = [];
        this.params.upgradeSoftList = [];
        // if (this.active-- < 1) this.active = 0;
      }
    },
    next(flag) {
      if (flag == "base") {
        this.$refs["formbase"].validate(valid => {
          if (valid) {
            if (this.active++ > 2) this.active = 0;
          }
        });
      }
      //  表格回填软件报数据
      if (flag == "table") {
        // this.$refs.baseForm.validate( (val) => {
        // if (val === "true") {
        // console.log(val)

        if (this.tabsIndex == 0) {
          //上传应用和关联应用的表格回填
          if (this.form.softType == 1 || this.form.softType == 2) {
            //投注终端、柜员机软件
            // this.list.push(this.obj1, this.obj2);
            if (this.obj1.versionCode == this.obj2.versionCode) {
              //判断软件版本号
              this.params.upgradeSoftList.push(this.obj1, this.obj2);
            } else {
              this.$message.error("所选软件版本号不一致");
              return;
            }
            //全量软件名称验证
            let fullUpgradeInfo = false;
            this.$refs.fullUpgrade.$refs.form.validate(valid => {
              if (valid) {
                fullUpgradeInfo = true;
              }
            });
            //增量软件名称验证
            let incrementalUpgradeInfo = false;
            this.$refs.incrementalUpgrade.$refs.form.validate(valid => {
              if (valid) {
                incrementalUpgradeInfo = true;
              }
            });
            if (fullUpgradeInfo && incrementalUpgradeInfo) {
              if (this.active++ > 2) this.active = 0;
            }
          } else if (this.form.softType == 3) {
            //渠道App
            // this.list.push(this.obj3);
            this.params.upgradeSoftList.push(this.obj3);
            //软件名称为空验证
            let channelAppInfo = false;
            this.$refs.channelApp.$refs.form.validate(valid => {
              if (valid) {
                channelAppInfo = true;
              }
            });
            if (channelAppInfo) {
              if (this.active++ > 2) this.active = 0;
            }
          }

          // this.tableData = this.list;
          //上传应用
          // if (this.form.softType == 1 || this.form.softType == 2) {
          // if (this.obj1.versionCode == this.obj2.versionCode) {
          //   //判断软件版本号
          //   this.params.upgradeSoftList.push(this.obj1, this.obj2);
          // } else {
          //   this.$message.error("所选软件版本号不一致");
          //   return;
          // }
          // } else if (this.form.softType == 3) {
          //   this.params.upgradeSoftList.push(this.obj3);
          // }
          this.tableData = this.params.upgradeSoftList;
        } else if (this.tabsIndex == 1) {
          this.tableData = this.relevanceTable;
          if (this.active++ > 2) this.active = 0;
          //关联应用
          // if (this.tabsIndex == 1) {
          // this.params.upgradeSoftList=[]
          console.log(this.relevanceTable);
          this.params.upgradeSoftList = this.relevanceTable;
          // }
        }
      }
    },
    changeForm(form) {
      console.log(form);
      Object.assign(this.formDatas, form);
    },
    changeSelect() {},
    handleSelectionChange() {},
    // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("保存成功");
          self.$router.back();
        }
      })(data);
    },
    save() {
      const self = this;
      self.$refs.baseForm.validate(async val => {
        if (val) {
          //暂存
          // self.form.id = self.$route.query.ifo.id;

          let target = "";
          if (self.form.targetType === 0) {
            // let arr = self.form.target.map(item => {
            //   item = item.pop();
            //   return item;
            // });
            // console.log(arr);
            // self.form.target = arr.join(",");
            target = self.form.target
              .map(item => item[item.length - 1])
              .join(",");
          } else {
            target = self.form.target;
          }
          //升级开始时间
          self.form.beginTime = new Date(self.formDatas.beginTime).getTime();

          //空闲时间
          // let time,start;
          // if(self.forcedType==1){
          //  time = self.$moment(self.form.leisureTime[0]).format("YYYY-MM-DD HH:mm:ss")
          // console.log(leisureTime.join(','))

          let leisureTime = self.form.leisureTime
            .map(item => {
              return self.$moment(Date.parse(item)).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            })
            .join(",");
          
          //判断是投注||柜员机 还是渠道app
          self.obj1.id = null;
          self.obj2.id = null;
          self.obj3.id = null;

          let data = {
            ...self.form,
            ...self.params,
            target: target,
            leisureTime: leisureTime
          };
          // 走流程de参数
          let str = JSON.stringify(data);
          data = {
            router: "upgradePlanListAdd",
            title: self.form.title,
            // id: self.$route.query.id, // 从我的申请-编辑 需要带上id
            data: str
          };

          // if(!self.$route.query.id) { // 直接提交 不需要带上
          //   delete data.actBusiness.id;
          // }
          console.log("暂存的参数", data);
          self.saveDraft(data);
        }
      });
    },
    submit() {
      const self = this;
      self.$refs.baseForm.validate(async val => {
        if (val) {
          //提交
          // self.form.id = self.$route.query.ifo.id;
          let target = ""; //机构
          if (self.queryId == null) {
            if (self.form.targetType === 0) {
              //选择机构
              // self.form.target = self.form.target.join(",");
              // let arr = self.form.target.map(item => {
              //   item = item.pop();
              //   return item;
              // });
              // console.log(arr);
              // self.form.target = arr.join(",");
              target = self.form.target
                .map(item => item[item.length - 1])
                .join(",");
            } else {
              target = self.form.target;
            }
          } else {
            target = self.form.target;
          }
          // 升级开始时间
          self.form.beginTime = new Date(self.formDatas.beginTime).getTime();

          let leisureTime = ""; //空闲时间段
          if (self.form.forcedType == 0) {
            // self.form.leisureTime = "";
            leisureTime = self.form.leisureTime;
          } else {
            console.log(self.form.leisureTime);
            leisureTime = self.form.leisureTime
              .map(item => {
                return self.$moment(Date.parse(item)).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              })
              .join(",");
          }
          //判断是投注||柜员机 还是渠道app
          self.obj1.id = null;
          self.obj2.id = null;
          self.obj3.id = null;

          //暂存编辑提交
          self.params.upgradeSoftList.forEach((item, index) => {
            if (item.softId == "") {
              self.params.upgradeSoftList.splice(index, 1);
            }
          });
          self.params.upgradeSoftList.forEach((item, index) => {
            if (item.hasOwnProperty("softId") == false) {
              self.params.upgradeSoftList.splice(index, 1);
            }
          });
          let data = {
            ...self.form,
            ...self.params,
            // target: self.form.target.map(item => item[item.length - 1]).join(',')
            target: target,
            leisureTime: leisureTime
          };
          if (self.isValid) {
            // 走流程de参数
            let str = JSON.stringify(data);
            data.actBusiness = {
              router: "upgradePlanListAdd",
              title: self.form.title,
              id: self.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str
            };
            if (!self.$route.query.id) {
              // 直接提交 不需要带上
              delete data.actBusiness.id;
            }
          } else {
            delete data.title;
          }

          let res = await self.$api.addUpgrade({ message: "新增成功", data });
          console.log(999, data);
          if (res && res.code == 0) {
            // self.$message.success("新增成功");
            // self.$router.push({ name: "myApplication" });
            self.$router.back();
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-edit-wrap {
  .vlt-edit-btn {
    text-align: center;
    margin: 50px 0 0;
    .el-button {
      width: 120px;
    }
  }
}
.first{
  width: 60%;
  margin: 40px auto 0;
}
.vlt-edit-wrap.second {
  .vlt-edit-btn {
    margin: 0 0 0 450px;
    .el-button {
      width: 120px;
    }
  }
}
.vlt-edit-wrap.third {
  width: 900px;
  margin: 50px auto;
  .vlt-edit-btn {
    margin: 30px 0 0 150px;
    .el-button {
      width: 120px;
    }
  }
}
</style>
