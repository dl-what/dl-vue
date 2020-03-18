<template>
  <div>
    <!-- 服务器设置 -->
    <div class="flex-wrap">
      <div class="flex-item">
        <div class="flex-hd">
          <el-checkbox 
            :disabled="disabled"
            :indeterminate="isLeftAll" 
            v-model="leftCheck" 
            @change="checkLeftAll">
            全选
          </el-checkbox>
          <span>待分配列表</span>
        </div>
        <div class="flex-bd">
          <el-checkbox-group 
            :disabled="disabled"
            v-model="leftCheckedList" 
            @change="checkedLeftChange"
            class="flex-check">
            <el-checkbox :disabled="item.disabled" v-for="(item,index) in leftData" :label="item" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="flex-item">
        <el-button size="mini" @click="toRight">加入右侧<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        <el-button size="mini" @click="toLeft" class="mr" icon="el-icon-arrow-left">加入左侧</el-button>
      </div>
      <div class="flex-item">
        <div class="flex-hd">
          <el-checkbox 
            :indeterminate="isRightAll" 
            v-model="rightCheck" 
            :disabled="disabled"
            @change="checkRightAll">
            全选
          </el-checkbox>
          <span>已分配列表</span>
        </div>
        <div class="flex-bd">
          <el-checkbox-group 
            v-model="rightCheckedList" 
            @change="checkedRightChange"
            :disabled="disabled"
            class="flex-check">
            <el-checkbox :disabled="item.disabled" v-for="(item,index) in rightData" :label="item" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

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
      leftCheck: false,
      rightCheck: false,
      isLeftAll: true,
      isRightAll: true,
      leftCheckedList: [], // 待分配的选中数据
      rightCheckedList: [], // 已分配的选中数据
      leftData: [], // 待分配的全部数据
      rightData: [], // 已分配的全部数据
      disabled: false,
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == '1' ? true : false;
    // 获取服务器ip地址
    this.getProviderIpProt({})
    
  },
  watch: {
    rightData: {
      handler(val) {
        let array = []
        val.forEach((item)=>{
          array.push(item.label)
        });
        this.form.serverIpSet = array.join(',')
      },
      deep: true,
    }
  },
  methods: {
    // 获取服务器地址
    getProviderIpProt() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.getProviderIpProt({ data });
        if (res && res.code == 0) {
          let leftArray = [];
          res.data.forEach((item)=>{
            let obj = {};
            obj.label = item.ipPort;
            obj.disabled = false;
            leftArray.push(obj)
          })
          self.leftData = leftArray;
          let array = self.form.serverIpSet&&self.form.serverIpSet.split(',');
          array&&array.forEach((item)=>{
            let obj= {};
            obj.label = item;
            obj.disabled = false;
            self.rightData.push(obj) 
          })
          self.leftData = self.distinct(self.leftData, self.rightData)
        }
      })(data);
    },
    distinct(a, b) {
      let arr = a.concat(b)
      let result = []
      let obj = {}
      for (let i of arr) {
        if (!obj[i.label]) {
          obj[i.label] = 1;
        } else {
          delete obj[i.label]
        }
      }
      Object.keys(obj).forEach(function(key){
          let item = {
            label: key,
            disabled: false
          }
          result.push(item)
      });
      return result
    },
    toRight() {
      this.leftCheckedList.forEach(item=>{
        item = JSON.parse(JSON.stringify(item))
        this.rightData.push(item)
      })
      this.leftData = this.distinct(this.leftData, this.leftCheckedList)
      this.leftCheckedList = [];
    },
    toLeft() {
      this.rightCheckedList.forEach(item=>{
        item = JSON.parse(JSON.stringify(item))
        this.leftData.push(item)
      })
      this.rightData = this.distinct(this.rightData, this.rightCheckedList)
      this.rightCheckedList = [];
    },
    // 待分配的全选
    checkLeftAll(val) {
      this.leftCheckedList = val ? this.leftData : [];
      this.isLeftAll = false;
    },
    // 已分配的全选
    checkRightAll(val) {
      this.rightCheckedList = val ? this.rightData : [];
      this.isRightAll = false;
    },
    // 待分配的复选框
    checkedLeftChange(val) {
      let checkedCount = val.length;
      this.leftCheck = checkedCount === this.leftData.length;
      this.isLeftAll = checkedCount > 0 && checkedCount < this.leftData.length;
    },
    // 已分配的复选框
    checkedRightChange(val) {
      let checkedCount = val.length;
      this.rightCheck = checkedCount === this.rightData.length;
      this.isRightAll = checkedCount > 0 && checkedCount < this.rightData.length;
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
  }
  .flex-wrap{
    display: flex;
    align-items: center;
    position: relative;
  }
  .flex-item:nth-of-type(1){
    flex: 0 0 37%;
    border: 1px solid #e8eaec;
    border-radius: 6px;
    padding: 10px 16px;
  }
  .flex-item:nth-of-type(2){
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 0 0 26%;
  }
  .flex-item:nth-of-type(3){
    flex: 0 0 37%;
    border: 1px solid #e8eaec;
    border-radius: 6px;
    padding: 10px 16px;
  }
  .mr{
    margin: 20px 0 0 0;
  }
  .flex-hd{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    border-bottom: 1px solid #e8eaec;
  }
  .flex-check{
    display: flex;
    flex-direction: column;
    padding: 5px 0;
    min-height: 160px;
    .el-checkbox{
      height: 36px;
      line-height: 36px;
    }
    .el-checkbox__label{
      font-size: 12px;
    }
  }
</style>
