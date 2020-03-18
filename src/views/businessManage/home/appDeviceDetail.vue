<template>
  <div class="vlt-card">
    <!-- APP设备维修申请-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="设备维护申请" name="1">
        <el-form label-position="right" 
          label-width="120px" 
          :model="form"
          :rules="rules"
          :disabled="disabled"
          ref="form"
          class="baseInfo">
          <panel title="渠道信息" :show="true" style="margin-bottom:15px">
            <div class="vlt-edit-wrap">
              <div class="vlt-edit-single">
                <el-form-item label="渠道编码" prop="channel.cd">
                  <el-input v-model="form.channel.cd" placeholder="请输入渠道编码" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <!-- <el-form-item label="渠道名称" prop="gameName">
                  <el-input v-model="form.gameName" placeholder="请输入渠道名称" maxlength="15" show-word-limit></el-input> 
                </el-form-item> -->
                <el-form-item label="地址" prop="channel.address">
                  <el-input 
                    v-model="form.channel.address" 
                    type="textarea" 
                    :autosize="{ minRows: 3, maxRows: 4}" 
                    placeholder="请输入地址" 
                    maxlength="100"></el-input> 
                </el-form-item>
              </div>
            </div>
          </panel>
          <panel title="申请人信息" :show="true" style="margin-bottom:15px">
            <div class="vlt-edit-wrap">
              <div class="vlt-edit-single">
                <el-form-item label="申请人" prop="fault.name">
                  <el-input v-model="form.fault.name" placeholder="请输入申请人姓名" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="申请时间" prop="fault.createDate">
                  <el-date-picker 
                    type="datetime"
                    v-model="form.fault.createDate"
                    placeholder="请选择申请时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="设备类型" prop="fault.deviceTypeName">
                  <el-input v-model="form.fault.deviceTypeName" placeholder="请输入设备类型" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="设备型号" prop="fault.deviceModelName">
                  <el-input v-model="form.fault.deviceModelName" placeholder="请输入设备型号" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="故障类型" prop="fault.faultTypeName">
                  <el-input v-model="form.fault.faultTypeName" placeholder="请输入故障类型" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="故障级别" prop="fault.faultLevelName">
                  <el-input v-model="form.fault.faultLevelName" placeholder="请输入故障级别" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <el-form-item label="故障描述" prop="fault.faultDesc">
                  <el-input v-model="form.fault.faultDesc" placeholder="请输入故障描述" maxlength="50" show-word-limit></el-input> 
                </el-form-item>
                <!-- <el-form-item label="申请数量" prop="fault.amount">
                  <el-input v-model="form.fault.amount" placeholder="请输入申请数量"  maxlength="15">
                    <template slot="append">{{form.fault.unit}}</template>
                  </el-input> 
                </el-form-item>
                <el-form-item label="备注说明" prop="fault.remark">
                  <el-input 
                    v-model="form.fault.remark" 
                    type="textarea" 
                    :autosize="{ minRows: 3, maxRows: 5}" 
                    placeholder="请输入备注说明" 
                    maxlength="100">
                  </el-input> 
                </el-form-item> -->
              </div>
            </div>
          </panel>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="设备维护申请流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import ajax from "@/utils/ajax.js";

export default {
  name: "",
  data() {
    return {
      activeName: '1',
      form: {
        channel: {
          cd: null,
          address: null,
        },
        fault: {
          name: null,
          createDate: null,
          deviceTypeName: null,
          deviceModelName: null,
          faultTypeName: null,
          faultLevelName: null,
          faultDesc: null,
        }
      },
      rules: {
        "channel.cd": [
          {required: true, message: "请输入渠道编码",trigger: ["change", "blur"]}
        ],
        "channel.address": [
          {required: true, message: "请输入地址",trigger: ["change", "blur"]}
        ],
        "card.name": [
          {required: true, message: "请输入申请人名称",trigger: ["change", "blur"]}
        ],
        "card.createDate": [
          {required: true,message: "请选择申请时间",trigger: ["change", "blur"]}
        ],
        "card.cardTypeName": [
          {required: true,message: "请选择投注卡类型",trigger: ["change", "blur"]}
        ],
        "card.amount": [
          {required: true,message: "请输入申请数量",trigger: ["change", "blur"]}
        ],
      },
      disabled: false,
      diagramImg: '',
      isValid: false,
      actBusinessInsId: this.$storage.get("userInfo").insId
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == "1" ? true : false;
    // 是否审批流程校验
    this.validProcess();
    if(this.$route.query.id) { // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    }
  },
  methods: {
    // 表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          // self.init(data)
          console.log('回填数据', data)
          self.form = Object.assign(self.form, data)
        }
      })(data);
    },
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = {
        router,
        actBusinessInsId: this.actBusinessInsId
      };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.actBusinessInsId}`;
        }
      })(data);
    },
  },
}
</script>

<style lang="less" scoped>
.vlt-edit-wrap{
  padding-top: 30px;
}
</style>
