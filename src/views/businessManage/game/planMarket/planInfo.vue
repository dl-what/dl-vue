<template>
  <div>
    <!-- 计划信息 -->
    <el-form label-position="right" 
      label-width="116px" 
      :model="form"
      :rules="rules"
      ref="form"
      class="baseInfo">
        <el-form-item label="计划编号" prop="gameListCode">
          <el-input v-model.trim="form.gameListCode" placeholder="请输入计划编号" maxlength="10" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="计划名称" prop="gameListName">
          <el-input v-model.trim="form.gameListName" placeholder="请输入计划名称" maxlength="20" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="上市时间" prop="gameListTime">
          <el-date-picker type="datetime"
            :picker-options="pickerOptions"
            v-model="form.gameListTime"
            @change="changeSelect"
            :default-time="defaultTime"
            placeholder="请选择上市时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划简介" prop="gameSaleDesc">
          <el-input v-model="form.gameSaleDesc" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入上市计划简介" maxlength="150"></el-input> 
        </el-form-item>
        <el-form-item label="上市游戏" prop="gameId">
          <el-select v-model="form.gameId" placeholder="请选择游戏">
            <el-option v-for="(item,index) in gameData" :key="index" :label="item.gameName"
              @click.native="changeGame(item)"
              :value="item.id">
              <span style="float: left">{{ item.gameName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.gameStatusName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售区域" prop="gameSaleIns">
          <el-cascader
            @change="changeIns"
            v-model="form.gameSaleIns"
            :options="dataArray"
            :props="setProps"
            placeholder="请选择销售区域"
            clearable>
          </el-cascader>
        </el-form-item>
        <!-- <el-form-item label="是否覆盖区域" prop="isOverride">
          <el-tooltip v-model="isManual" class="item" manual effect="light" :content="limitTxt" placement="right">
            <el-switch
              v-model="form.isOverride"
              :active-text="form.isOverride==0?'关闭':'开启'"
              :inactive-value="0"
              :active-value="1">
            </el-switch>
          </el-tooltip>
        </el-form-item> -->
        <el-form-item label="销售渠道" prop="gameSaleChannel">
          <el-radio v-model="form.gameSaleChannel" label="1">区域内全部大厅</el-radio>
          <el-radio v-model="form.gameSaleChannel" label="2">区域内指定大厅</el-radio>
        </el-form-item>
        <el-form-item v-if="form.gameSaleChannel==2" label="区域内指定大厅" prop="gameSaleChannelCode">
          <el-input v-model="form.gameSaleChannelCode" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入10位数的大厅编号，多个大厅以“；”相隔" maxlength="1000"></el-input>
        </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
import moment from "moment"
import { mapGetters } from 'vuex';

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
  },
  data() {
    return {
      pickerOptions: this.beginDate(),
      rules: {
        gameListCode: [
          { required: true, validator: this.$rules.checkCode, title: '计划编号', trigger: ['change','blur'] }
        ],
        gameListName: [
          { required: true, validator: this.$rules.checkName, title: '计划名称', trigger: ['change','blur'] }
        ],
        gameListTime: [
          { required: true, message: '上市时间不能为空', trigger: ['change','blur'] }
        ],
        gameId: [
          { required: true, message: '上市游戏不能为空', trigger: ['change','blur'] }
        ],
        gameSaleIns: [
          { required: true, message: '销售区域不能为空', trigger: ['change','blur'] }
        ],
        gameSaleChannel: [
          { required: true, message: '销售渠道不能为空', trigger: ['change','blur'] }
        ],
        gameSaleChannelCode: [
          { required: true, validator: this.$rules.checkChannelNo, title: '区域内指定大厅', trigger: ["change","blur"] }
        ],
      },
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        multiple: true, // 多选
        checkStrictly: true //设置父子节点是否取消选中关联，从而达到选择任意一级选项的目的
      },
      gameData: [],
      dataArray: [],
      isManual: true,
      insData: [],
      initIns: [], // 游戏上市的区域
      defaultTime: moment(Date.now()).format('HH:mm:ss'),
    }
  },
  watch: {
    "form.gameListTime": {
      handler(newValue) { // 对于过去的时分秒置灰不能选择
        let time = new Date().setHours(0, 0, 0, 0) + 86400000;
        let now = new Date(newValue).getTime()
        if(now-time>0) { // 选择的是明天之后的时间
          this.pickerOptions.selectableRange = '00:00:00-23:59:59'
        }else{
          this.pickerOptions.selectableRange = `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
        }
      },
      deep: true,
    }
  },
  created() {
    this.getAllGameList()
    this.getInsData();
  },
  computed: {
    limitTxt() {
      let tip;
      if(this.form.isOverride==1) {
        tip = '开启覆盖历史区域功能，例如：这次销售区域选中了广东省，会覆盖该游戏之前的已上市的区域';
      }else{
        tip = '关闭覆盖历史区域功能，例如：这次销售区域选中了广东省，不会覆盖该游戏之前的已上市的区域';
      }
      return tip;
    }
  },
  methods: {
    beginDate(){
      let self = this
      return {
        disabledDate(time)  {
          return time.getTime() < Date.now() - 8.64e7 // 过去时间不可选
        },
        selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
      }
    },
    init() {
      let ins = this.form.gameSaleIns&&this.form.gameSaleIns.split(';')
      let area = this.form.gameSaleIns&&this.form.gameSaleIns.split(';');
      let insArray = []
      area&&area.forEach((item)=>{
        if(item) {
          let arr = this.$formMethods.getInsArray(item,'id', this.insData, 'id') // 传入id 和对象
          arr&&arr.reverse();
          insArray.push(arr)
        }
      })
      this.form.gameSaleIns = insArray;
      // 编辑需要回填
      if(this.$route.query.gameId) {
        let param = {
          gameId: this.$route.query.gameId
        };
        this.getGameSalesArea(param)
      }
    },
    // 获取机构列表
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          self.insData = res.data
          self.init()
        }
      })(data);
    },
    // 选择机构
    changeIns(val) {
      const self = this;
      val.forEach((item)=>{
        if(item.length==1&&item[0]==1) {
          // 选中福彩要做特殊处理 清空其他选项 并禁用 
          this.form.gameSaleIns = [item]
          // 禁用已选的区域
          let dataAll = JSON.parse(JSON.stringify(self.insData))
          self.setInsArray(dataAll)
        }
      })
      if(val.length==0) {
        // 放开全部的区域
        let clearDataAll = JSON.parse(JSON.stringify(self.insData))
        self.clearInsArray(clearDataAll);
        self.setInitIns();
      }
    },
    // 初始化游戏的上市区域
    setInitIns() {
      const self = this;
      let array = [];
      self.initIns.forEach((item)=>{
        if(item) {
          array = array.concat(item.insId)
        }
      })
      // 数组去重
      let result = self.distinct(array)

      // 禁用已选的区域
      let dataAll = JSON.parse(JSON.stringify(self.insData))
      self.getInsArray(dataAll, result)
      console.log(result)
    },
    // 不选中福彩-放开全部的区域
    clearInsArray(data) {
      const self = this;
      for (var i in data) {
        if(data[i].id!=1) {
          data[i].disabled = false;
        }
        if(data[i].children) {
          self.setInsArray(data[i].children);
        }
      }
      this.dataArray = data;
      // this.$set(this.dataArray, 0, data);
      console.log('禁用全部', this.dataArray)
    },
    // 选中福彩-禁用全部的区域
    setInsArray(data) {
      const self = this;
      for (var i in data) {
        if(data[i].id!=1) {
          data[i].disabled = true;
        }
        if(data[i].children) {
          self.setInsArray(data[i].children);
        }
      }
      this.dataArray = data;
      // this.$set(this.dataArray, 0, data);
      console.log('禁用全部', this.dataArray)
    },
    // 获取销售区域下的所有渠道
    getChannelByIns(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getChannelByIns({data})
				if(res && res.code == 0) {
          // self.gameData = res.data;
				}
      })(data)
    },
    // 选择游戏
    changeGame(val) {
      let data = {
        gameId: val.id
      };
      this.form.gameSaleIns = [];
      this.getGameSalesArea(data)
    },
    // 获取该游戏已上市的区域
    getGameSalesArea(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getGameSalesArea({data})
				if(res && res.code == 0) {
          // self.gameData = res.data;
          let array = [];
          // 保存备份数据
          self.initIns = res.data;

          res.data.forEach((item)=>{
            if(item) {
              array = array.concat(item.insId)
            }
          })
          // 数组去重
          let result = self.distinct(array)

          // 禁用已选的区域
          let dataAll = JSON.parse(JSON.stringify(self.insData))
          self.getInsArray(dataAll, result)
          console.log(result)
				}
      })(data)
    },
    // 禁用已选的区域
    getInsArray(data, array) {
      const self = this;
      for (var i in data) {
        if (array.includes(data[i].id)) {
          data[i].disabled = true;
        }else{
          data[i].disabled = false;
        }
        if(data[i].children) {
          self.getInsArray(data[i].children, array);
        }
      }
      this.dataArray = data;
      // this.$set(this.dataArray, 0, data);
      console.log('dataArray', this.dataArray)
    },
    // 数组去重
    distinct(arr) {
      let result = []
      let obj = {}
      for (let i of arr) {
        if (i&&!obj[i]) {
          obj[i] = 1;
        }
      }
      Object.keys(obj).forEach(function(key){
          result.push(key*1)
      });
      return result
    },
    changeSelect(val) {
      let time = new Date(val).getTime();
      let now = new Date().getTime()
      if(now-time>0) { // 选择的是过去时间
        this.form.gameListTime = now;
      }
    },
    // 获取所有游戏列表
    getAllGameList() {
      const self = this;
      const data = {
        gameStatus: "1,3,4"
      };
      (async (data)=>{
				let res = await self.$api.getAllGameList({data})
				if(res && res.code == 0) {
          let options = {
            1: '储备',
            2: '试玩',
            3: '上市',
            4: '退市'
          };
          res.data.forEach((item)=>{
            item.gameStatusName= options[item.gameStatus]
          })
          self.gameData = res.data;
				}
      })(data)
    },
  },
}
</script>

<style lang="less" scoped>
  .vlt-edit-wrap{
    width: 100%;
  }
  .flex-wrap{
    display: flex;
    align-items: center;
  }
</style>
