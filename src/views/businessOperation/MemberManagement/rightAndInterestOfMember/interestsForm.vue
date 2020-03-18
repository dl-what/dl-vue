<template>
  <div>
    <el-form
      ref="form"
      :model="form.intersDataForm"
      :rules="rules"
      label-width="10em"
    >
      <el-form-item label="权益名称" prop="rightsName" class="wd">
        <el-input
          v-model.trim="form.intersDataForm.rightsName"
          placeholder="请输入权益名称"
          maxlength="20"
          show-word-limit
          :disabled="form.typeId === 0 ? false :true"
        ></el-input>
      </el-form-item>
      <el-form-item label="权益简介" prop="briefIntr" class="wd">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" maxlength="150" placeholder="请输入权益简介" v-model.trim="form.intersDataForm.briefIntr"></el-input>
      </el-form-item>
      <el-form-item label="权益图标" :required="true">
        <picture-upload
          ref="upload"
          apiName="imgFileUpload"
          @onSuccess="onSuccess"
          :multiple="true"
          :limit="1"
          :size="2"
          :fileList="fileList"
          :formData="{
            fileKey: 'file'
          }"
        ></picture-upload>
      </el-form-item>
      <el-form-item label="权益赠送" v-if="false" class="wd">
        <el-col :span="24">
          <el-input
            v-model.trim="form.intersDataForm.giveGrowth"
            maxlength="5"
            placeholder="请输入权益赠送"
            oninput="value=value.replace(/[^\d]/g,'')"
          ><template slot="append">成长值</template></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="权益赠送" v-if="form.typeId === 2 " class="wd">
        <el-col :span="24">
          <el-input
            v-model.trim="form.intersDataForm.giveIntegral"
            maxlength="5"
            oninput="value=value.replace(/[^\d]/g,'')"
            placeholder="请输入权益赠送"
            type="text"
          ><template slot="append">积分</template></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="试玩游戏金额" v-if="form.typeId === 1">
        <div style="width: 540px;">
        <el-table :data="form.trialGameValuesList" border style="width: 100%">
          <el-table-column prop="memberLevelStr" label="会员级别" width="180"></el-table-column>
          <el-table-column prop="levelName" label="会员等级名称" width="180"></el-table-column>
          <el-table-column prop="trialValue" label="试玩游戏金额（元）" width="180">
            <template slot-scope="scope">
              <el-input
                v-model.trim="scope.row.trialValue"
                maxlength="5"
                oninput="value=value.replace(/[^\d]/g,'')"
                type="text"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        </div>
      </el-form-item>
      <el-form-item label="试玩门槛" v-if="form.typeId === 1">
        <el-radio-group v-model="form.trialThresholds">
          <el-row class="row-bg">
            <el-radio :label="0">不限门槛</el-radio>
          </el-row>
          <el-row type="flex" align="middle">
            <el-radio :label="1" style="margin-right;0">
              试玩积分
              <span style="display:inline-block;width:180px;">
                <el-input
                  :disabled="form.trialThresholds == 0 ? true: false"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  style="width:180px;"
                  type="text"
                  placeholder="请输入100以上正整数"
                  v-model.trim="form.intersDataForm.trialIntegral"
                  maxlength="5"
                ></el-input>
              </span>
              <span class="radio-text">进入游戏厅所需扣除的客户积分</span>
            </el-radio>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务方式" class="wd">
        <el-select placeholder="请选择服务方式" :disabled="true" v-model="form.intersDataForm.serviceMode" style="width:100%;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  model: {
    prop: "form",
    event: "returnEvent"
  },
  props: {
    form: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      rules: {
        rightsName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "权益名称",
            trigger: ["change", "blur"]
          }
        ]
      },
      fileList: [],
      options: [{ label: "系统", value: 0 }, { label: "线下", value: 1 }]
    };
  },
  components: {},
  methods: {
    onSuccess(val) {
      console.log(val);
      this.form.intersDataForm.icon = val.filePath;
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-uploader {
  display: flex;
  align-items: center;
}
.row-bg {
  margin: 10px 0;
}

.radio-text {
  padding-left: 10px;
}
.wd{
  /deep/.el-form-item__content{
    width: 400px;
  }
}
</style>
