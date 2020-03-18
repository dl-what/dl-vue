<template>
  <!-- 添加 - 配置管理 -->
  <div class="vlt-card">
    <panel :show="true" title="新增故障类型">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap" style="width:600px">
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
              <el-select placeholder="请选择" v-model="formData.goodsType" disabled >
                <el-option
                  v-for="(item,index) in selectOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物品名称" prop="goodsName"
              :rules="{ required: true, message: '请选择物品名称', trigger: ['change','blur'] }">
              <el-select placeholder="请选择" v-model="formData.goodsName" >
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
                  <el-input v-model="description.faultType"  maxlength="20" show-word-limit style="width:400px"></el-input>
                </el-col>
              <el-col :span="1">
                <el-button :id="'addFaultType-delete'+ index" @click.prevent="removeDomain(description)" v-if="index!==0" class="delete">删除</el-button>
              </el-col>
              </el-row>
            </el-form-item>
          </el-form>
          <el-button size="meduim" @click="addDomain" class="add-item vlt-add-more" :id="'addFaultType-add'">
            <i class="el-icon-plus"></i> 新增类型
          </el-button>
          <el-row class="vlt-edit-btn">
            <el-button id="addFaultType-submit" type="primary" v-prevent="1000" size="medium" @click="onSubmit">提交</el-button>
            <el-button id="addFaultType-cancel" size="medium" @click="close">取 消</el-button>
          </el-row>
        </div>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
// import rules from "@/utils/rules.js";
export default {
  name: "addFaultType",
  data() {
    return {
      formData: {
        goodsType: 1, //表示设备 次数定值
        goodsName: '',
        goodsNames: [],
        descriptions: [{
          faultType: ''
        }],
      },
      selectOptions: [{ label: "配件", value: 0 }, { label: "设备", value: 1 }],
    };
  },
  
  components: {},
  created() {
    this.queryGoodsInfo(1);
  },
  methods: {
    changeForm(form) {
      console.log("change", form);
    },
    queryGoodsInfo(goodsType) {
      const _this = this;
      const data = {goodsType};
      (async data => {
        let res = await _this.$api.queryGoodsInfo({data});
        if (res && res.code == 0) {
          if (res.data != null && res.data.length){
            _this.formData.goodsNames = res.data;
            // console.log(_this.formData.goodsNames);
          } else {
            _this.formData.goodsNames = []
          }
        }
      })(data)
    },
    onSubmit() {
      console.log("submit", this.formData);
      const _this = this;
      let goodsName = null;
      _this.formData.goodsNames.forEach(item => {
        if (item.id ==  _this.formData.goodsName) {
          goodsName = item.goodsName
        }
      })
      const data = _this.formData.descriptions.map(item => {
        console.log(item);
        item.goodsType = _this.formData.goodsType,
        item.goodsName = goodsName
        return item
      })
      _this.$refs.form.validate(valid => {
        // console.log(valid);
        // console.log('data', data);
        if (valid) {
          (async data => {
            let result = await _this.$api.addFaultTypeInfo({message: '提交成功', data});
            if (result && result.code == 0) {
              _this.$refs.form.resetFields();
              _this.$router.push({
                name: 'faultType'
              })
            }
          })(data)
        }
      })
    },
    removeDomain(item) {
        var index = this.formData.descriptions.indexOf(item)
        if (index !== -1) {
          this.formData.descriptions.splice(index, 1)
        }
      },
    addDomain() {
      this.formData.descriptions.push({
        faultType: '',
      });
    },
    close() {
      this.$router.back();
      this.$refs.form.resetFields();
      console.log("close");
    }
  }
};
</script>

<style lang="less" scoped>
.vlt-card {
  padding: 16px;
  .add-item {
    width: 400px;
    margin: 0px 0 20px 88px;
    // padding: 9px 0;
    font-size: 13px;
    text-align: center;
    color: #333;
    cursor: pointer;
    border: 1px dashed #dddddd;
  }
  .delete{
    margin-left:40px;
  }
}
</style>
