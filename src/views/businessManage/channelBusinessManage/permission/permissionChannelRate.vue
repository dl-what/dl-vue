<template>
  <div class="vlt-card">
    <el-tabs v-model="activeName">
      <el-tab-pane label="费率调整" name="1">
        <panel title="费率调整" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <el-form
                label-position="right"
                label-width="110px"
                :model="params"
                ref="params"
                class="device-form"
                :rules="rules"  :disabled="editType">
                  <el-form-item label="申请标题" prop="title" v-if="isValid">
                    <el-input v-model="params.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input> 
                  </el-form-item>
                  <el-form-item label="修改方式" prop="modifyPattern">
                    <el-select v-model="params.modifyPattern" placeholder="请选择修改方式">
                      <el-option label="渠道编号" :value="1"></el-option>
                      <el-option label="渠道区域" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <!-- <el-form-item label="渠道编号"  v-if="params.modifyPattern=='1'" prop="ownChannelNo">
                    <el-select v-model="params.ownChannelNo" filterable placeholder="请选择渠道编号">
                      <el-option 
                        v-for="(item,index) in channelData" 
                        :key="index" 
                        @click.native="selectChannelNo(item)"
                        :label="item.channelNo"
                        :value="item.channelNo"></el-option>
                    </el-select>
                  </el-form-item> -->
                  <el-form-item label="渠道编号" prop="ownChannelNo" v-if="params.modifyPattern=='1'">
                    <el-input @blur="selectChannelNo" v-model="params.ownChannelNo" maxlength="10" show-word-limit placeholder="请输入渠道编号"></el-input>
                  </el-form-item>
                  <el-form-item label="渠道区域" v-if="params.modifyPattern=='2'" prop="ownInsId">
                    <el-cascader
                      v-model="params.ownInsId"
                      :options="areaData"
                      :props="setProps"
                      @change="change"
                      placeholder="请选择渠道区域"
                    ></el-cascader>
                  </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="table-wrap">
            <el-form
              label-position="right"
              label-width="0px"
              :model="form"
              ref="form"
              class="table-form"
              :rules="rules"  :disabled="editType">
              <el-table :data="form.tableData" border class="table">
                <el-table-column  type="index" label="序号" width="55px"></el-table-column>
                <el-table-column  prop="gameName" label="游戏名称" min-width="160px"></el-table-column>
                <el-table-column  prop="oldAgentSellRate" label="旧代销费率（%）" min-width="80px"></el-table-column>
                <el-table-column label="新代销费率（%）" min-width="190px">
                  <template slot-scope="scope">
                    <el-form-item label="" :prop="'tableData.' + scope.$index + '.nowAgentSellRate'" :rules="[{require:false, validator: $rules.unAgentSellRate, title:'代销费率',trigger:'blur'}]">
                      <el-input v-model="form.tableData[scope.$index].nowAgentSellRate" placeholder="请输入小于12的数字最多两位小数">
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column label="生效日期" min-width="160px">
                  <template slot-scope="scope">
                    <el-date-picker type="datetime"
                      class="workTime"
                      v-model="scope.row.workTime"
                      placeholder="请选择生效日期">
                    </el-date-picker>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
        </panel>
        <panel title="其他附件" :show="true" style="margin-bottom:15px" >
          <upload-file v-model="params" v-if="isShow" uploadUrl="uploadChannelFiles"></upload-file>
        </panel>
        <div class="submit-wrap">
          <el-row class="vlt-edit-btn" v-if="!editType">
            <el-button type="primary" size="medium" @click="submit">提交</el-button>
            <el-button type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
            <el-button size="medium" @click="cancel">取消</el-button>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="费率调整流程图" name="2"  v-if="isValid">
        <img :src="diagramImg" alt="">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import ajax from "@/utils/ajax.js"
import uploadFile from "../components/uploadFiles";

