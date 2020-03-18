<template>
  <div>
    <el-form
      label-position="right"
      label-width="90px"
      ref="form"
      :model="formDevice"
      :rules="rules"
      :disabled="type!='0'"
      class="device-form">
      <el-form-item
        v-for="(item, index) in resourceData"
        :key="index"
        :label="`${item.title}${index+1}`">
        <el-select
          v-model="item.goodsType"
          placeholder="请选择资源类型"
          class="device-item device-goodsType">
          <el-option
            v-for="(list, index) in item.optionsType"
            :key="index"
            @click.native="selectResourceType(item, index)"
            :label="list.label"
            :value="list.value"
          ></el-option>
        </el-select>
        <el-select v-model="item.id" placeholder="请选择资源名称" class="device-item">
          <el-option
            v-for="(list,index) in item.optionsName"
            :key="index"
            @click.native="selectResourceName(item, index)"
            :label="list.label"
            :value="list.value"
          ></el-option>
        </el-select>
        <el-select v-model="item.modelId" v-if="item.goodsType==1||item.goodsType==2" placeholder="请选择型号" class="device-item">
          <el-option
            v-for="(list, index) in item.optionsModel"
            :key="index"
            @click.native="selectResourceModel(item, index)"
            :label="list.deviceModel"
            :value="list.modelId"
          ></el-option>
        </el-select>
        <el-input v-model="item.unitPrice" class="device-item" disabled placeholder="物品单价">
          <template slot="append">元</template>
        </el-input>
        
        <el-input 
          oninput="this.value=this.value.replace(/[^\d]/g,'')"
          onafterpaste="this.value=this.value.replace(/[^\d]/g,'') "
          v-model.number="item.num" 
          class="device-item number" placeholder="请输入数量" maxlength="8">
        </el-input>
        <el-button size="medium" class="delete" @click="deleteResource(index)">删除</el-button>
        <!-- <el-tooltip v-model="item.isShow" manual class="item" effect="light" placement="right">
          <div slot="content">{{limitTxt.slice(0,9)}}<br/>{{limitTxt.slice(9, 100)}}</div>
          <el-button  class="delete" @click="deleteResource(index)">删除</el-button>
        </el-tooltip> -->
      </el-form-item>
      <el-form-item>
        <el-button class="addDevice vlt-add-more" @click="addResource" :disabled="type!='0'" icon="el-icon-plus">添加设备</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
const typeData = [
  { label: "设备", value: 1 },
  { label: "配件", value: 2 },
  { label: "耗材", value: 3 },
  { label: "设施", value: 4 }
];

export default {
  name: "",
  props: {
    limitTxt: {
      type: String,
      default: ''
    },
    warehouseGoodsData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isManual: true,
      formDevice: {},
      rules: {
        coPrepareMoney: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        insId: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
      },
      resourceData: [  // 发放资源数据
      ],
      resourceIndex: "",
      resourceDatas: [],
      type: this.$route.query.type,
      goodsType: '', // 选中的资源类型
      allResourceData: [], // 所有的数据
    }
  },
  watch: {
    resourceData: {
      handler(newValue, oldValue) {
        let res = JSON.parse(JSON.stringify(newValue));
        let params = [];
        res.forEach(item => {
          // 保留你需要的参数
          let param = (({ goodsType, modelId, id, unitPrice, num }) => ({
            goodsType,
            modelId,
            id,
            unitPrice,
            num
          }))(item);
          // param.num = Number(param.num);
          params.push(param);
        });
        // this.form = params;
        this.$emit('change', res)
        console.log("params", res);
      },
      // 深度监听 监听对象，数组的变化
      deep: true
    },
    warehouseGoodsData: {
      handler(newValue, oldValue) {
        if(newValue.length>0) {
          // 获取全部数据
          this.getAllModelTree();
        }
      },
      deep: true,
    }
  },
  created() {
    
  },
  methods: {
    init() {
      this.resourceData = this.warehouseGoodsData;
    },
    getAllModelTree(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getModelTree({ data });
        if (res && res.code == 0) {
          console.log('全部', res.data)
          self.allResourceData = res.data;
          self.init()
        }
      })(data)
    },
    changeSelect() {

    },
    // 删除资源
    deleteResource(index) {
      this.resourceData.splice(index, 1);
    },
    // 选择资源类型
    selectResourceType(item, index) {
      // 重置后面下拉框的数据 清空
      item.optionsName = [];
      item.id = null;
      item.modelId = null;
      item.num = null;
      item.unitPrice = null;

      this.goodsType = index + 1;
      let data = {
        goodsType: this.goodsType
      };
      this.getModelTree(data, item);
    },
    // 根据资源类型获取资源名称
    getModelTree(data, item) {
      const self = this;
      (async data => {
        let res = await self.$api.getModelTree({ data });
        if (res && res.code == 0) {
          this.resourceDatas = res.data;
          res.data.forEach((ele, index) => {
            let obj = {};
            obj.label = ele.goodsName;
            obj.value = ele.id;
            obj.deviceType = ele.deviceType;
            obj.optionsModel = ele.modelInfoVoList;
            obj.unitPrice = ele.unitPrice;
            item.optionsName.push(obj);
          });
        }
      })(data);
    },
    // 选择资源名称
    selectResourceName(item, index) {
      item.num = null;
      item.unitPrice = null;
      item.modelId = null;
      if(item.goodsType==3||item.goodsType==4) {
        item.optionsModel = null;
        item.unitPrice = (item.optionsName[index].unitPrice/100).toFixed(2);
      }else{
        item.optionsModel = item.optionsName[index].optionsModel;
        item.deviceType = item.optionsName[index].deviceType
        if(item.deviceType==1) {
          item.isShow = true;
        }else{
          item.isShow = false;
        }
      }
      
    },
    // 选择资源型号
    selectResourceModel(item, index) {
      item.unitPrice = (item.optionsModel[index].unitPrice/100).toFixed(2)
    },
    // 新增资源
    addResource() {
      let obj = {
        title: "资源类型",
        goodsType: null,
        modelId: null,
        id: null,
        num: null,
        unitPrice: null,
        isShow: false,
        optionsType: typeData,
        optionsName: [],
        optionsModel: []
      };
      this.$set(this.resourceData, this.resourceData.length, obj);
    },
    // 校验
    validate(callback) {
      // this.$emit('change', this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('校验通过')
          // this.$emit('asset')
          callback('true')
        }else{
          console.log('校验不通过')
          callback('false');
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.addDevice {
  width: 100%;
  max-width: 350px;
  margin: 0 0 30px 0;
  // border-style: dashed;
}
.device-form {
  padding: 12px 8px;
}
.device-item {
  margin-right: 15px;
  width: 150px;
}
.number {
  width: 120px;
}
.device-goodsType{
  width: 100px;
}
</style>
