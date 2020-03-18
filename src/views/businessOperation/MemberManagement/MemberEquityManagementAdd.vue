<template>
  <div class="vlt-card" style="padding-top:10px;">
    <el-form
      ref="form"
      :model="form.intersDataForm"
      label-width="110px"
      size="mini"
      :disabled="form.disabledStatus"
    >
      <el-form-item label="权益名称" prop="rightsName">
        <el-input
          maxlength="20"
          show-word-limit
          v-model.trim="form.intersDataForm.rightsName"
          :disabled="form.typeId === 0 ? false :true"
        ></el-input>
      </el-form-item>
      <el-form-item label="权益简介" prop="briefIntr">
        <el-input type="textarea" maxlength="200" v-model.trim="form.intersDataForm.briefIntr"></el-input>
      </el-form-item>
      <el-form-item label="权益图标">
        <picture-upload
          ref="upload"
          apiName="imgFileUpload"
          @onSuccess="onSuccess"
          :multiple="true"
          :limit="1"
          :size="2"
          :fileList="imgList"
          :formData="{
            fileKey: 'file'
          }"
        ></picture-upload>
      </el-form-item>
      <el-form-item label="权益赠送" v-if="false">
        <el-col :span="22">
          <el-input
            v-model.trim="form.intersDataForm.giveGrowth"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="5"
          ></el-input>
        </el-col>
        <span>成长值</span>
      </el-form-item>
      <el-form-item label="权益赠送" v-if="form.typeId === 2 ">
        <el-col :span="22">
          <el-input
            style="width:300px"
            v-model.trim="form.intersDataForm.giveIntegral"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="5"
          >
            <template slot="append">积分</template>
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="试玩游戏金额" v-if="form.typeId === 1">
        <el-table :data="form.trialGameValuesList" border style="width: 100%">
          <el-table-column prop="memberLevelStr" label="会员级别" width="180"></el-table-column>
          <el-table-column prop="levelName" label="会员等级名称" width="180"></el-table-column>
          <el-table-column prop="trialValue" label="试玩游戏金额(元)">
            <template slot-scope="scope">
              <el-input
                v-model.trim="scope.row.trialValue"
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="5"
                show-word-limit
                type="text"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="试玩门槛" v-if="form.typeId === 1">
        <el-radio-group v-model="form.trialThresholds">
          <el-row class="row-bg">
            <el-radio :label="0">不限门槛</el-radio>
          </el-row>
          <el-row type="flex" align="middle">
            <el-radio :label="1" style="margin-right;0">
              试玩积分
              <span style="display:inline-block;min-width:180px;">
                <el-input
                  style="width:215px;"
                  :disabled="form.trialThresholds == 0 ? true: false"
                  maxlength="5"
                  oninput="value=value.replace(/[^\d]/g,'')"
                  size="mini"
                  show-word-limit
                  placeholder="请输入100以上正整数"
                  type="text"
                  v-model.trim="form.intersDataForm.trialIntegral"
                ></el-input>
              </span>
              <span class="radio-text">进入游戏厅所需扣除的客户积分</span>
            </el-radio>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="服务方式">
        <el-select
          style="width:300px"
          placeholder="请选择"
          :disabled="true"
          v-model="form.intersDataForm.serviceMode"
        >
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
      options: [{ label: "系统", value: 0 }, { label: "线下", value: 1 }],
      imgList: []
    };
  },

  methods: {
    onSuccess(val) {
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
</style>
