<template>
  <el-dialog
    title="编辑终端管理控制"
    :visible.sync="dialogFormVisible"
    custom-class="TerminaDialog"
    :before-close="cancel"
    :close-on-click-modal="false"
  >
    <div class="vlt-edit-single">
      <el-form
        :model="formDatas"
        labelWidth="140px"
        ref="baseForm"
        :rules="rules"
        direction="right"
        @change="changeForm"
      >
        <el-form-item label="所属机构" prop="insId">
          <el-cascader
            v-model="formDatas.insId"
            :options="formDatas.insOptions.options"
            :props="formDatas.insOptions.setProps"
            @change="insChange(formDatas.insId)"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="所属渠道" prop="channelId">
          <el-select
            v-model="formDatas.channelId"
            placeholder="请选择所属渠道"
            :disabled="formDatas.subtoChannel.disabled"
            @change="channelChange(formDatas.channelId)"
          >
            <el-option
              v-for="item in formDatas.subtoChannel.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端类型" prop="terminalType">
          <el-select v-model="formDatas.terminalType" placeholder="请选择终端类型">
            <el-option label="全部" value="0"></el-option>
            <el-option label="终端机" value="1"></el-option>
            <el-option label="柜员机" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-select  v-model="formDatas.deviceModel"
            placeholder="请选择设备型号"
            :disabled="formDatas.devices.disabled"
            @change="channeldeviceModel(formDatas.deviceModel)"
          >
            <el-option
              v-for="item in formDatas.devices.options"
              :key="item.value"
              :label="item.label"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备序列号" prop="terminalCode">
          <el-input v-model.trim="formDatas.terminalCode" placeholder="请输入设备序列号"  maxlength="40" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="事件类型" prop="eventType">
          <el-select v-model="formDatas.eventType" placeholder="请选择事件类型">
            <el-option label="重启" value="0"></el-option>
            <el-option label="关机" value="1"></el-option>
            <el-option label="截屏上传" value="2"></el-option>
            <el-option label="日志上传" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row class="vlt-edit-btn">
        <div style="text-align:right; padding-right: 100px;">
          <el-button id="sendTermina-submit" type="primary" v-prevent="1000" size="medium" @click="submit('baseForm')">提 交</el-button>
          <el-button id="sendTermina-cancel" size="medium" @click="cancel">取 消</el-button>
        </div>
      </el-row>
    </div>
  </el-dialog>
