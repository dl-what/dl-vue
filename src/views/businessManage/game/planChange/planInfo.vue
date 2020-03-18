<template>
  <div>
    <!-- 计划信息 -->
    <el-form label-position="right" 
      label-width="116px" 
      :model="form"
      :rules="rules"
      ref="form"
      class="baseInfo">
        <el-form-item label="计划编号" prop="changePlanCode">
          <el-input v-model.trim="form.changePlanCode" placeholder="请输入计划编号" maxlength="10" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="计划名称" prop="changePlanName">
          <el-input v-model.trim="form.changePlanName" placeholder="请输入计划名称" maxlength="20" show-word-limit></el-input> 
        </el-form-item>
        <el-form-item label="生效时间" prop="changePlanTime">
          <el-date-picker type="datetime"
            :picker-options="pickerOptions"
            v-model="form.changePlanTime"
            @change="changePlanTime"
            placeholder="请选择生效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划简介" prop="changePlanDesc">
          <el-input v-model="form.changePlanDesc" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入变更计划简介" maxlength="150"></el-input> 
        </el-form-item>
        <el-form-item label="变更游戏" prop="gameId">
          <el-select v-model="form.gameId" placeholder="请选择游戏">
            <el-option v-for="(item,index) in gameData" :key="index" :label="item.gameName"
              @click.native="changeGame(item)"
              :value="item.id">
              <span style="float: left">{{ item.gameName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.gameStatusName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更区域" prop="changePlanIns">
          <el-cascader
            @change="changeIns"
            v-model="form.changePlanIns"
            :options="dataArray"
            :props="setProps"
            placeholder="请选择变更区域"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="变更渠道" prop="changePlanChannel">
          <el-radio v-model="form.changePlanChannel" label="1">区域内全部大厅</el-radio>
          <el-radio v-model="form.changePlanChannel" label="2">区域内指定大厅</el-radio>
        </el-form-item>
        <el-form-item v-if="form.changePlanChannel==2" label="区域内指定大厅" prop="changePlanChannelCode">
          <el-input v-model="form.changePlanChannelCode" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入10位数的大厅编号，多个大厅以“；”相隔"></el-input>
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
        changePlanCode: [
          { required: true, validator: this.$rules.checkCode, title: '计划编号', trigger: ['change','blur'] }
        ],
        changePlanName: [
          { required: true, validator: this.$rules.checkName, title: '计划名称', trigger: ['change','blur'] }
        ],
        changePlanTime: [
          { required: true, message: '变更时间不能为空', trigger: ['change','blur'] }
        ],
        gameId: [
          { required: true, message: '变更游戏不能为空', trigger: ['change','blur'] }
        ],
        changePlanIns: [
          { required: true, message: '变更区域不能为空', trigger: ['change','blur'] }
        ],
        changePlanChannel: [
          { required: true, message: '变更渠道不能为空', trigger: ['change','blur'] }
        ],
        changePlanChannelCode: [
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
      dataArray: [], // 过滤后的销售区域
      insData: [],
      initIns: [], 
      isInit: false, // 判断是否初始化回填数据
      gameInfo: null,
    }
  },
  watch: {
    "form.changePlanTime": {
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
    },
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
    changePlanTime(val) {
      let time = new Date(val).getTime();
      let now = new Date().getTime()
      if(now-time>0) { // 选择的是过去时间
        this.form.changePlanTime = now;
      }
    },
    init() {
      
      console.log(this.form.changePlanIns)
      this.isInit = true;
      // 编辑需要回填
      if(this.$route.query.gameId) {
        let param = {
          gameId: this.$route.query.gameId
        };
        let apiUrl = 'getChangeSalesArea';
        if(this.$route.query.gameStatus=='2') {
          apiUrl = 'getTryGameArea'
        };
        this.getChangeSalesArea(param, apiUrl)
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
          this.form.changePlanIns = [item]
          // 禁用已选的区域
          let dataAll = JSON.parse(JSON.stringify(self.insData))
          self.setInsArray(dataAll)
        }
      })
      if(val.length==0) {
        // 放开全部的区域
        // let clearDataAll = JSON.parse(JSON.stringify(self.dataArray))
        // self.clearInsArray(clearDataAll);
        // self.setInitIns();
        self.changeGame(this.gameInfo)
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
    // 选择游戏
    changeGame(val) {
      this.isInit = false;
      this.gameInfo = val;
      let data = {
        gameId: val.id
      };
      this.dataArray = []
      this.form.changePlanIns = [];
      let apiUrl = 'getChangeSalesArea';
      if(val.gameStatus=='2') {
        apiUrl = 'getTryGameArea'
      };
      this.getChangeSalesArea(data, apiUrl)
    },
    // 获取该游戏已上市的区域
    getChangeSalesArea(data, apiUrl) {
      const self = this;
      (async (data)=>{
				let res = await self.$api[apiUrl]({data})
				if(res && res.code == 0) {
          // self.gameData = res.data;
          self.initIns = res.data;
          let array = [];
          let insArray = [];
          let isAll = false; // 判断是否中福彩
          let objData = [];
          res.data.forEach((item)=>{
            array = array.concat(item.insId)
            if(item.insId!=1) {
              
              let arr = this.$formMethods.getInsArray(item.insId,'id', self.insData, 'id') // 传入id 和对象
              let arrTxt = this.$formMethods.getInsArray(item.insId,'id', self.insData, 'text') // 传入id 和对象
              arr&&arr.reverse();
              arrTxt&&arrTxt.reverse();
              console.log(arr, arrTxt)
              insArray.push(arr)
              // 重构树形数据
              arr&&arr.forEach((item, index)=>{
                let obj = {};
                obj.id = item;
                if(index==0) {
                  obj.parentId = 0;
                  obj.text = arrTxt[0]
                }else{
                  obj.parentId = arr[index-1]
                  obj.text = arrTxt[index]
                }
                objData.push(obj)
              })
            }else{
              isAll = true;
            }
          })
          // 把重复的对象去除
          objData = self.objDistinct(objData)
          console.log('objData', objData)
          // 根据数组重新构建树形结构
          let treeData = self.getJsonTree(objData, 0);
          if(isAll) {
            // this.form.changePlanIns = [[1]];
            treeData = self.insData;
            this.dataArray = treeData;
          }else{
            // this.form.changePlanIns = insArray;
            treeData = treeData.length>0?treeData[0].children:[];
            // 把children为空数组的去掉
            treeData = self.filterArray(treeData)
            // 禁用未选的区域
            self.getDisabledInsArray(treeData, array)
          }
          
          // this.dataArray = treeData;
          console.log('tree', treeData)
          // 数组去重
          // let result = self.distinct(array)
          // console.log('parent', self.filterMenu(self.insData, array))
          // 禁用未选的区域
          // let dataAll = JSON.parse(JSON.stringify(treeData))
         
          // this.dataArray = treeData;
          // console.log(result)
          // console.log('deep', self.deepCopy(self.dataArray))
          if(this.isInit) { // 初始化回填数据
            // 回填
            let area = this.form.changePlanIns&&this.form.changePlanIns.split(';');
            let insArray = []
            area&&area.forEach((item)=>{
              if(item) {
                let arr = this.$formMethods.getInsArray(item,'id', this.dataArray, 'id') // 传入id 和对象
                arr&&arr.reverse();
                insArray.push(arr)
              }
            })
            this.form.changePlanIns = insArray;
          }
				}
      })(data)
    },
    // 过滤空数组的区域
    filterArray(data) {
      const self = this;
      for (var i in data) {
        if(data[i].children&&data[i].children.length>0) {
          self.filterArray(data[i].children);
        }else{
          data[i].children = null;
        }
      }
      // this.dataArray = data;
      return data;
      // this.$set(this.dataArray, 0, data);
      console.log('禁用全部', this.dataArray)
    },
    // 数组去重
    objDistinct(arr) {
      let result = []
      let obj = {}
      for (let i of arr) {
        if (i&&!obj[i.id]) {
          obj[i.id] = 1;
          result.push(i)
        }
      }
      // Object.keys(obj).forEach(function(key){
      //     result.push(key*1)
      // });
      return result
    },
    getJsonTree(data, parentId) {
      const self = this;
      var itemArr = [];
      for (var i = 0; i < data.length; i++) {
        var node = data[i];
        if (node.parentId == parentId) {
          var newNode = {};
          newNode.id = node.id;
          newNode.parentId = node.parentId;
          newNode.text = node.text;
          newNode.children = self.getJsonTree(data, node.id);
          itemArr.push(newNode);
        }
      }
      return itemArr;
    },
     // 禁用未选的区域(重构数结构)
    getDisabledInsArray(data, array) {
      const self = this;
      for (var i in data) {
        if (array.includes(data[i].id)) {
          data[i].disabled = false;
        }else{
          data[i].disabled = true;
        }
        if(data[i].children) {
          self.getDisabledInsArray(data[i].children, array);
        }
      }
      this.dataArray = data;
      // this.$set(this.dataArray, 0, data[0]);
      // console.log(this.dataArray)
    },
    // 禁用未选的区域
    getInsArray(data, array) {
      const self = this;
      for (var i in data) {
        if (array.includes(data[i].id)) {
          data[i].disabled = false;
        }else{
          data[i].disabled = true;
        }
        if(data[i].children) {
          self.getInsArray(data[i].children, array);
        }
      }
      this.dataArray = data;
      // this.$set(this.dataArray, 0, data[0]);
      // console.log(this.dataArray)
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
    deepCopy(obj) {
      const self = this;
      let arrobj;
      Array.isArray(obj)?arrobj =[] :arrobj = {};
      for(var i in obj) {
        if(obj.hasOwnProperty(i)) {
          if(typeof obj[i] === "object") {
            arrobj[i] = self.deepCopy(obj[i])
          }else{
            arrobj[i] = obj[i]
          }
          // arrobj[i] = typeof obj[i] === "object" ? self.deepCopy(obj[i]) : obj[i];
        }
      }
      return arrobj;
    },
    filterMenu(menuList, menuCode) {
      const self = this;
      return menuList.filter(item => {
        
        return menuCode.indexOf(item.id) > -1
      }).map(item => {
        
        item = Object.assign({}, item)
        if (item.children) {
            item.children = self.filterMenu(item.children, menuCode)
        }
        return item
      })
    },
    // 获取所有游戏列表
    getAllGameList() {
      const self = this;
      const data = {
        gameStatus: "2,3"
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
