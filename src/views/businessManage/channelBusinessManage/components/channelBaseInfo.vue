<template>
  <div>
    <el-form label-position="right" 
      label-width="11em" 
      :model="form"
      :rules="rules"
      ref="form"
      :disabled="type!='0'"
      class="baseInfo">
      <!-- <base-form :formData="baseData" ref="baseForm" :rules="rules" direction="right" @change="changeForm"></base-form> -->
      <el-form-item label="申请标题" prop="title" v-if="isValid">
        <el-input v-model="form.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="所属机构" prop="insId">
        <el-cascader
          v-model="form.insId"
          :options="insData"
          :props="setProps"
          placeholder="请选择所属机构"
          clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="渠道编号" prop="channelNo">
        <el-input v-model="form.channelNo" placeholder="请输入四位渠道编号" maxlength="4" show-word-limit>
          <template slot="prepend">{{form.insCode}}</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="渠道类型" prop="channelType">
        <el-tooltip v-model="isManual" class="item" manual effect="light" :content="limitTxt" placement="right">
          <el-select v-model.number="form.channelType" placeholder="请选择渠道类型">
            <el-option v-for="(items,index) in channelTypeData" :key="index" :label="items.label"
              @click.native="changeSelect(items)"
              :value="items.value">
            </el-option>
          </el-select>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-if="form.channelType == 1" label="合作伙伴" prop="partnerId">
        <el-select v-model.number="form.partnerId" placeholder="请选择合作伙伴">
          <el-option v-for="(item,index) in partnerData" :key="index" :label="item.corporateName"
            @click.native="selectPartner(item)"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道等级" prop="channelLevelId">
        <el-select v-model.number="form.channelLevelId" placeholder="请选择渠道等级">
          <el-option v-for="(items,index) in gradeData" :key="index" :label="items.chLevelName"
            @click.native="changeSelect(items)"
            :value="items.chGradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="经营场所属性" prop="runField">
        <el-select v-model.number="form.runField" placeholder="请选择经营场所属性">
          <el-option v-for="(items,index) in addressTypeData" :key="index" :label="items.label"
            @click.native="changeSelect(items)"
            :value="items.value">
          </el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="销售厅名称" prop="channelName">
        <el-input v-model="form.channelName" placeholder="请输入销售厅名称" maxlength="30">
        </el-input> 
      </el-form-item>
      <el-form-item label="销售厅面积" prop="pointArea">
        <el-input v-model.number="form.pointArea" placeholder="请输入销售厅面积" maxlength="5">
          <template slot="append">m²</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="投注卡开卡次数限制" prop="buyCardLimit">
        <el-input v-model="form.buyCardLimit" placeholder="请输入投注卡开卡次数" maxlength="8">
          <template slot="append">次</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="试玩卡开卡次数限制" prop="tryCardLimit">
        <el-input v-model="form.tryCardLimit" placeholder="请输入试玩卡开卡次数" maxlength="8">
          <template slot="append">次</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="充值次数限制" prop="rechargeCount">
        <el-input v-model="form.rechargeCount" placeholder="请输入充值次数" maxlength="8">
          <template slot="append">次</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="渠道人员上限" prop="channelLimit">
        <el-input v-model="form.channelLimit" placeholder="请输入渠道人员上限" maxlength="3" show-word-limit></el-input> 
      </el-form-item>
      <!-- <el-form-item label="渠道纬度" prop="latitude">
        <el-input v-model="form.latitude" placeholder="请输入渠道纬度" maxlength="10" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="渠道经度" prop="longitude">
        <el-input v-model="form.longitude" placeholder="请输入渠道经度" maxlength="10" show-word-limit></el-input> 
      </el-form-item> -->
      <el-form-item label="账户记录查询台数" prop="showMachineCount">
        <el-input v-model="form.showMachineCount" placeholder="请输入账户记录查询台数" maxlength="3">
          <template slot="append">台</template>
        </el-input> 
      </el-form-item>
      <el-form-item label="渠道地址" prop="regionCode">
        <el-cascader
          v-model="form.regionCode"
          :props="cascaderProps"
          @change="changeCity"
          :options="cityData"
          placeholder="请选择省 / 市 / 区"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="" prop="channelAddress" style="margin-top: -10px;">
        <el-input v-model="form.channelAddress" placeholder="填写详细地址" class="address" maxlength="50" show-word-limit></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  model: {
    prop: 'form',
    event: 'returnBack'
  },
  props: {
    form: {
      type: Object,
      default: {}
    },
    insData: {
      type: Array,
      default: [],
    },
    isValid: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isManual: false,
      cascaderProps: {
        label: "text",
        value: "code",
        children: "children"
      },
      cityData: [],
      rules: {
        title: [
          { required: true, validator: this.$rules.checkName, title: '标题', trigger: ['change','blur'] }
        ],
        channelType: [
          { required: true, message: '渠道类型不能为空', trigger: ['change','blur'] }
        ],
        insId: [
          { required: true, message: '所属渠道不能为空', trigger: ['change','blur'] }
        ],
        channelLevelId: [
          { required: true, message: '渠道等级不能为空', trigger: ['change','blur'] }
        ],
        channelNo: [
          { required: true, validator: this.$rules.checkChannelCode, title: '渠道编号', trigger: ['blur'] }
        ],
        runField: [
          { required: true, message: '经营场所属性不能为空', trigger: ['change','blur'] }
        ],
        channelAddress: [
          { required: true, message: '渠道地址不能为空', trigger: ['change','blur'] }
        ],
        partnerId: [
          { required: true, message: '合作伙伴不能为空', trigger: ["change","blur"] }
        ],
        regionCode: [
          { required: true, message: '省/市/区不能为空', trigger: ["change","blur"] }
        ],
        channelName: [
          { required: true, validator: this.$rules.checkName, title: '销售厅名称', trigger: ["change","blur"] }
        ],
        pointArea: [
          { required: true, validator: this.$rules.numberCheck, title: '销售厅面积', trigger: ['change','blur'] }
        ],
        longitude: [
          { required: true, validator: this.$rules.checkLng, title: '渠道经度', trigger: ['change','blur'] }
        ],
        latitude: [
          { required: true, validator: this.$rules.checkLat, title: '渠道纬度', trigger: ['change','blur'] }
        ],
        buyCardLimit: [
          { required: true, validator: this.$rules.checkPositive, title: '投注卡开卡次数', trigger: ['change','blur'] }
        ],
        tryCardLimit: [
          { required: true, validator: this.$rules.checkPositive, title: '试玩卡开卡次数', trigger: ['change','blur'] }
        ],
        rechargeCount: [
          { required: true, validator: this.$rules.checkPositive, title: '充值次数', trigger: ['change','blur'] }
        ],
        channelLimit: [
          { required: true, validator: this.$rules.checkPositive, title: '渠道人员总数', trigger: ['change','blur'] }
        ],
        showMachineCount: [
          { required: true, validator: this.$rules.checkPositive, title: '账户记录查询台数', trigger: ['change','blur'] }
        ],
      },
      channelLevelData: [{label:'一级', value:1},{label:'二级',value:2},{label:'三级', value:3},{label:'四级',value:4}],
      channelTypeData:[{ label: "自营厅", value: 0 },{ label: "合作厅", value: 1 }],
      addressTypeData: [{label:'自有', value:0},{label:'租赁',value:1}],
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        // multiple: true, // 多选
        checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的}
      },
      // limitTxt: '温馨提示：该机构暂无自营厅/合作厅的计划额度数据',
      type: this.$route.query.type,
      newSellingHall: 0,
      cooperationHall: 0,
      partnerData: [],
      gradeData: []
    }
  },
  created() {
    // console.log(this.form.channelNo)
    // this.form.insCode = this.form.channelNo&&this.form.channelNo.slice(0, 4);
    // this.form.channelNo = this.form.channelNo&&this.form.channelNo.slice(4);
    // console.log(this.form.channelNo)
    this.getChannelGradeList()
  },
  watch: {
    "form.insCode": {
      handler(newValue, oldValue) {
       
      },
      deep: true,
    },
    "form.insId": {
      handler(newValue, oldValue) {
        if(newValue) {
          // this.form.regionCode = null;
          
          let ins;
          if(typeof newValue == 'number') {
            ins = newValue;
          }else{
            ins = newValue[newValue.length-1]
          }
          if(!ins) {
            console.log('没有机构')
            return;
          }
          // 获取计划额度
          this.getChannelLimit(ins);

          // 获取合作伙伴列表
          // this.form.partnerId = null;
          let data = {
            insId: ins
          }
          this.getChannelPartner(data)
          let insName = this.$formMethods.getInsArray(ins, 'id', this.insData, 'text');
          let insCode = this.$formMethods.getInsArray(ins, 'id', this.insData, 'extendAttach');
          this.form.insName = insName[0];
          this.form.insCode = insCode[0]?`${insCode[0].slice(0,4)}00`:'';
          this.form.channelNo = this.form.channelNo?this.form.channelNo.slice(6, 10):'';
          // 渠道地址的回填
          let type = this.$formMethods.getInsArray(ins, 'id', this.insData, 'type')
          let param = {
            insId: ins,
            type: type[0]
          };
          this.getChannelAddress(param);
        }else{
          this.form.insCode = '';
          this.form.channelNo = this.form.channelNo?this.form.channelNo.slice(0, 4):'';
        }
      },
      deep: true,
    }
  },
  computed: {
    limitTxt(val) {
      if(this.form.channelType==0) {
        let sell = this.newSellingHall;
        if(!this.newSellingHall) {
          sell = 0;
        }
        return `该机构自营厅的计划额度为${sell}`
      }else{
        let coop = this.cooperationHall;
        if(!this.cooperationHall) {
          coop = 0;
        }
        return `该机构合作厅的计划额度为${coop}`
      }
    }
  },
  methods: {
    selectPartner() {

    },
    // 渠道等级列表-下拉框
    getChannelGradeList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelGradeList({ data });
        if (res && res.code == 0) {
          self.gradeData = res.data;
        }
      })(data);
    },
    // 渠道合作伙伴
    getChannelPartner(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelPartner({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          if(res.data.length == 0) {
            this.form.partnerId = null;
          }
          self.partnerData = res.data;
        }
      })(data);
    },
    changeInsId(val) {
        // 仓库名称
        let ins = val[val.length-1];
        this.getChannelLimit(ins);
        let array = this.$formMethods.getInsArray(ins, 'id', this.insData, 'text')
        let str = array.reverse().slice(0,2).join('')
        console.log('str',str)
        // this.form.warHouseName = str;
        // 渠道地址的回填
        let type = this.$formMethods.getInsArray(ins, 'id', this.insData, 'type')
        let param = {
          insId: ins,
          type: type[0]
        };
        this.getChannelAddress(param);
    },
    // 渠道地址
    getChannelAddress(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelAddress({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.cityData = res.data;
        }
      })(data);
    },
    changeCity() {
      // this.form.regionCode = this.regionCode[this.regionCode.length-1]
    },
    // getChannelLimit(val) {
    //   if(val) {
    //     let data = {data: val};
    //     this.getChannelLimit(val)
    //   }
    // },
    changeSelect() {

    },
    // 获取渠道额度
    getChannelLimit(data) {
      const self = this;
      self.isManual = true;
      this.newSellingHall = 0;
      this.cooperationHall = 0;
      let obj = {
        sellingMachine: 0,
        cooperationMachine: 0,
      };
      this.$emit('limit', obj);
      (async data => {
        let res = await self.$api.getChannelLimit({data});
        if (res && res.code == 0) {
          this.newSellingHall = res.data.newSellingHall;
          this.cooperationHall = res.data.cooperationHall;
          this.$emit('limit', res.data)
        }
      })(data);
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
  .vlt-edit-wrap{
    width: 100%;
    margin: 0 30px;
  }
  .vlt-edit-btn{
    text-align: right;
    margin: 60px 0 30px;
    .el-button{
      width: 120px;
    }
    .cancel{
      margin: 0 50px 0 80px;
    }
  }
  .flex-wrap{
    display: flex;
    align-items: center;
  }
  .address{
    margin-top: 5px;
  }
</style>