</template>
<script type="text/javascript">
import storage from '@/utils/storage'
export default {
  name: "sendTermina",
  props: {
    insData: {
      type: Array
    },
    isShow: {
      type: Boolean
    }
  },
  data() {
    return {
      params: {
        channelId: '',
        channelName: "",
        createBy: 0,
        createTime: "",
        deviceModel: "",
        eventType: 0,
        insId: 0,
        insName: "",
        terminalCode: "",
        terminalType: 0
      },
      dialogFormVisible: false,
      formDatas: {
        insId: "",
        insOptions: {
          options: this.insData,
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        channelId: "",
        subtoChannel: {
          channelId: "",
          options: [
            {
              label: "",
              value: ""
            }
          ],
          disabled: true
        },
        terminalType: "",
        deviceModel: "",
        devices: {
          options: [],
          deviceModel: "",
          disabled: true
        },
        terminalCode: "",
        eventType: ""
      },
      rules: {
        insId: [
          { required: true, message: "请选择所属机构", trigger: ['change','blur'] }
        ],
        channelId: [
          { required: true, message: "请选择所属渠道", trigger: ['change','blur'] }
        ],
        terminalType: [
          { required: true, message: "请选择终端类型", trigger: ['change','blur'] }
        ],
        deviceModel: [
          { required: true, message: "请选择设备型号", trigger: ['change','blur'] }
        ],
        terminalCode: [
          { required: false, validator: this.$rules.checkGameCode, title: "设备序列号", trigger: ['change','blur']  }
        ],
        eventType: [
          { required: true, message: "请选择事件类型", trigger: ['change','blur'] }
        ]
      },
      userInfo: storage.get('userInfo')
    };
  },
  watch: {
    isShow(val) {
      this.dialogFormVisible = val;
    },
    insData: {
      handler(newVal, oldVal) {
        console.log("newVal", newVal);
        this.$set(this.formDatas.insOptions, "options", newVal);
      },
      deep: true
    },
    formDatas: {
      handler(newVal, oldVal) {
        console.log(newVal);
      },
      deep: true
    }
  },
  computed: {},
  components: {},
  methods: {
    insChange(id) {
      if (Array.isArray(id)) {
        this.params.insId = id[id.length - 1];
        this.params.insName =  this.$formMethods.getInsArray(this.params.insId,'id', this.insData, 'text')[0];
        console.log(this.params.insId, this.params.insName);
      } else {
        this.params.insId = id;
      }
      this.getCurrentChannels(this.params.insId);
    },
    channelChange(selectedOptions) {
      if (selectedOptions) {
        this.params.channelId = selectedOptions.value;
        this.params.channelName = selectedOptions.label;
        console.log('select', selectedOptions);
        this.getQueryDeviceModel(selectedOptions.value);
      }
    },
    changeForm(val) {
      this.params = Object.assign(this.params, val);
      console.log("派发出来的参数", this.params);
    },
    channeldeviceModel(val){
      console.log(val);
      this.params.deviceModel = val.label
    },
    // 根据机构树id获取渠道
    getCurrentChannels(id, channelId) {
      let self = this;
      (async id => {
        let res = await self.$api.getCurrentChannels({ data: id });
        if (res && res.code == 0) {
          console.log("res------", res.data);
          if (res.data.length) {
            let channelList = res.data;
            let options = [];
            channelList &&
              channelList.forEach(item => {
                options.push({
                  label: item.channelNo,
                  value: item.channelId
                });
              });
            self.$set(self.formDatas.subtoChannel, "options", options);
            self.$set(self.formDatas.subtoChannel, "disabled", false);
          } else {
            self.$set(self.formDatas.subtoChannel, "options", []);
            self.$message({
              message: '此机构树下暂无渠道!',
              type: 'warning'
            })
            self.$set(self.formDatas.subtoChannel, "disabled", true);
            // self.form.channelId = '';
          }
        } else {
          // self.$message.warning(res.msg)
        }
      })(id);
    },
    // 根据渠道获取设备型号
    getQueryDeviceModel(id) {
      let self = this;
      (async id => {
        console.log('id is',id);
        let res = await self.$api.getQueryDeviceModel({ data: id });
        if (res && res.code == 0) {
          console.log("设备型号------", res.data);
          if (res.data.length) {
            let channelList = res.data;
            let options = [];
            channelList &&
              channelList.forEach(item => {
                options.push({
                  label: item.deviceModel,
                  value: item.deviceModel
                });
              });
            self.$set(self.formDatas.devices, "options", options);
            self.$set(self.formDatas.devices, "disabled", false);
          } else {
            self.$set(self.formDatas.devices, "options", []);
            self.$message({
              message: '此渠道下暂无设备型号!',
              type: 'warning'
            })
            self.$set(self.formDatas.devices, "disabled", true);
          }
        } else {
          // self.$message.warning(res.msg)
        }
      })(id);
    },
    submit(formName) {
      const _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          _this.params.createBy = _this.userInfo.userId;
          _this.params.createTime = new Date().getTime();
          // _this.params.terminalCode = _this.params.terminalType == 1 ? '柜员机' : '终端机';
          _this.params.terminalCode = _this.formDatas.terminalCode;
          _this.params.eventType = _this.formDatas.eventType;
          _this.params.terminalType = _this.formDatas.terminalType
          _this.params.deviceModel = _this.formDatas.deviceModel.label
          
          console.log('_this.params', _this.params);
          const data = { ..._this.params };
          (async data => {
            let res = await _this.$api.sendTerminalExecute({message: "发送成功！", data });
            if (res && res.code == 0) {
              _this.cancel('true');
            }
          })(data);
        }
      });
    },
    cancel(bool) {
      //取消弹框
      this.dialogFormVisible = false;
      this.$refs.baseForm.resetFields();
      this.$set(this.formDatas.subtoChannel, "disabled", true);
      this.$set(this.formDatas.devices, "disabled", true);
      this.$emit("hideDia", bool);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
