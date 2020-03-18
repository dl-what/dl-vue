<template>
  <!-- 渠道增机 -->
  <div class="vlt-card">
    <el-tabs v-model="active">
      <el-tab-pane label="渠道增机" name="1">
        <div class="vlt-edit-wrap">
          <el-form :model="form" ref="form" label-width="100px" label-position="right" :rules="rules" :disabled="disabled">
            <div class="vlt-edit-single">
              <panel title="基本信息" :show="true" style="margin-bottom:15px">
                <el-form-item label="申请标题" style="margin-top:20px" prop="title">
                    <el-input v-model.trim="form.title" placeholder="请输入申请标题" maxlength="20" show-word-limit></el-input>
                  </el-form-item>
                <!-- <el-form-item label="渠道编号" prop="channelNo" style="margin-top:20px">
                  <el-select v-model="form.channelNo" filterable placeholder="请选择渠道编号" @change="getChannelNo">
                    <el-option v-for="(item,index) in channelData" :key="index" :label="item.channelNo" :value="item.channelNo" @click.native="getChannelData(item)"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="渠道编号" prop="channelNo" style="margin-top:20px">
                  <el-input @blur="selectChannelNo" v-model="form.channelNo" maxlength="10" show-word-limit placeholder="请输入渠道编号"></el-input>
                </el-form-item>
              </panel>
            </div>
            <panel title="增机信息" :show="true" style="margin-bottom:15px">
              <el-row style="margin-top:15px">
                  <!-- <span>{{item.title + (index+1)}}</span> -->
                  <el-form-item  v-for="(item,index) in resourceData" :key="index" :label="`${item.title}${index+1}`">
                    <el-select v-model="item.goodsType" @change="selectResourceType(index)" placeholder="请选择资源类型" class="device-item" disabled>
                      <el-option
                        v-for="(list, index) in item.optionsType"
                        :key="index"
                        :label="list.label"
                        :value="list.value"
                      ></el-option>
                    </el-select>
                  <!-- </el-form-item> -->
                  <!-- :prop="'warehouseGoodsData.'+ index + '.goodId'" :rules="rules.goodId" -->
                  <!-- <el-form-item > -->
                  <el-select v-model="item.goodId" placeholder="请选择资源名称" class="device-item" disabl-ed>
                    <el-option
                      v-for="(list,index) in item.optionsName"
                      :key="index"
                      @click.native="selectResourceName(item,index)"
                      :label="list.goodsName"
                      :value="list.id"
                    ></el-option>
                  </el-select>
                  <!-- </el-form-item> -->
                   <!-- :prop="'warehouseGoodsData.'+ index + '.modelId'" :rules="rules.modelId" -->
                  <!-- <el-form-item > -->
                  <el-select v-model="item.modelId" placeholder="请选择型号" class="device-item">
                    <el-option
                      v-for="(list, index) in item.optionsModel"
                      :key="index"
                      @click.native="selectResourceModel(item,index)"
                      :label="list.deviceModel"
                      :value="list.modelId"
                    ></el-option>
                  </el-select>
                  <!-- </el-form-item> -->
                  <!-- :prop="'warehouseGoodsData.'+ index + '.num'" :rules="rules.num" -->
                  <!-- <el-form-item  > -->
                  <el-tooltip v-if="isManual" class="item" effect="light" :content="limitTxt" placement="top" >
                    <el-input type="number" v-model.number="item.num"  maxlength="8" class="device-item" placeholder="请输入数量" ></el-input>
                  </el-tooltip>
                  <!-- </el-form-item> -->
                  <el-button v-if="index!==0"  class="delete" @click="deleteResource(index)" >删除</el-button>
                  </el-form-item>
              </el-row>
              <el-button
                class="addDevice vlt-add-more"
                @click="addResource"
                :disabled="type!='0'"
                icon="el-icon-plus"
              >新增设备</el-button>
              <el-form-item label="增机原因" prop="causeResAdd">
                <el-input
                  type="textarea"
                  v-model="form.causeResAdd"
                  style="width:400px"
                  maxlength="100"
                  :autosize="{ minRows: 3, maxRows: 5}"
                ></el-input>
              </el-form-item>
            </panel>
            <panel title="其他事项" :show="true" style="margin-bottom:15px">
              <upload-file v-model="form" v-if="isShow" uploadUrl="uploadChannelFiles"></upload-file>
            </panel>
            <div class="submit-wrap" v-if="type=='0'">
              <el-row class="vlt-edit-btn">
                <el-button id="channelAddMachine-submit" type="primary" size="medium" @click="submit" :disabled="isSubmit">提交</el-button>
                <el-button id="channelAddMachine-save" type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
                <el-button id="channelAddMachine-cancel" size="medium" @click="cancel">取消</el-button>
              </el-row>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="渠道增机流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import deviceInfo from "../components/channelDeviceInfo2";
