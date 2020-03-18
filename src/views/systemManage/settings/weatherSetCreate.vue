<template>
<!-- 新增天气参数页面 -->
<div class="vlt-card">
  <panel :title="title" :show="true">
    <div class="vlt-edit-single">
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="10em" style="margin-top:20px">
        <el-form-item label="日期" prop="day">
          <el-date-picker
            v-model="form.day"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="星期几" prop="dayOfWeek">
          <el-select v-model="form.dayOfWeek" placeholder="请选择星期几">
            <el-option v-for="(item,index) in dayList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省级名称" prop="provinceName">
          <el-select @change="getProviceCode" v-model="form.provinceName" placeholder="请选择省级名称">
            <el-option v-for="(item,index) in proviceList" :key="index" :label="item.text" :value="item.text"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="省级编码">
          <el-input v-model="form.provinceCode" placeholder="请输入省级编码" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="市级名称">
          <el-select @change="getCityCode" v-model="form.cityName" placeholder="请选择市级名称">
            <el-option v-for="(item,index) in cityList" :key="index" :label="item.text" :value="item.text"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="市级编码">
          <el-input v-model="form.cityCode" placeholder="请输入市级编码" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="天气" prop="weather">
          <el-select v-model="form.weather" placeholder="请选择天气">
            <el-option v-for="(item,index) in weatherOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="气温">
          <el-input v-model="form.airTemperature" placeholder="请输入气温" maxlength="6">
            <template slot="append">°C</template>
          </el-input>
        </el-form-item>
        <el-form-item label="风向">
          <el-input v-model="form.wind" placeholder="请输入风向" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="是否节假日" prop="isHoliday">
          <el-select v-model="form.isHoliday" placeholder="请选择是否是节假日">
            <el-option label="是" :value= 1></el-option>
            <el-option label="否" :value= 0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="节假日名称" v-if="this.form.isHoliday != 0">
          <el-input v-model="form.holiday" placeholder="请输入节假日名称" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="事件名称" prop="eventName">
          <el-input v-model="form.eventName" placeholder="请输入事件名称" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="事件地址">
          <el-input v-model="form.eventAddress" placeholder="请输入事件地址" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="事件内容">
          <el-input type="textarea" v-model="form.eventContent" placeholder="请输入事件内容" maxlength="150"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row cla-ss="vlt-edit-btn">
            <el-button :id="'weatherSetCreate-submit'" type="primary" v-prevent="1000" size="medium" @click="submit">保存</el-button>
            <el-button :id="'weatherSetCreate-cancel'" size="medium" @click="cancel">取消</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </panel>
</div>
</template>

<script type="text/javascript">
  import {treeReselection} from '@/utils/treeSelection'
  import rules from '@/utils/rules'
