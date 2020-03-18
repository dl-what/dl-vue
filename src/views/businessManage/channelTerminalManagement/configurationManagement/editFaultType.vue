<template>
  <!-- 添加 - 配置管理 -->
  <el-dialog title="编辑故障类型" :visible.sync="show" :before-close="close" class="dialog-form-list">
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <el-form
          label-position="right"
          label-width="7em"
          ref="form"
          :model="formData"
          class="device-form"
          @change="changeForm"
        >
          <el-form-item label="物品类别" prop="goodsType" 
            :rules="{ required: true, message: '请选择物品类别', trigger: ['change','blur'] }">
            <el-select placeholder="请选择" v-model="formData.goodsType" disabled>
              <el-option
                v-for="(item,index) in selectOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物品名称" prop="goodsName"
            :rules="{ required: true, message: '请选择物品类别', trigger: ['change','blur'] }">
            <el-select placeholder="请选择" v-model="formData.goodsName" disabled>
              <el-option
                v-for="(item,index) in formData.goodsNames"
                :key="index"
                :label="item.goodsName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-for="(description, index) in formData.descriptions"
            :label="`${'故障类型'}${index+1}`"
            :key="description.key"
            :prop="'descriptions.' + index + '.faultType'"
            :rules="{
              required: true, message: '故障类型不能为空', trigger: ['change','blur']
            }"
          > 
            <el-row >
              <el-col :span="23">
                <el-input v-model="description.faultType"   maxlength="20" show-word-limit  style="width:400px"></el-input>
              </el-col>
            <el-col :span="1">
              <el-button :id="'editFaultType-delete' + index" @click.prevent="removeDomain(description)" v-if="formData.descriptions.length > 1"  class="delete vlt-delete-more">删除</el-button>
            </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-button size="meduim" @click="addDomain" class="add-item vlt-add-more" id="editFaultType-add">
          <i class="el-icon-plus"></i> 新增类型 
        </el-button>
        <el-row class="vlt-edit-btn">
          <el-button id="'editFaultType-submit'" type="primary" v-prevent="1000" size="medium" @click="onSubmit">提交</el-button>
          <el-button id="'editFaultType-cancel'" size="medium" @click="close">取 消</el-button>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "editFaultType",
  props: {
    showForm: {
      type: Boolean,
      default: false
    },
    goodsNames: {
      type: Array
    },
    rowInfo: {
      type: Object
    },
  },
  data() {
    return {
      show: this.showForm,
      params: {},
      formData: {
        goodsType: 1, //表示设备 次数定值
        goodsName: '',
        goodsNames: this.goodsNames,
        descriptions: [],
      },
      selectOptions: [{ label: "配件", value: 0 }, { label: "设备", value: 1 }],
      dataInfo: this.rowInfo
    };
  },
  watch: {
    showForm(value) {
      this.show = value;
      console.log(this.show);
      if (this.show) {
        this.fillBack(this.formData, this.rowInfo);
      }
    },
    rowInfo:  {
      handler(newVal, oldVal) {
        console.log('newval',newVal);
        // this.fillBack(this.formData, newVal);
      },
      deep: true
    },
  },
  components: {},
  methods: {
    fillBack (obj, fillData ) {
      // console.log('newVal', obj, fillData, this.goodsNames);
      this.formData = Object.assign(obj, fillData);
      this.goodsNames&&this.goodsNames.forEach((item, index) => {
        if (fillData.goodsName == item) {
          this.formData.goodsName = index
        }
      })
      obj.goodsNames = this.goodsNames;
      if (fillData.faultTypeVOList&&fillData.faultTypeVOList.length) {
        obj.descriptions = [];
        // console.log(obj.descriptions);
        let arrs = fillData.faultTypeVOList;
        for (let i = 0; i < arrs.length; i++) {
          obj.descriptions.push({
            faultType: arrs[i]
          }) 
        }
      }
    },
    changeForm() {
      console.log("change");
    },
    // 获取详情信息
    // getDetailInfo(row) {
    //   const _this =this;
    //   (async (data) => {
    //     let result = await _this.$api.queryFaultTypeInfo({data});
    //   })(data)
    //   // queryFaultTypeInfo
    // },
    addDomain() {
      this.formData.descriptions.push({
        faultType: '',
      });
    },
    removeDomain(item) {
      var index = this.formData.descriptions.indexOf(item)
      if (index !== -1) {
        this.formData.descriptions.splice(index, 1)
      }
    },
    onSubmit() {
      console.log("formData", this.params);
        const _this = this;
      const data = _this.formData.descriptions.map(item => {
        // console.log(item);
        item.goodsType = _this.formData.goodsType == '配件' ? 0 : 1,
        item.goodsName = this.formData.goodsName
        return item
      })
      _this.$refs.form.validate(valid => {
      if (valid) {
        console.log('data', data);
          (async data => {
            let result = await _this.$api.updateFaultTypeInfo({message: '修改成功', data});
            if (result && result.code == 0) {
              _this.close('true');
            }
          })(data)
        }
      })
    },
    close(bool) {
      // this.formData.descriptions.length = 0;
      this.$refs.form.resetFields();
      this.$emit("closeDia", bool);
    }
  }
};
</script>

<style lang="less">
.dialog-form-list {
  // .el-dialog__header {
  //   padding-top: 0;
  // }
  
  .el-dialog {
    width: 40%;
    min-width: 670px;
  }
  .add-item {
    width: 400px;
    margin: 0px 0 20px 90px;
    // padding: 9px 0;
    font-size: 13px;
    text-align: center;
    color: #333;
    cursor: pointer;
    border: 1px dashed #dddddd;
  }
  .delete {
    // right: -40px;
    position: absolute;
  }
}
</style>
