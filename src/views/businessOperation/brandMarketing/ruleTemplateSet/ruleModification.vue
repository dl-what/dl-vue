<template>
<!-- 规则模板设置修改 -->
  <div class="vlt-card rule-template_modification">
    <panel title="编辑规则模板" :show="true" style="margin-bottom:15px">
      <div class="vlt-edit-single">
        <basic-info v-model="baseForm" ref="baseForm"></basic-info>
      </div>
    </panel>
    <panel title="规则设置" :show="true">
      <div class="vlt-edit-single">
      <!-- 活动规则 -->
      <el-form
        v-if="this.ruleType === 1"
        style="margin-top:20px;"
        v-model="activityRule"
        labelWidth="10em"
        ref="baseForm1"
        :rules="rules"
        direction="right"
        class="active-rule">
        <el-form-item label="规则对象">
          <el-select v-model="activityRule.ruleObject" disabled>
            <el-option label="会员" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-table :data="exchangeRuleList" border class="table-content plan-table">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column prop="integralNum" label="积分数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.integralNum" placeholder="请输入积分数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="rightsId" label="兑换权益">
            <template slot-scope="scope">
              <el-select v-model="scope.row.rightsId" placeholder="请选择兑换权益">
                <el-option v-for="(item,index) in interestsOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量">
            <template slot-scope="scope">
              <el-input v-model="scope.row.num" placeholder="请输入数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="300px">
            <template slot-scope="scope">
              <el-input type="textarea" v-model="scope.row.remark" placeholder="备注" maxlength="150"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width='120'>
            <template slot-scope="scope">
              <el-button size="mini" @click="deleteRule(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button size="medium"  class="add-content vlt-add-more" icon="el-icon-plus"  @click="addRule" :id="'ruleModification-addRule'">
          新增兑换规则
        </el-button>
        <el-form-item label="是否成为会员权益">
          <el-radio-group v-model="activityRule.isMemberBenefits">
            <el-radio :label="1">否</el-radio>
            <el-radio :label="2">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员等级" v-if="this.activityRule.isMemberBenefits != 1">
          <el-select v-model="activityRule.memberLevelName" multiple placeholder="请选择会员等级">
            <el-option v-for="(item,index) in memberLevelOptions" :key="index" :label=item.label :value=item.value></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="是否发布消息">
          <el-radio-group v-model="activityRule.isMessage" class="radio-content">
            <el-radio :label="1">不发送</el-radio>
            <el-radio :label="2">发送短信</el-radio>
            <el-radio :label="3">终端/APP推送</el-radio>
            <el-radio :label="4" style="position: absolute;">发送短信与终端/APP推送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息内容">
          <el-input type="textarea" v-model="activityRule.messageInfo"></el-input>
        </el-form-item> -->
      </el-form>
      <!-- 资金规则 -->
      <div v-if="this.ruleType === 2"> 
        <el-table :data="capitalRuleList" border class="table-content plan-table">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column prop="dealType" label="注入方式">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dealType" placeholder="注入方式" disabled>
                <el-option v-for="(item,index) in injectionOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="gameCode" label="游戏名称">
            <template slot-scope="scope">
              <el-select v-model="scope.row.gameCode" placeholder="游戏名称">
                <el-option v-for="(item,index) in gameNameOptions" :key="index" :label="item.label" :value="String(item.value)"></el-option>
              </el-select>
            </template>
          </el-table-column> -->
          <el-table-column prop="injectionAmount" label="注入金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.injectionAmount" placeholder="注入金额" @blur="total"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width='120'>
            <template slot-scope="scope">
              <el-button class="vlt-delete-more" size="mini" @click="deleteData(scope.row,scope.$index)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <!-- <button class="add-content" @click="addContent" :id="'ruleModification-addContent'">
        <i class="el-icon-plus"></i> 新增资金规则
        </button> -->
      </div>
      <!-- 资源规则 -->
      <div v-if="this.ruleType === 3">
        <div class="table-wrap">
          <el-table :data="resourceRule" border class="table">
            <el-table-column type="index" label="序号" fixed width="60px"></el-table-column>
            <el-table-column label="物品名称" min-width="160px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.goodId" filterable placeholder="请选择">
                  <el-option
                    v-for="(item, index) in scope.row.nameOptions"
                    :key="index"
                    @click.native="selectName(index,scope.row)"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="物品型号" min-width="160px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.modelId" filterable placeholder="请选择" :disabled="scope.row.goodsType == 3 || scope.row.goodsType == 4">
                  <el-option
                    v-for="(item, index) in scope.row.modelOptions"
                    :key="index"
                    @click.native="selectModel(index,scope.row)"
                    :label="item.deviceModel"
                    :value="item.modelId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- <el-table-column label="物品序列号" min-width="200px">
              <template slot-scope="scope">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="scope.row.goodsSerialNumber"
                  placeholder="请输入序列号"
                ></el-input>
              </template>
            </el-table-column> -->
            <el-table-column label="数量" min-width="160px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.num" placeholder="请输入数量"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="单价（元）" min-width="80px"></el-table-column>
            <el-table-column prop="amount" label="金额（元）" min-width="80px"></el-table-column>
            <el-table-column label="备注" min-width="200px">
              <template slot-scope="scope">
                <el-input placeholder="请输入备注" v-model="scope.row.remark"></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80px">
              <template slot-scope="scope">
                <!-- <i class="el-icon-delete delete" @click="deleteGoods(scope.$index)"></i> -->
                <el-button size="mini" @click="deleteGoods(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="medium" class="add vlt-add-more" @click="add" icon="el-icon-plus " :id="'ruleModification-add'">新增物品</el-button>
        </div>
      </div>
      <!-- 监控规则 -->
      <el-form
        v-if="this.ruleType === 4"
        style="margin-top:20px;"
        v-model="monitorRule"
        labelWidth="10em"
        ref="baseForm2"
        :rules="rules"
        direction="right"
        class="active-rule">
        <el-form-item label="维度选择">
          <el-checkbox-group v-model="monitorRule.dimensionalityName" class="checkbox-content" @change="checkboxChange">
            <el-checkbox v-for="(item,index) in dimOptions" :label="item.value" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="指标选择">
          <el-checkbox-group v-model="monitorRule.rationName">
            <el-checkbox v-for="(item,index) in indexOptions" :disabled="monitorRule.dimensionalityName.length == 1 && monitorRule.dimensionalityName.join(',') == 5 && (item.value == 2 || item.value == 6)" :label="item.value" :key="index">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      </div>
    </panel>
    <div class="btn-box">
      <el-button :id="'ruleModification-submit'" type="primary" size="medium" @click="submit">提 交</el-button>
      <el-button :id="'ruleModification-cancel'" size="medium" @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import basicInfo from "./common/basicInfo"
