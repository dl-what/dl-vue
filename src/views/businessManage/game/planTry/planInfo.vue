<template>
  <div>
    <!-- 计划信息 -->
    <el-form label-position="right" 
      label-width="116px" 
      :model="form"
      :rules="rules"
      ref="form"
      class="baseInfo">
        <el-form-item label="计划编号" prop="gamePlayCode">
          <el-input v-model.trim="form.gamePlayCode" placeholder="请输入计划编号" maxlength="10" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="计划名称" prop="gamePlayName">
          <el-input v-model.trim="form.gamePlayName" placeholder="请输入计划名称" maxlength="20" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="试玩时间" prop="playTime">
          <el-date-picker
            v-model="form.playTime"
            :picker-options="pickerOptions"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            align="left">
          </el-date-picker>
        </el-form-item>
         <el-form-item label="计划简介" prop="gamePlayDesc">
          <el-input v-model="form.gamePlayDesc" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入试玩计划简介" maxlength="150"></el-input> 
        </el-form-item>
        <el-form-item label="试玩游戏" prop="gameId">
          <el-select v-model="form.gameId" placeholder="请选择游戏">
            <el-option v-for="(item,index) in gameData" :key="index" :label="item.gameName"
              @click.native="changeGame(item)"
              :value="item.id">
              <span style="float: left">{{ item.gameName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.gameStatusName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试玩工具" prop="gamePlayTool">
          <el-radio v-model="form.gamePlayTool" :label="3">全部</el-radio>
          <el-radio v-model="form.gamePlayTool" :label="1">试玩投注卡</el-radio>
          <el-radio v-model="form.gamePlayTool" :label="2">会员试玩权益</el-radio>
        </el-form-item>
        <el-form-item label="试玩区域" prop="gamePlayIns">
          <el-cascader
            @change="changeIns"
            v-model="form.gamePlayIns"
            :options="dataArray"
            :props="setProps"
            placeholder="请选择试玩区域"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="试玩渠道" prop="gamePlayChannel">
          <el-radio v-model="form.gamePlayChannel" label="1">区域内全部大厅</el-radio>
          <el-radio v-model="form.gamePlayChannel" label="2">区域内指定大厅</el-radio>
        </el-form-item>
        <el-form-item v-if="form.gamePlayChannel==2" label="区域内指定大厅" prop="gamePlayChannelCode">
          <el-input v-model="form.gamePlayChannelCode" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入10位数的大厅编号，多个大厅以“；”相隔" maxlength="1000"></el-input>
        </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
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
        gamePlayCode: [
          { required: true, validator: this.$rules.checkCode, title: '计划编号', trigger: ['change','blur'] }
        ],
        gamePlayName: [
          { required: true, validator: this.$rules.checkName, title: '计划名称', trigger: ['change','blur'] }
        ],
        playTime: [
          { required: true, message: '试玩时间不能为空', trigger: ['change','blur'] }
        ],
        endPlayTime: [
          { required: true, message: '试玩结束时间不能为空', trigger: ['change','blur'] }
        ],
        gameId: [
          { required: true, message: '试玩游戏不能为空', trigger: ['change','blur'] }
        ],
        gamePlayIns: [
          { required: true, message: '试玩区域不能为空', trigger: ['change','blur'] }
        ],
        gamePlayTool: [
          { required: true, message: '试玩工具不能为空', trigger: ['change','blur'] }
        ],
        gamePlayChannel: [
          { required: true, message: '试玩渠道不能为空', trigger: ['change','blur'] }
        ],
        gamePlayChannelCode: [
          { required: true, validator: this.$rules.checkChannelNo, title: '区域内指定大厅', trigger: ["change","blur"] }
        ],
      },
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        multiple: true, // 多选
        checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
      },
      gameData: [],
      insData: [],
      dataArray: [],
      initIns: [],
    }
  },
  created() {
    this.getAllGameList()
    this.getInsData();
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
      // let area = this.form.gamePlayIns&&this.form.gamePlayIns.split(';');
      // let insArray = []
      // area&&area.forEach((item)=>{
      //   if(item) {
      //     let arr = this.$formMethods.getInsArray(item,'id', this.insData, 'id') // 传入id 和对象
      //     arr&&arr.reverse();
      //     insArray.push(arr)
      //   }
      // })
      // this.form.gamePlayIns = insArray;
      // 编辑需要回填
      if(this.$route.query.gameId) {
        let param = {
          gameId: this.$route.query.gameId
        };
        this.getTryGameArea(param)
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
      // this.$set(this.dataArray, 0, data[0]);
      console.log(this.dataArray)
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
    // 选择机构
    changeIns(val) {
      const self = this;
      val.forEach((item)=>{
        if(item.length==1&&item[0]==1) {
          // 选中福彩要做特殊处理 清空其他选项 并禁用 
          this.form.gamePlayIns = [item]
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
    // 获取试玩区域下的所有渠道
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
      this.form.gamePlayIns = [];
      this.getTryGameArea(data)
    },
    // 获取该游戏已试玩的区域
    getTryGameArea(data) {
      const self = this;
      (async (data)=>{
				let res = await self.$api.getTryGameArea({data})
				if(res && res.code == 0) {
          // self.gameData = res.data;
          self.initIns = res.data;
          let array = [];
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
    changeSelect() {

    },
    // 获取所有游戏列表
    getAllGameList() {
      const self = this;
      const data = {
        gameStatus: "2"
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