export default {
  name: "",
  components: {
    uploadFile
  },
  data() {
    return {
      activeName: "1",
      form: {
        filePath: [],
        tableData: [],
      },
      rules: {
        title: [{ required: true, validator: this.$rules.checkName, title: "申请标题", trigger: ['change','blur'] }],
        modifyPattern: [{ required: true, message: "请选择修改方式", trigger: ["change","blur"] }],
        ownChannelNo: [
          {required: true, validator: this.$rules.checkChannelTenCode, title: "渠道编号", trigger: ["change", "blur"]}
        ],
        ownInsId: [{ required: true, message: "请选择渠道区域", trigger: ["change","blur"] }]
      },
      tableData: [],
      areaData: [],
      channelData: [], // 渠道编号下拉
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: true
      },
      params: {
        // page: 1,
        // pageSize: 20,
        // param: {
          modifyPattern: 1,
          ownChannelNo: null,
          ownInsId: null,
          title: null,
          attachId: null,
        // }
      },
      isValid: false,
      diagramImg: '',
      editType: false,
      actBusinessInsId: null,
      channelId: null,
      isShow: false,
    };
  },
  created() {
    if (this.$route.query.type) {
      this.editType = this.$route.query.type == 1 ? true : false;
    }
    this.getInsData();
    let data = {
      channelType: 1,
    };
    this.getChannelInfoModifyList(data);
    
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get('userInfo').insId;
    // 是否审批流程校验
    this.validProcess();
    if(this.$route.query.id) { // 获取表单数据详情
      let data = this.$route.query.id;
      this.getTaskData(data);
    }else{
      this.isShow = true;
    }
  },
  watch: {
    "params.modifyPattern"(val){
      if(val==1&&this.params.ownChannelNo) {
        this.change()
      }
      if(val==2&&this.params.ownInsId) {
        this.change()
      }
    }
  },
  methods: {
    // 修改方式-渠道编号（公共）
    getChannelByQry(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelByQry({ data });
        if (res && res.code == 0) {
          // this.params.ownChannelNo = val.channelNo;
          // this.actBusinessInsId = val.insId;
          this.channelId = res.data.channelId;
          this.change()
        }
      })(data);
    },
    selectChannelNo() {
      this.actBusinessInsId = this.$storage.get('userInfo').insId;
      if(this.params.ownChannelNo&&this.params.ownChannelNo.length==10&&/^[0-9]*$/.test(this.params.ownChannelNo)){
        let data = {
          insId: this.actBusinessInsId,
          channelNo: this.params.ownChannelNo,
        }
        this.getChannelByQry(data)
      }else{
        this.$message.warning('渠道编号不正确')
      }
    },
    // selectChannelNo(val) {
    //   this.params.ownChannelNo = val.channelNo;
    //   this.actBusinessInsId = val.insId;
    //   this.channelId = val.channelId;
    //   this.change()
    // },
    // 回填初始化
    init(data) {
      console.log('回填数据', data)
      const self = this;
      self.params.ownChannelNo = data.ownChannelNo
      self.params.ownInsId = data.ownInsId
      self.params.modifyPattern = data.modifyPattern
      self.params.title = data.title
      self.params.attachId = data.attachId;
      data.channelGameAgsRateDtoList.forEach((item)=>{
        item.oldAgentSellRate = (item.oldAgentSellRate/100).toFixed(2);
        item.nowAgentSellRate = (item.nowAgentSellRate/100).toFixed(2);
      })
      self.form.tableData = data.channelGameAgsRateDtoList;
      
      this.isShow = true;
    },
     // 表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          self.init(data)
        }
      })(data);
    },
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let router = this.$route.name;
      let data = {
        router,
        actBusinessInsId: this.actBusinessInsId
      };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if(res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.actBusinessInsId}`;
        }
      })(data);
    },
    //渠道区域/渠道编码 获取列表
    async getGameRateList(data) {
      let res = await this.$api.getGameRateList({ data });
      if (res && res.code === 0) {
        res.data&&res.data.forEach((item)=>{
          item.oldAgentSellRate = (item.nowAgentSellRate/100).toFixed(2);
          item.nowAgentSellRate = null;
        })
        this.form.tableData = res.data;
      }
    },
    // 选择下拉框
    change() {
      let data = JSON.parse(JSON.stringify(this.params))
      if(data.modifyPattern == 1) { // 渠道编号
        delete data.ownInsId;
      } else  { // 渠道区域
        data.ownInsId = data.ownInsId[data.ownInsId.length-1]
        this.actBusinessInsId = data.ownInsId;
        delete data.ownChannelNo
      }
      this.getGameRateList(data);
    },
    //获取渠道区域-下拉框
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          this.areaData = res.data;
        }
      })(data);
    },
    //获取渠道列表-下拉框
    getChannelInfoModifyList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelInfoModifyList({ data });
        console.log(res);
        if (res && res.code == 0) {
          this.channelData = res.data;
        }
      })(data);
    },
    // 费率调整
    getCraRateModify(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getCraRateModify({ data });
        if (res && res.code == 0) {
          self.$message.success('提交成功')
          self.$router.back();
        }
      })(data);
    },
    // 保存
    save() {
      const self = this;
      if(!self.params.title) {
        this.$message.warning('申请标题不能为空');
        return
      }
      let array = []
      self.form.tableData.forEach((item)=>{
        item.oldAgentSellRate = item.oldAgentSellRate&&Number(item.oldAgentSellRate).toFixed(2)*100;
        item.nowAgentSellRate = item.nowAgentSellRate&&Number(item.nowAgentSellRate).toFixed(2)*100;
        item.workTime = item.workTime?new Date(item.workTime).getTime("YYYY-MM-DD HH:mm:ss"):null;
        // item.workTime = item.workTime?new Date(item.workTime).getTime():null;
        array.push(item)
      })

      // 走流程回填的参数
      let validData = {
        modifyPattern: self.params.modifyPattern,
        ownChannelNo: self.params.ownChannelNo,
        ownInsId: self.params.ownInsId,
        title: self.params.title,
        attachId: self.params.attachId,
        channelGameAgsRateDtoList: array
      }
      let params = {
        router: self.$route.name,
        title: self.params.title,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(validData),
        actBusinessInsId: this.actBusinessInsId,
        channelId: this.channelId
      };

      if(!self.$route.query.id) { // 新建 不需要带上
        delete params.id;
      }
      console.log('暂存的参数', params)
      self.saveDraft(params)
    },
     // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("保存成功");
          self.$router.back();
        }
      })(data);
    },
    // 提交
    submit() {
      const self = this;
      // let isEmpty = false;
      // if(self.params.modifyPattern==2) {
      //   self.tableData.forEach((item)=>{
      //     if(!item.workTime) {
      //       isEmpty = true;
      //     }
      //   })
      // };
      // if(isEmpty) {
      //   this.$message.warning('生效时间不能为空')
      //   return;
      // }
      let checkParams;
      self.$refs.params.validate((valide)=>{
        checkParams =  valide
      })
      let checkForm;
      self.$refs.form.validate((valide)=>{
        checkForm =  valide
      })

      if(checkParams&&checkForm) {
        let array = []
        let tableData = JSON.parse(JSON.stringify(self.form.tableData))
        tableData.forEach((item)=>{
          item.oldAgentSellRate = item.oldAgentSellRate&&Number(item.oldAgentSellRate).toFixed(2)*100;
          item.nowAgentSellRate = item.nowAgentSellRate&&Number(item.nowAgentSellRate).toFixed(2)*100;
          item.workTime = item.workTime?self.$moment(item.workTime).format("YYYY-MM-DD HH:mm:ss"):null;
        // item.workTime = item.workTime?new Date(item.workTime).getTime():null;
          array.push(item)
        })

        let data = {
          modifyPattern: self.params.modifyPattern,
          attachId: self.params.attachId != '' ? self.params.attachId : null,
          ownChannelNo: self.params.ownChannelNo,
          channelGameAgsRateDtoList: array
        };
        
        // 走流程回填的参数
        let validData = {
          modifyPattern: self.params.modifyPattern,
          ownChannelNo: self.params.ownChannelNo,
          ownInsId: self.params.ownInsId,
          title: self.params.title,
          attachId: self.params.attachId,
          channelGameAgsRateDtoList: array
        }

        if(self.params.modifyPattern==1) { // 选择渠道编号
          delete validData.ownInsId
          delete data.ownInsId;
        }else{
          validData.ownInsId = self.params.ownInsId[self.params.ownInsId.length - 1],
          data.ownInsId = self.params.ownInsId[self.params.ownInsId.length - 1],
          delete data.ownChannelNo;
          delete validData.ownChannelNo;
        }
        if(self.isValid) { // 走流程de参数
          let str = JSON.stringify(validData)
          data.actBusiness = {
            router: self.$route.name,
            title: self.params.title,
            id: self.$route.query.id, // 从我的申请-编辑 需要带上id
            data: str,
            actBusinessInsId: this.actBusinessInsId,
            channelId: this.channelId
          };
          if(!self.$route.query.id) { // 直接提交 不需要带上
            delete data.actBusiness.id;
          }
        }else { // 不走流程 不用申请标题

        }
        
        console.log('提交的参数', data)
        self.getCraRateModify(data)
      }else{
        this.$message.warning('校验不通过')
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    changeSwitchBet(val) {
      // console.log(val);
    },
    changeSwitchCash(val) {},
    handleRemove() {}
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
.submit-wrap {
  text-align: right;
  padding: 10px 0;
}
.vlt-card {
  margin-bottom: 10px;
}
.table {
  width: 100%;
}
.soft-form{
  margin-top: 15px;
}
.table-wrap{
  padding: 0 16px 16px;
}
.table-form{
  .el-form-item{
    margin: 0;
  }
}

</style>