export default {
  name: "ruleModification",
  data() {
    return {
      rules:{},
      ruleType: this.$route.query.ruleType,
      // 资金规则表格数据
      capitalRuleList:[],
      // 资源规则表格数据
      resourceRule:[],
      // 兑换规则表格数据
      interestsOptions:[],  //兑换权益选项
      memberLevelOptions: [],  //会员等级
      baseForm:{
      //基础信息
        id: this.$route.query.id,
        ruleTemplateName:'',
        remark:'',
        ruleType:'',
        totalSum:''
      },
      // 活动规则
      activityRule: {
        ruleObject:'1',
        isMemberBenefits:'',
        memberLevel:'',
        memberLevelName:'',
        isMessage:'',
        messageInfo:'',
      },
      exchangeRuleList:[], //兑换规则表格数据
      // 监控规则
      monitorRule:{
        // 维度选择
        dimensionality:'',
        dimensionalityName:[],
        // 指标选择
        rationName:[],
        ration:''
      },
      injectionOptions:[ //资金规则注入方式
        {label:'发行经费注入',value: 1},
        {label:'调节基金注入',value: 2},
        {label:'公益金注入',value: 3},
        {label:'资金注入',value: 4}
      ],
      gameNameOptions:[],
      // 名称  型号
      options: [],
      // 监控规则多选数据
      dimOptions:[{label: "中心", value: "1"}, {label: "省级", value: "2"}, {label: "市级", value: "3"},{label: "厅级", value: "4"},{label: "游戏终端", value: "5"}],
      indexOptions: [{label: "充值总额", value: "2"},{label: "投注总额", value: "3"},{label: "用户数", value: "4"},{label: "投注用户数", value: "5"},{label: "会员权益兑换次数",value: "6"}],
      allResourceData:[],
      list:[]
    };
  },
  components: {basicInfo},
  created(){
    this.getRightsTree();
    this.getModelTree();
    this.getLevelTree();
    let gameParams = {"gameStatus":"1,2,3"};
    this.getGameName(gameParams);
  },
  watch: {
    resourceRule: {
      // 深度监听 监听对象，数组的变化
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          item.amount = item.unitPrice * item.num;
        });
        let params = JSON.parse(JSON.stringify(newValue));
      },
      deep: true
    }
  },
  methods: {
    checkboxChange(val) {
      if (this.monitorRule.dimensionalityName.length == 1 && this.monitorRule.dimensionalityName.join(',') == 5) {
        this.monitorRule.rationName.forEach((item,index) =>{
          if (item == 2 || item == 6) {
            this.monitorRule.rationName.splice(index,1)
          }
        })
      }
    },
     // 获取会员等级
    async getLevelTree() {
      let res = await this.$api.memberLevelProgramLevelTree();
      if (res && res.code == 0) {
        console.log("等级",res)
        let options = res.data.map(item =>{return {label: item.memberLevelStr, value: String(item.levelId)}});
        this.memberLevelOptions = options;
      }
    },
    // 获取会员权益
    async getRightsTree() {
      let res = await this.$api.getRightsTreeOffLine();
      if (res && res.code == 0) {
        let list = res.data
        console.log(list)
        let arr = list.map(item =>{return {"label": item.rightsName,"value": item.rightsId}})
        this.interestsOptions = arr
      }
    },
    //获取所有物品信息
    async getModelTree() {
      const self = this;
      let res = await self.$api.getModelTree();
      if (res && res.code == 0) {
        this.nameOptions = res.data
        self.allResourceData = res.data;
        this.getDetail()
      }
    },
    // 获取游戏名称
    async getGameName(data) {
      let res = await this.$api.getRuleGameName({data});
      if (res && res.code == 0) {
        let list = res.data
        console.log("GG",list)
        let arr = list.map(item =>{return {label: item.gameName, value: item.id}})
        this.gameNameOptions = arr
      }
    },
    //选择物品名称
    selectName(index, row) {
      row.num = 1;
      row.modelId = "";
      // row.goodsSerialNumber = "";
      row.remark = ""
      row.goodName = this.nameOptions[index].goodsName;
      row.goodsType = this.nameOptions[index].goodsType;
      for (let item of this.nameOptions) {
        if (item.goodsType === 1 || item.goodsType === 2) {
          row.modelOptions = this.nameOptions[index].modelInfoVoList;
        } else if (item.goodsType === 3 || item.goodsType === 4) {
          row.unitPrice = this.nameOptions[index].unitPrice;
        } else {
          alert("error");
        }
      }
    },
    //选择物品型号
    selectModel(index, row) {
      // row.goodsSerialNumber = "";
      row.unitPrice = row.modelOptions[index].unitPrice;
    },
    // 删除物品
    deleteGoods(row,index){
      // this.resourceRule.splice(index,1);
      this.$confirm("是否确认删除", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
        this.resourceRule.splice(index,1);
        this.$message({type: 'success', message: '删除成功！'})
      }).catch(() =>{
        this.$message({type: 'warning', message: '已取消删除'})
      })
    },
    //添加物品
    add() {
      let obj = {
        id: "",
        goodName: "",
        goodId:'',
        modelId: "",
        goodCode: "",
        // goodsSerialNumber: "",
        goodsType: "",
        num: "",
        unitPrice: "",
        amount: "",
        remark: "",
        nameOptions:[],
        modelOptions: []
      };
      this.allResourceData.forEach((list)=>{
        let listObj = {};
        listObj.label = list.goodsName
        listObj.value = list.id
        obj.nameOptions.push(listObj)
      })
      this.$set(this.resourceRule, this.resourceRule.length, obj);
    },
    async submit(){

      const self = this;
      let flag = self.$refs["baseForm"].validateForm()
      if (flag === true) {
        if (self.baseForm.ruleType == 1) {
          let data = JSON.parse(JSON.stringify(self.baseForm))
          data.activityRule = JSON.parse(JSON.stringify(self.activityRule))
          let arr = JSON.parse(JSON.stringify(self.activityRule.memberLevelName))
          data.activityRule.memberLevel = arr&&arr.join(',')
          data.activityRule.exchangeRuleList = self.exchangeRuleList
          console.log(data.activityRule.memberLevel)
          delete data.activityRule.memberLevelName
          console.log(data)
          let res = await self.$api.ruleModification({ message:'修改成功', data })
          if (res && res.code == 0) {
            self.$router.push("ruleTemplateSet")
          }
        }
        if (self.baseForm.ruleType == 2) {
          let data = self.baseForm;
          data.capitalRuleList = self.capitalRuleList;
          for (let item of data.capitalRuleList) {
            if (!self.isNum(item.injectionAmount)) {
              self.$message.warning("请输入正确的注入金额");
              return;
            }
          };
          console.log(data)
          let res = await self.$api.ruleModification({ message:'修改成功', data });
          if (res && res.code == 0) {
            self.$router.push("ruleTemplateSet")
          }
        }
        if (self.baseForm.ruleType == 3) {
          let data = self.baseForm;
          let list = self.resourceRule;
          for (let item of list) {
            if (!self.isNum(item.num)) {
              self.$message.warning("请输入正确的数量");
              return;
            }
          }
          let arr = list.map(val =>{
            return {
              "amount": val.amount,
              "goodId": val.goodId,
              // "goodsSerialNumber": val.goodsSerialNumber,
              "goodsType": val.goodsType,
              "modelId": val.modelId,
              "num": val.num,
              "remark": val.remark,
              "unitPrice": val.unitPrice
            }
          })
          data.resourceRuleList = arr
          let res = await self.$api.ruleModification({ message:'修改成功', data })
          if (res && res.code == 0){
            self.$router.push("ruleTemplateSet")
          }
        }
        if (self.baseForm.ruleType == 4) {
          let data = self.baseForm;
          data.monitorRule = JSON.parse(JSON.stringify(self.monitorRule));
          data.monitorRule.dimensionality = self.monitorRule.dimensionalityName&&self.monitorRule.dimensionalityName.join(',');
          data.monitorRule.ration = self.monitorRule.rationName&&self.monitorRule.rationName.join(',');
          delete data.monitorRule.dimensionalityName
          delete data.monitorRule.rationName
          console.log(data)
          let res = await self.$api.ruleModification({ message:'修改成功', data })
          if (res && res.code == 0) {
            self.$router.push("ruleTemplateSet")
          }
        }
      }
    },
    // 获取详情数据
    async getDetail(){
      const self = this;
      const data = self.$route.query.id
      let res = await self.$api.getRuleTemplateDetail({ data })
      console.log(res)
      if (res && res.code == 0) {
        for (let i in self.baseForm) {
          self.baseForm[i] = res.data[i]
        }
        if (self.baseForm.ruleType == 1) {
          for (let el in self.activityRule) {
            self.activityRule[el] = res.data.activityRule[el]
          }
          let list = res.data.activityRule.exchangeRuleList
          let arr = []
          list.forEach((item,index) =>{
            let obj = {}
            obj.integralNum = item.integralNum
            obj.rightsId = item.rightsId
            obj.num = item.num
            obj.remark = item.remark
            arr.push(obj)
            self.$set(self.exchangeRuleList, index, item )
          })
        }
        if (self.baseForm.ruleType == 2) {
          let list = res.data.capitalRuleList
          let arr = []
          list.forEach(item =>{
            let obj = {}
            obj.dealType = item.dealType
            obj.gameCode = item.gameCode
            obj.injectionAmount = item.injectionAmount
            obj.remark = item.remark
            arr.push(obj)
            self.capitalRuleList = arr
          })
        }
        if (self.baseForm.ruleType == 3) {
          let list = res.data.resourceRuleList
          self.resourceRule = []
          list.forEach((item,index)=>{
            let obj ={
              id: "",
              goodName: "",
              modelId: "",
              goodCode: "",
              goodId: '',
              goodsType: "",
              // goodsSerialNumber: "",
              num: "",
              unitPrice: "",
              amount: "",
              remark: "",
              nameOptions: [],
              modelOptions:[]
            }
            obj = Object.assign(obj, item)
            obj.goodId = Number(obj.goodId)
            obj.modelId = Number(obj.modelId)
            // console.log(obj)
            self.allResourceData.forEach((list)=>{
              let listObj = {};
              listObj.label = list.goodsName
              listObj.value = list.id
              obj.nameOptions.push(listObj)
              if (list.id == item.goodId) {
                obj.modelOptions = list.modelInfoVoList
              }
            })
            self.resourceRule.push(obj)
          })
        }
        if(self.baseForm.ruleType == 4) {
          self.monitorRule.dimensionalityName = res.data.monitorRule.dimensionalityName
          self.monitorRule.rationName = res.data.monitorRule.rationName
        }
      }
    },
    // 新增兑换规则
    addRule(){
      let listData = {integralNum: '',rightsId: '',num: '', remark: ''};
      this.exchangeRuleList.push(listData)
    },
    // 删除活动规则操作
    deleteRule(row,index){
      this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.exchangeRuleList.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 计算总金额
    total(){
      let totalSum = 0
      this.capitalRuleList.forEach(item =>{
        totalSum += Number(item.injectionAmount)
      })
      this.baseForm.totalSum = totalSum
    },
    // 新增资金规则
    addContent() {
      let list = {dealType:'',gameCode:'',injectionAmount:'',remark:''}
      this.capitalRuleList.push(list)
    },
    // 删除资金规则
    deleteData(row,index){
      this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.capitalRuleList.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    isNum(val) {
      let reNum = /(^[0-9]*[1-9][0-9]*$)/;
      return reNum.test(val)
    },
    cancel(){this.$router.back()},
    changeForm() {}
  }
};
</script>

<style lang="less" scoped>
.rule-template_modification{
  .content{
    position: relative;
  }
  .radio-content {
    position: relative
  }
  .btn-box{
    margin: 20px 0 80px 60px
  }
  .checkbox-content{
    & :nth-child(5){
      position: absolute;
    }
  }
  .add-content {
		display: block;
    max-width: 600px;
    width: 40%;
    margin: 20px auto 32px;
  }
  .add{
    display: block;
    max-width: 600px;
    width: 40%;
    margin: 20px auto 32px;
  }
  .addRule{
    width: 1000px;
		height: 40px;
		margin: 20px 0 40px 82px;
		background: rgb(243, 239, 239);
		border: 1px dashed #aaa;
		cursor: pointer;
  }
  .table-wrap {
    padding: 10px;
    text-align: center;
  }
  .addGoods {
    width: 100%;
    max-width: 490px;
    margin: 10px 0 30px 20px;
  }
  .delete {
    font-size: 22px;
  }
}
</style>
