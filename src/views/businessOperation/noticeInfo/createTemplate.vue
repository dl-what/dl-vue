<template>
  <div class="vlt-card create-template">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="公告模板" name="msgTemplate">
        <panel :show="true" title="基本信息">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap form-detail">
              <el-form
                :disabled="disabled"
                :model="baseForm"
                labelWidth="140px"
                ref="baseForm"
                :rules="rules"
                direction="right"
              >
                <el-form-item label="申请标题" prop="title" v-if="isValid">
                  <el-input
                    maxlength="20"
                    show-word-limit
                    v-model.trim="baseForm.title"
                    placeholder="请输入标题"
                  ></el-input>
                </el-form-item>
                <el-form-item label="模板名称" prop="templateName">
                  <el-input
                    maxlength="20"
                    show-word-limit
                    placeholder="请输入模板名称"
                    v-model.trim="baseForm.templateName"
                  ></el-input>
                </el-form-item>
                <el-form-item label="公告类型" prop="noticeType">
                  <el-select v-model="baseForm.noticeType" placeholder="请选择公告类型">
                    <el-option
                      v-for="(item, index) in noticeOptions"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="渠道类型" prop="channelType">
                  <el-select v-model="baseForm.channelType" @change="channelChange">
                    <el-option
                      v-for="(item, index) in channelType"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="模板备注">
                  <el-input
                    maxlength="200"
                    placeholder="请输入模板备注"
                    type="textarea"
                    v-model="baseForm.remark"
                  ></el-input>
                </el-form-item>
              </el-form>

              <div class="online-channel" v-if="baseForm.channelType===1">
                <el-form
                  :disabled="disabled"
                  :model="onlineForm"
                  ref="onlineForm"
                  label-width="80px"
                  :rules="rules"
                >
                  <el-form-item label="发布渠道" prop="publishType" class="post-channel">
                    <el-checkbox-group v-model="onlineForm.publishType">
                      <el-checkbox
                        v-for="(item, index) in channelOption"
                        :key="index"
                        :label="item.label"
                      >{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
                <rich-editor ref="richEditor" :routerType="$route.query.type" :content="content"></rich-editor>
              </div>

              <div v-if="baseForm.channelType===2">
                <el-form
                  :disabled="disabled"
                  :model="offlineForm"
                  ref="offlineForm"
                  direction="right"
                  labelWidth="140px"
                  :rules="rules"
                  class="content-info"
                >
                  <el-form-item label="内容形式" prop="contentForm">
                    <el-select v-model="offlineForm.contentForm">
                      <el-option
                        v-for="(item,index ) in contentOption"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="文字内容"
                    prop="noticeContent"
                    v-if="offlineForm.contentForm===1||offlineForm.contentForm===4"
                  >
                    <el-input type="textarea" maxlength="200" v-model="offlineForm.noticeContent"></el-input>
                  </el-form-item>

                  <div v-show="offlineForm.contentForm!==1">
                    <div v-if="isShow===0">
                      <el-form-item label="上传附件" v-if="offlineForm.contentForm!==4">
                        <el-upload
                          class="upload-demo"
                          drag
                          action
                          accept="image/*, video/*"
                          :limit="1"
                          :file-list="fileList"
                          :show-file-list="true"
                          :on-remove="onRemove"
                          :before-upload="beforeUploadFile"
                          :http-request="uploadFile"
                        >
                          <i class="el-icon-upload"></i>
                          <div class="el-upload__text">
                            将文件拖到此处，或
                            <em>点击上传</em>
                          </div>
                          <div class="el-upload__tip" slot="tip">只能上传图片、视频文件，且均不超过50M</div>
                        </el-upload>
                      </el-form-item>
                    </div>
                    <div v-else>
                      <el-form-item label="附件信息">
                        <ul>
                          <li v-for="(item, index) in fileList" :key="index">
                            <i class="el-icon-document"></i>
                            <span>{{item.url}}</span>
                          </li>
                        </ul>
                      </el-form-item>
                    </div>

                    <el-form-item label="播放时长" prop="runningTime" class="play-time">
                      <el-input-number
                        v-model.number="offlineForm.runningTime"
                        controls-position="right"
                        :min="1"
                        :max="60"
                      ></el-input-number>
                      <span class="unit">分钟</span>
                      <span class="remind">最大可输入：60分钟</span>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
          <div class="btn-box" v-if="type!='1'">
            <el-button
              :id="$route.name + '-' + 'submit' "
              type="primary"
              size="medium"
              @click="submit"
            >提交</el-button>
            <el-button
              :id="$route.name + '-' + 'save'"
              type="danger"
              plain
              size="medium"
              @click="save"
              v-if="isValid"
            >暂存</el-button>
            <el-button :id="$route.name + '-' + 'cancel'" size="medium" @click="cancel">取消</el-button>
          </div>
        </panel>
      </el-tab-pane>

      <el-tab-pane label="公告模板流程图" name="processImg" v-if="isValid">
        <h3>公告模板流程图</h3>
        <div style="margin-left:200px;">
          <img :src="diagramImg" alt />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import ajax from "@/utils/ajax.js";
import richEditor from "./components/richEditor";
export default {
  name: "createTemplate",
  data() {
    return {
      isShow: 0,
      isValid: false,
      type: this.$route.query.type,
      diagramImg: "",
      form: {},
      fileList: [],
      activeName: "msgTemplate",
      content: "",
      rules: {
        title: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title: "申请标题",
            // message: "申请标题不能为空",
            trigger: ["change", "blur"]
          },
          {
            min: 2,
            max: 20,
            message: "长度在2到20个字符",
            trigger: ["change", "blur"]
          }
        ],
        templateName: [
          {
            required: true,
            validator: this.$rules.checkName, 
            title: "模板名称",
            // message: "请输入模板名称",
            trigger: ["change", "blur"]
          },
          {
            min: 2,
            max: 20,
            message: "长度在2到20个字符",
            trigger: ["change", "blur"]
          }
        ],
        noticeType: [
          {
            required: true,
            message: "请选择公告类型",
            trigger: ["change", "blur"]
          }
        ],
        channelType: [
          {
            required: true,
            message: "请选择渠道类型",
            trigger: ["change", "blur"]
          }
        ],
        contentForm: [
          {
            required: true,
            message: "请选择内容形式",
            trigger: ["change", "blur"]
          }
        ],
        runningTime: [
          {
            required: true,
            message: "请输入播放时长",
            trigger: ["change", "blur"]
          }
        ],
        noticeContent: [
          {
            required: true,
            message: "请输入模板文字内容",
            trigger: ["change", "blur"]
          }
        ],
        publishType: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个发布渠道",
            trigger: ["change", "blur"]
          }
        ]
      },

      baseForm: {
        title: null,
        templateName: null,
        noticeType: null,
        channelType: 2,
        remark: null
      },
      channelType: [
        { label: "线上渠道", value: 1 },
        { label: "线下渠道", value: 2 }
      ],
      noticeOptions: [],

      offlineForm: {
        contentForm: null,
        runningTime: null,
        noticeContent: null
      },
      onlineForm: { publishType: [] },
      channelOption: [
        { value: "官网", label: 0 },
        { value: "微信公众号", label: 1 },
        { value: "彩民APP", label: 2 }
      ],
      contentOption: [
        { label: "文字", value: 1 },
        { label: "图片", value: 2 },
        { label: "视频", value: 3 },
        { label: "走马灯", value: 4 }
      ],
      insId: this.$storage.get("userInfo").insId
    };
  },
  created() {
    this.disabled = this.$route.query.type == "1" ? true : false;
    this.isShow = this.$route.query.type == "1" ? 1 : 0;
    this.validProcess();
    this.querytemplateType();
    if (this.$route.query.id) {
      let data = this.$route.query.id;
      this.getTaskData(data);
    } else {
      this.isShow = 0;
    }
  },
  methods: {
    // 回填表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          let data = JSON.parse(res.data.data);
          console.log("回填数据", data);
          self.init(data);
        }
      })(data);
    },
    init(data) {
      const self = this;
      console.log(data);
      Object.keys(this.baseForm).forEach(key => {
        this.baseForm[key] = data[key];
      });
      if (data.channelType === 1) {
        self.onlineForm.publishType = data.publishType.split(",").map(item => {
          return Number(item);
        });
        self.content = data.noticeContent;
      } else if (data.channelType === 2) {
        self.offlineForm.contentForm = data.contentForm;
        self.offlineForm.noticeContent = data.noticeContent;
        if (data.runningTime) {
          self.offlineForm.runningTime = data.runningTime;
        }
        let obj = {
          url: data.noticeContent,
          name: data.contentName,
          md5: data.fileMd5
        };
        this.fileList.push(obj);
      }
    },
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let data = {
        router: this.$route.name,
        actBusinessInsId: this.insId
      };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.insId}`;
        }
      })(data);
    },
    //获取公告类型
    async querytemplateType() {
      let res = await this.$api.querytemplateType();
      console.log(res);
      if (res && res.code === 0) {
        this.noticeOptions = res.data;
      }
    },
    // 提交
    async submit() {
      const self = this;
      let baseValid;
      let contentValid;
      let contentForm;
      this.$refs.baseForm.validate(valid => {
        baseValid = valid;
      });
      if (this.baseForm.channelType === 1) {
        contentForm = this.onlineForm;
        this.$refs.onlineForm.validate(valid => {
          contentValid = valid;
        });
      } else if (this.baseForm.channelType === 2) {
        contentForm = this.offlineForm;
        this.$refs.offlineForm.validate(valid => {
          contentValid = valid;
        });
      }
      if (baseValid && contentValid) {
        let data = {
          ...this.baseForm,
          ...contentForm
        };
        if (this.baseForm.channelType === 1) {
          data.noticeContent = this.$refs.richEditor.contentForm;
          data.publishType = this.onlineForm.publishType.join(",");
        } else {
          if (this.offlineForm.contentForm === 1) {
            data.noticeContent = this.offlineForm.noticeContent;
            delete data.runningTime;
          } else if (this.offlineForm.contentForm === 4) {
            data.noticeContent = this.offlineForm.noticeContent;
          } else {
            if (this.fileList.length) {
              data.contentName = this.fileList[0].name;
              data.md5 = this.fileList[0].md5;
              data.noticeContent = this.fileList[0].url;
            }
          }
        }

        console.log(data);
        if (self.isValid) {
          let str = JSON.stringify(data);
          data.actBusiness = {
            actBusinessInsId: this.insId,
            router: self.$route.name,
            title: self.baseForm.title,
            id: self.$route.query.id,
            data: str
          };
          if (!self.$route.query.id) {
            delete data.actBusiness.id;
          }
        } else {
          delete data.title;
        }

        let res = await this.$api.noticeTemplateCreate({
          message: "提交成功",
          data
        });
        if (res && res.code === 0) {
          this.$router.back();
        }
      }
    },
    // 保存
    save() {
      const self = this;
      if (!self.baseForm.title) {
        this.$message.warning("申请标题不能为空");
        return;
      }
      let contentForm;
      if (this.baseForm.channelType === 1) {
        contentForm = this.onlineForm;
      }
      if (this.baseForm.channelType === 2) {
        contentForm = this.offlineForm;
      }

      let data = {
        ...this.baseForm,
        ...contentForm
      };
      if (this.baseForm.channelType === 1) {
        data.noticeContent = this.$refs.richEditor.contentForm;
        data.publishType = this.onlineForm.publishType.join(",");
      } else {
        if (this.offlineForm.contentForm === 1) {
          data.noticeContent = this.offlineForm.noticeContent;
          delete data.runningTime;
        } else if (this.offlineForm.contentForm === 4) {
          data.noticeContent = this.offlineForm.noticeContent;
        } else {
          if (this.fileList.length) {
            data.contentName = this.fileList[0].name;
            data.md5 = this.fileList[0].md5;
            data.noticeContent = this.fileList[0].url;
          }
        }
      }
      console.log(data);
      let params = {
        actBusinessInsId: this.insId,
        router: self.$route.name,
        title: self.baseForm.title,
        id: self.$route.query.id,
        data: JSON.stringify(data)
      };
      if (!self.$route.query.id) {
        delete params.id;
      }
      console.log("暂存的参数", params);
      self.saveDraft(params);
    },
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("保存成功");
          self.$router.push({ name: "myApplications" });
        }
      })(data);
    },

    channelChange(val) {
      for (let key in this.baseForm) {
        if (key != "channelType") {
          this.baseForm[key] = null;
        }
      }
    },
    cancel() {
      this.$router.back();
    },

    beforeUploadFile(file) {
      const isLt20M = file.size / 1024 / 1024 < 50;
      if (!isLt20M) {
        this.$message.error("上传附件大小不能超过 50MB!");
      }
      return isLt20M;
    },
    // 附件上传
    async uploadFile(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      const res = await this.$api.noticeUploading({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          let percent = ((evt.loaded / evt.total) * 100) | 0;
          files.onProgress({ percent: percent });
        }
      });
      if (res && res.code == 0) {
        console.log("uploadFile", res);
        let obj = {
          name: res.data.fileName,
          url: res.data.filePath,
          md5: res.data.fileMd5
        };

        this.fileList.push(obj);
        this.$message.success("上传成功");
      }
    },
    onRemove(file) {
      this.fileList.forEach((item, index) => {
        if (item.name == file.name) {
          this.fileList.splice(index, 1);
        }
      });
    },
    handleClick() {}
  },
  components: { richEditor }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>
