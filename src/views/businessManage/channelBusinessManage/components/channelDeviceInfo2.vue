<template>
  <div class="vlt-edit-single channel-device">
    <div class="vlt-edit-wrap">
      <el-form
        label-position="right"
        label-width="90px"
        ref="form"
        :model="formDevice"
        :rules="rules"
        :disabled="type!='0'"
        class="device-form">
        <el-form-item
          v-for="(item,index) in resourceData"
          :key="index"
          :label="`${item.title}${index+1}`">
          <el-select
            v-model="item.goodsType"
            @change="selectResourceType(index)"
            placeholder="请选择资源类型"
            class="device-item"
          >
            <el-option
              v-for="(list, index) in item.optionsType"
              :key="index"
              :label="list.label"
              :value="list.value"
            ></el-option>
          </el-select>
          <el-select v-model="item.id" placeholder="请选择资源名称" class="device-item">
            <el-option
              v-for="(list,index) in item.optionsName"
              :key="index"
              @click.native="selectResourceName(index)"
              :label="list.label"
              :value="list.value"
            ></el-option>
          </el-select>
          <el-select v-model="item.modelId" v-if="item.goodsType==1||item.goodsType==2" placeholder="请选择型号" class="device-item">
            <el-option
              v-for="(list, index) in item.optionsModel"
              :key="index"
              @click.native="selectResourceModel(index)"
              :label="list.deviceModel"
              :value="list.modelId"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="item.unitPrice" class="device-item" disabled placeholder="物品单价">
            <template slot="append">元</template>
          </el-input> -->
          <!-- <el-select >

          </el-select> -->
          <el-tooltip class="item" effect="dark" :content="limitTxt" placement="top">
            <el-input v-model.number="item.num" class="device-item" placeholder="请输入数量"></el-input>
          </el-tooltip>
          <el-button v-if="index!==0"  class="delete" @click="deleteResource(index)">删除</el-button>
        </el-form-item>
      </el-form>
      <el-button class="addDevice vlt-add-more" @click="addResource" :disabled="type!='0'" icon="el-icon-plus">添加设备</el-button>
      
    </div>
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
        {
          title: "资源类型",
          goodsType: 1,
          modelId: "",
          id: "",
          num: "",
          unitPrice: "",
          optionsType: typeData,
          optionsName: [],
          optionsModel: []
        }
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
        this.$emit('change', params)
        console.log("params", params);
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
      this.resourceData = []
      this.warehouseGoodsData.forEach((item, index)=>{
        let obj = {
          title: "资源类型",
          goodsType: "",
          modelId: "",
          id: "",
          num: "",
          unitPrice: "",
          optionsType: typeData,
          optionsName: [],
          optionsModel: []
        }
        obj = Object.assign(obj, item)
        this.allResourceData.forEach((list)=>{
          let listObj = {};
          listObj.label = list.goodsName;
          listObj.value = list.id;
          obj.optionsName.push(listObj);
          if(list.id == item.id) {
            obj.optionsModel = list.modelInfoVoList
          }
        })
        this.resourceData.push(obj);
      })
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
    // 选择资源类型
    selectResourceType(index) {
      console.log("选择的资源index", index);
      this.resourceIndex = index;
      console.log("下拉的index", this.resourceData[index].goodsType);
      this.goodsType = this.resourceData[index].goodsType;
      let data = {
        goodsType: this.goodsType
      };
      this.getModelTree(data);
    },
    // 选择资源名称
    selectResourceName(index) {
      // console.log(index,this.resourceDatas[index])
      let isModel = false;
      if(this.goodsType==1||this.goodsType==2) {
        isModel = true;
      };
      
      if(isModel&&this.resourceDatas[index].modelInfoVoList.length<1) {
        this.$confirm('该资源没有对应的型号，请先给此资源创建型号', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
        }).catch(() => {
          
        });
        
        // this.$set(this.resourceData[this.resourceIndex], 'unitPrice', this.resourceDatas[index].unitPrice);
        // this.$set(this.resourceData[this.resourceIndex], 'optionsModel', this.resourceDatas[index].modelInfoVoList)
      }
        // 重置后面下拉框的数据 清空
        this.$set(this.resourceData[this.resourceIndex], 'modelId', '');
        this.$set(this.resourceData[this.resourceIndex], 'num', '');
        if(this.goodsType==3||this.goodsType==4) {
          this.$set(this.resourceData[this.resourceIndex], 'unitPrice', this.resourceDatas[index].unitPrice);
        }else{
          this.$set(this.resourceData[this.resourceIndex], 'unitPrice', '');
        }
        this.$set(this.resourceData[this.resourceIndex], 'optionsModel', this.resourceDatas[index].modelInfoVoList)
      
    },
    // 根据资源类型获取资源名称
    getModelTree(data) {
      const self = this;
      // 重置后面下拉框的数据 清空
      self.nameData = [];
      self.$set(self.resourceData[this.resourceIndex], "optionsName", []);
      self.$set(self.resourceData[this.resourceIndex], "id", "");
      self.$set(self.resourceData[this.resourceIndex], "modelId", "");
      self.$set(self.resourceData[this.resourceIndex], "num", "");
      self.$set(self.resourceData[this.resourceIndex], "unitPrice", "");
      (async data => {
        let res = await self.$api.getModelTree({ data });
        if (res && res.code == 0) {
          // console.log('res', res.data)
          this.resourceDatas = res.data;
          res.data.forEach((item, index) => {
            let obj = {};
            obj.label = item.goodsName;
            obj.value = item.id;
            this.nameData.push(obj);
          });
          this.$set(
            this.resourceData[this.resourceIndex],
            "optionsName",
            this.nameData
          );
          // console.log('namedata', this.nameData)
          // this.nameData = res.data;
          // self.$set(self.formData[1], 'options', res.data)
          // self.formData[1].options = res.data;
          // self.cascaderOptions = res.data;
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    // 选择资源型号
    selectResourceModel(index) {
      // 重置后面输入框的数据 清空
      this.$set(this.resourceData[this.resourceIndex], 'num', '');
      let unitPrice = this.resourceData[this.resourceIndex].optionsModel[index].unitPrice;
      this.$set(this.resourceData[this.resourceIndex], 'unitPrice', unitPrice);
      // console.log('设备型号', val)
    },
    // 删除资源
    deleteResource(index) {
      this.resourceData.splice(index, 1);
    },
    // 新增资源
    addResource() {
      let obj = {
        title: "资源类型",
        goodsType: "",
        modelId: "",
        id: "",
        num: "",
        unitPrice: "",
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
  max-width: 490px;
  margin: 0 0 30px 98px;
  border-style: dashed;
}
// .addDevice {
//   max-width: 468px;
// }
.device-form {
  padding: 12px 8px;
}
.device-item {
  margin-right: 15px;
  width: 160px !important;
}
.delete {
  padding-right: 30px;
}
</style>