import uploadFile from "../components/uploadFiles";
import rules from "@/utils/rules.js";
import ajax from "@/utils/ajax.js";
import { async } from "q";

const typeData = [
  { label: "设备", value: 1 },
  { label: "配件", value: 2 },
  { label: "耗材", value: 3 },
  { label: "设施", value: 4 }
];
export default {
  name: "channelAddMachine",
  data() {
    return {
      disabled: true,
      isValid: false,
      isManual: false,
      isSubmit: false,
      isShow: false,
      diagramImg: "",
      // limitTxt: '温馨提示：暂无自营厅/合作厅的终端额度数据',
      type: this.$route.query.type,
      active: "1",
      channelData: [],
      rules: {
        channelNo: [ { required: true, validator: this.$rules.checkChannelTenCode, title: "渠道编号", trigger: ["change", "blur"] } ],
        title: [{ required: true, validator: this.$rules.checkName, title: "申请标题", trigger: ['change','blur'] }],
        causeResAdd: [ { required: true, message: "请输入增机原因", trigger: ['change','blur'] } ],
        goodId: [{ required: true, validator: this.$rules.checkName, title: '资源名称', trigger: ['change','blur'] }],
        modelId: [{ required: true, message: '型号不能为空', trigger: ['change','blur'] }],
        num: [{ required: true, validator:this.$rules.checkPositive, title: "请输入正确数量", trigger: ['change','blur'] }]
      },
      form: {
        title: "",
        channelNo: "",
        causeResAdd: "",
        attachId: null,
        warehouseGoodsData: [{
          goodId: null,
          modelId: null,
          num: null,
        }]
      },
      resourceData: [
        {
          title: "资源类型",
          goodsType: 1,
          goodId: "",
          modelId: "",
          num: "",
          unitPrice: "",
          amount: "",
          optionsType: typeData,
          optionsName: [],
          optionsModel: []
        }
      ],
      yearLimit: 0,
      warehouseGoodsData: [],
      
      goodsType: 1,
      goodsData: [],
      flag: 0,
      actBusinessInsId: null,
      channelId: null,
    };
  },
  components: {
    deviceInfo,
    uploadFile
  },
  created() {
    let data = {};
    this.getChannelInfoModifyList(data);
    this.getModelTree();
    this.validProcess();
    if (this.$route.query.id) {
      let data = this.$route.query.id;
      this.getTaskData(data);
    } else {
      this.isShow = true;
    };
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == "1" ? true : false;
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get('userInfo').insId;
  },
  watch: {
    resourceData: {
      // 深度监听 监听对象，数组的变化
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          item.amount = item.unitPrice * item.num;
        });
        // let num = 0;
        // for (let i = 0; i < newValue.length; i++) {
        //   num = num + newValue[i].amount;
        // }
        // this.totalData[0].value = num + "元";

        // let params = JSON.parse(JSON.stringify(newValue));
      },

      deep: true
    },
    actBusinessInsId: {
      handler (newVal, oldVal) {
        this.validProcess()
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    limitTxt(val) {
      let sell = this.yearLimit;
      if (this.yearLimit == null) {
        // sell = 0;
        return `温馨提示：该渠道设备的本年度计划暂未安排`;
      } else if (this.yearLimit == 0) {
        this.isSubmit = false;
      } else {
        return `温馨提示：该渠道设备的本年度计划剩余额度为${sell}`;
      }
    }
  },
  methods: {
    // 渠道编号失去焦点 请求数据
    selectChannelNo () {
      this.actBusinessInsId =  this.$storage.get("userInfo").insId;
      if(this.form.channelNo&&this.form.channelNo.length==10&&/^[0-9]*$/.test(this.form.channelNo)) {
        let data = {
          insId: this.actBusinessInsId,
          channelNo: this.form.channelNo,
        }
        this.getChannelByQry(data)
      }else{
        this.$message.warning('渠道编号不正确')
      }
    },
    getChannelByQry (data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelByQry({ data });
        if (res && res.code == 0) {
          if (res.data) {
            self.isInit = false;
            self.channelId = res.data.channelId;
            console.log(res.data);
            self.channelList = {
              label: res.data.channelNo,
              value: res.data.channelNo,
              insId: res.data.insId,
              channelId: res.data.channelId
            }
            self.getChannelNo(self.channelList.value);
          }  else {
            self.$message.warning('请输入正确的渠道编号');
          }
        }
      })(data);
    },
    //获取渠道编号列表-下拉框
    getChannelInfoModifyList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelInfoModifyList({ data });
        if (res && res.code == 0) {
          this.channelData = res.data
          // console.log('渠道编号',res.data)
        }
      })(data);
    },
    getChannelNo(val) {
      console.log(val);
      const self = this;
      self.isManual = true;
      let data = val;
      (async data => {
        let res = await self.$api.getAnnualQuota({ data });
        if (res && res.code == 0) {
          self.yearLimit = res.data;
        }
      })(data);
    },
    getChannelData(val) {
      console.log(val)
      this.actBusinessInsId = val.insId;
      this.channelId = val.channelId;
    },
    // 选择资源名称
    selectResourceName(item, index) {
      console.log(item);
    },
    // 选择物品型号
    selectResourceModel(item, index) {
      item.num = null;
      let unitPrice = this.resourceData[this.flag].optionsModel[index]
        .unitPrice;
      this.$set(this.resourceData[this.flag], "unitPrice", unitPrice);
      // console.log(item.unitPrice)
    },
    // async getModelTree() {
    //   const self = this;
    //   let res = await self.$api.addGoodsInfoList();
    //   if (res && res.code == 0) {
    //     console.log("终端机",res)
    //     self.goodsData = res.data;
    //     self.nameData = [];
    //     res.data.forEach((item,index) =>{
    //       let obj = {};
    //       obj.label = item.goodsName;
    //       obj.value = item.goodId
    //       self.nameData.push(obj)
    //     })
    //     self.$set(self.resourceData[0],"optionsName",self.nameData)
    //   }
    // },
    async getModelTree() {
      const self = this;
      let res = await self.$api.getModelTree();
      if (res && res.code == 0) {
        self.goodsData = res.data.filter(item => {
          return item.goodsName == "终端机";
        });
        self.$set(self.resourceData[0], "optionsName", self.goodsData);
        self.$set(
          self.resourceData[0],
          "optionsModel",
          self.goodsData[0].modelInfoVoList
        );
      }
    },
    // changeDevice(val){
    //   this.resourceData = val
    // },
    submit() {
      const self = this;
      self.$refs.form.validate( valid => {
        console.log(valid);
        if (valid) {
          let data = JSON.parse(JSON.stringify(self.form));
          let newResourceData = JSON.parse(JSON.stringify(self.resourceData));
          data.warehouseGoodsInfoList = newResourceData;
          newResourceData.forEach(element => {
            delete element.optionsName;
            delete element.optionsType;
            delete element.optionsModel;
            delete element.title;
          });
          (async () => {
            let isWarehouseArr = [];
            let number = /^[0-9]*[1-9][0-9]*$/;
            await data.warehouseGoodsInfoList.forEach((item, index) => {
              if (!item.goodId || !item.modelId) {
                self.$message.warning(`请正确填写资源类型${index+1}的值`);
                isWarehouseArr.push(0);
              } else if (!item.num ) {
                self.$message.warning(`请正确填写资源类型${index+1}的数量`);
                isWarehouseArr.push(0);
              } else if (!number.test(item.num)) {
                self.$message.warning(`资源类型${index+1}的数量必须为正整数`);
                isWarehouseArr.push(0);
              }else {
                isWarehouseArr.push(1);
              }
            })
            let isWarehouse = isWarehouseArr.every(e => e > 0);
            console.log('isWarehouse', isWarehouseArr, isWarehouse);
             if (isWarehouse) {
                 let validData ={
                  ...self.form,
                  warehouseGoodsInfoList: self.resourceData
                }
                if (self.isValid) {
                  // 走流程的参数
                  console.log(validData)
                  let str = JSON.stringify(validData);
                  data.actBusiness = {
                    router: "channelAddMachine",
                    title: data.title,
                    id: self.$route.query.id, // 从我的申请-编辑 需要带上id
                    data: str,
                    actBusinessInsId: self.actBusinessInsId,
                    channelId: self.channelId
                  };
                  if (!self.$route.query.id) {
                    // 直接创建 不需要带上
                    delete data.actBusiness.id;
                  }
                } else {
                  // 不需要走流程 不用申请标题
                  delete data.title;
                }
                (async () => {
                  let res = await self.$api.addMachine({ message: "新增成功", data });
                  if (res && res.code == 0) {
                    // if(self.isValid) {
                    //   self.$router.push({name: 'myApplication'})
                    // }else{
                      this.$router.back();
                    // }
                  }
                })()
              }

          })()
        } else {
          self.$message.warning('校验不通过');
        }
      });
    },
    // 新增资源
    addResource() {
      this.flag++;
      let obj = {
        title: "资源类型",
        goodsType: 1,
        modelId: null,
        goodId: null,
        num: null,
        unitPrice: null,
        optionsType: typeData,
        optionsName: [],
        optionsModel: []
      };
      this.$set(obj, "optionsName", this.goodsData);
      this.$set(obj, "optionsModel", this.goodsData[0].modelInfoVoList);
      this.$set(this.resourceData, this.resourceData.length, obj);
    },
    // 删除资源
    deleteResource(index) {
      this.resourceData.splice(index, 1);
    },
    // 暂存
    async save() {
      const self = this;
      let data = JSON.parse(JSON.stringify(self.form));
      if (!self.form.title) {
        this.$message.warning("申请标题不能为空");
        return;
      }
      // data.attachId = JSON.stringify(self.attachId);
      let newResourceData = JSON.parse(JSON.stringify(self.resourceData));
      data.warehouseGoodsInfoList = newResourceData;
      let params = {
        router: "channelAddMachine",
        title: data.title,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data),
        actBusinessInsId: self.actBusinessInsId,
        channelId: self.channelId
      };
      if (!self.$route.query.id) {
        // 新建 不需要带上
        delete params.id;
      }
      console.log("暂存的参数", params);
      self.saveDraft(params);
    },
    // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("保存成功");
          self.$router.push({ name: "myApplication" });
        } else {
        }
      })(data);
    },
    // 回填表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          self.init(data);
        }
      })(data);
    },
    init(data) {
      console.log(data);
      this.resourceData = data.warehouseGoodsInfoList;
      this.form.title = data.title;
      this.form.attachId = data.attachId;
      this.form.causeResAdd = data.causeResAdd;
      this.form.channelNo = data.channelNo;
      if (this.form.channelNo) {
        this.getChannelNo(this.form.channelNo);
      };
      this.isShow = true;
    },
    cancel() {
      this.$router.back();
    },
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = { 
        router,
        actBusinessInsId: self.actBusinessInsId
      };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          console.log('lc',res.data.valid);
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${self.actBusinessInsId}`;
        }
      })(data);
    },
    handleRemove() {}
  }
};
</script>

<style lang="less" scoped>
.panel-bd {
  padding-top: 20px;
}
.addDevice {
  width: 100%;
  max-width: 400px;
  margin: 0 0 30px 98px;
  border-style: dashed;
}
.device-item {
  margin-right: 15px;
  width: 160px !important;
}
.device-form {
  padding: 16px 8px;
}
// .delete {
//   padding-right: 30px;
// }
.submit-wrap {
  text-align: right;
  padding: 10px 0;
}
</style>