import moment from 'moment'
export default {
name: "weatherSetCreate",
data() {
return {
  title: this.$route.query.id ? "编辑天气参数" : "新增天气参数",
  rules: {
    day: [
      {required: true, trigger: ['blur', 'change'], message: '请选择日期'}
    ],
    dayOfWeek: [
      {required: true, trigger: ['blur', 'change'], message: '请选择星期几'}
    ],
    provinceName: [
      {required: true, trigger: ['blur', 'change'], message: '请选择省级名称'}
    ],
    weather: [
      {required: true, trigger: ['blur', 'change'], message: '请选择天气'}
    ],
    eventName: [
      {required: true, validator: rules.checkName, trigger: ['blur', 'change'], title: '事件名称'}
    ],
    isHoliday: [
      {required: true, trigger: ['blur', 'change'], message: '请选择是否是假日'}
    ]
  },
  form: {
    day: "",
    dayOfWeek: "",
    provinceName: "",
    provinceId: "",
    cityName: "",
    cityId: "",
    weather: "",
    airTemperature: "",
    wind: "",
    isHoliday: 0,
    holiday: "",
    eventName: "",
    eventAddress: "",
    eventContent: ""
  },
  proviceList: [],
  cityList: [],
  weatherOptions: [
    {label: "晴", value: 0},
    {label: "雨", value: 1},
    {label: "雪", value: 2},
    {label: "阴", value: 3},
    {label: "雾", value: 4},
    {label: "雷雨", value: 5}
  ],
  dayList: [
    {label: "星期一", value: 1},
    {label: "星期二", value: 2},
    {label: "星期三", value: 3},
    {label: "星期四", value: 4},
    {label: "星期五", value: 5},
    {label: "星期六", value: 6},
    {label: "星期天", value: 7}
  ],
  id: this.$route.query.id,
  editData: null
}
},
computed: {
  isEdit() {
    return this.id ? true : false;
  }
},
watch: {
  editData(data) {
    if (data) {
      // console.log(Object.keys(this.form))
      Object.keys(this.form).forEach(item =>{
        this.form[item] = data[item];
      }) 
    }
  }
},
created() {
  if (this.isEdit) {
    this.getDetail();
  }
  // this.getInsDataList();
  this.getInsData();
},
methods: {
  getInsData(){
    const self = this
    const data = {};
    (async data =>{
      let res = await self.$api.getInsDataList({ data });
      console.log("机构数据",res)
      if (res && res.code == 0){
        let list = res.data;
        let topItem = list[0];
        if (topItem && topItem.id == 1) {
          this.proviceList = topItem.children || [];
          console.log("省级",this.proviceList)
        } else {
          this.proviceList = list || [];
        }
      }
    })(data)
  },
  // 请求详情的数据
  async getDetail() {
    let res = await this.$api.getWeatherDetail({
      data: this.$route.query.id
    })
    if (res && res.code == 0) {
      this.editData = res.data;
    }
  },
   // 获取机构列表
  // async getInsDataList() {
  //   const res = await this.$api.getInsDataList();
  //   if (res && res.code === 0) {
  //     const list = res.data;
  //     const topItem = list[0];
  //     // 过滤中福彩
  //     console.log(list)
  //     if (topItem && topItem.id == 1) {
  //       this.proviceList = topItem.children || [];
  //       this.cityList = topItem.children || [];
  //     } else {
  //       this.proviceList = list || [];
  //       this.cityList = list || [];
  //     }
  //     if (this.editData) {
  //       // 机构回填级联
  //       this.form.provinceName = treeReselection({
  //         treeData: this.proviceList,
  //         keyValue: this.form.provinceName
  //       }).map(item => item.id);
  //     }
  //   }
  // },
  submit() {
    const self = this;
    self.$refs.form.validate(async (valid) =>{
      if (valid) {
        let apiName = this.isEdit ? "updateWeatherSet" : "addWeatherEvent";
        let message = this.isEdit ? "编辑成功" : "新增成功";
        let data = JSON.parse(JSON.stringify(self.form));
        Object.assign(data,{
          day: moment(data.day).valueOf()
        });
        if (this.isEdit) {
          data.dayId = this.id;
        }
        console.log(data)
        let res = await self.$api[apiName]({ message,data });
        if (res && res.code == 0) {
          this.$router.push("weatherSetting")
        }
      } 
    })
    
  },
  cancel() {
    this.$router.back()
  },
  getProviceCode(val) {
    console.log(val);
    // let proviceName = val&&val[val.length - 1];
    this.form.cityName = null;
    this.form.cityCode = null;
    let insObj = this.getInsCode(this.proviceList,val);
    console.log(insObj);
    this.form.provinceId = insObj.id;
    // console.log(this.form.provinceCode)
    // let cityList = this.$formMethods.getInsArray(this.form.proviceName,"text","array","code");
    this.cityList = insObj.children;
    console.log(this.cityList)
  },
  getCityCode(val) {
    // let cityName = val&&val[val.length - 1];
    let cityObj = this.getInsCode(this.cityList,val);
    // console.log(cityObj)
    this.form.cityId = cityObj.id;
  },
  getInsCode(insData, insName) {
    let res = null;
    if (!insData) {
      return;
    }
    for (let i in insData) {
      let item = insData[i]
      if (item.text == insName) {
        res = item;
        break;
      }else if(item.children && item.children.length > 0) {
        res = this.getInsCode(item.children, insName)
      }
    }
    return res;
  },
  filter(data, type) {
    const self = this;
    data&&data.forEach((item)=>{
      if(item.type == type) {
        item.children = null;
      }else{
        self.filter(item.children, type)
      }
    })
    this.filterData = data;
    // console.log(data)
  },
},
}
</script>

<style lang="less" scoped>
</style>
