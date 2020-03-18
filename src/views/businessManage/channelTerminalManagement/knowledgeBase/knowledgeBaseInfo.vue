<template>
  <!-- 查看维护知识库-->
  <div class="vlt-card">
      <panel :show="true"  title="维护知识库基本信息">
        <base-info :infoList="infoList"></base-info>
      </panel>
      <!-- <h2 class="title">基本信息</h2>
      <div class="vlt-edit-wrap">
        <base-form
          :formData="formDatas"
          labelWidth="140px"
          ref="baseForm"
          :rules="rule"
          direction="right"
          @change="changeForm"
          
        ></base-form>
        <el-row class="vlt-edit-btn">
          <el-button type="primary" v-prevent="1000" size="medium" @click="onSubmit">提交</el-button>
          <el-button type="primary" v-prevent="1000" size="medium" @click="onSubmit">保存</el-button>
          <el-button size="medium" @click="close">取 消</el-button>
        </el-row> -->
      <!-- </div> -->
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "ExportCard",
  data() {
    return {
      show: this.showForm,
      params: {},
      formDatas: [
        {type: 'input', prop:'itemCategory', title: '物品类别：',value: '', disabled: true},
        {type: 'input', prop:'itemName', title: '物品名称：',value: '', disabled: true},
        {type: 'input', prop:'faultType', title: '故障类型：',value: '', disabled: true},
        {type: 'input', prop:'faultDesc', title: '故障描述：',value: '', disabled: true},
        {type: 'input', prop:'processingTime', title: '处理时间：',value: '', disabled: true},
        {type: 'textarea', prop:'processingDesc', title: '处理描述：',value: '', disabled: true},
      ],
      rule: {
        // address: [{required: true,trigger: ['change','blur'] }],
        status: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ]
      },
      infoList:[
        { title: "物品类别", value: "", prop: "goodsType" },
        { title: "物品名称", value: "", prop: "goodsName" },
        { title: "故障类型", value: "", prop: "faultType" },
        { title: "故障描述", value: "", prop: "faultDesc" },
        { title: "处理时间", value: "", prop: "handleDate" },
        { title: "处理描述", value: "", prop: "handleDesc" }
      ],
      mockDate: {
        id: 0,
        itemCategory: '设备',
        itemName: '投注机',
        faultType: '投注机进水',
        faultDesc: '投注机进水',
        processingTime: '2018-08-09',
        processingDesc: '运行中',
      },
      goodsTypeArr: ['设备', '配件', '耗材', '设施']
    };
  },
  created() {
    const id = this.$route.query.id;
    this.getInfo (id);
  },
  components: {},
  methods: {
    getInfo (id) {
      const _this = this;
      (async (id) => {
        const data = { id }
        let res = await _this.$api.knowledgeBaseInfo({data})
        if (res && res.code === 0) {
          if (res.data) {
            _this.infoList.forEach(item => {
              item.value = res.data[item.prop]
              if (item.prop == 'goodsType') {
                item.value = _this.goodsTypeArr[res.data[item.prop] - 1]
              }
              if (item.prop == 'handleDate') {
                item.value =  _this.$moment(item.value).format("YYYY-MM-DD HH:mm:ss")
              }
            })
          }
        }
      })(id)
    },
    
    // close() {
    //   this.$router.back();
    // },
    // onSubmit() {
    //   console.log("formData", this.params);
    //   this.close();
    // }
  }
};
</script>

<style lang="less" scoped>
</style>
