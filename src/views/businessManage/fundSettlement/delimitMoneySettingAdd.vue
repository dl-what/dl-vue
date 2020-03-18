<template>
  <div class="vlt-card">
    <panel :show="true" title="新增基金划拔">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-width="80px"
            class="demo-ruleForm">
            <el-form-item label="游戏编码" prop="gameCode">
              <el-input
                type="text"
                disabled
                placeholder="自动获取"
                v-model="gameCode"
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="选择游戏" prop="gameId">
              <el-select
                placeholder="请选择游戏"
                v-model="form.gameId"
                style="width:100%;"
              >
                <el-option
                  :label="item.gameName"
                  :value="item.id"
                  :key="index"
                  @click.native="changeGame(item)"
                  v-for="(item,index) in gameData"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="table-wrap">
            <el-table
              border
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%">
              <el-table-column label="序号" type="index" fixed width="80px"></el-table-column>
              <el-table-column prop="jackpotId" label="奖池ID" min-width="120px"></el-table-column>
              <el-table-column prop="fundTypeName" label="基金类型" min-width="120px"></el-table-column>
              <el-table-column prop="jackpotAmount" label="奖池金额(元)" min-width="120px"></el-table-column>
              <el-table-column fixed="right" label="操作" min-width="120px">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="capital(scope.row, 0)"
                    :id="$route.name+'-'+'edit'+scope.$index"
                  >转入</el-button>
                  <el-button
                    size="mini"
                    @click="capital(scope.row, 1)"
                  >划出</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- <el-row class="submit-wrap">
            <el-button type="primary" size="medium" @click="submit">提交</el-button>
            <el-button size="medium" @click="cancel">取消</el-button>
          </el-row> -->
        </div>
      </div>
    </panel>
    <el-dialog
      title="划拨基金"
      :visible.sync="isShow"
      width="50%"
      :close-on-click-modal="false"
      class="dialog-delimit">
      <div class="vlt-edit-single center">
        <div class="vlt-edit-wrap">
          <el-form label-position="right" 
            label-width="90px" 
            :model="form"
            :rules="rules"
            ref="dialogForm"
            class="baseInfo">
            <el-form-item :label="`${title}金额`" prop="transferAmount">
              <el-input v-model="form.transferAmount" :placeholder="`请填写${title}金额`" maxlength="10" show-word-limit></el-input> 
            </el-form-item>
            <el-form-item :label="`${title}原因`" prop="transferReason">
              <el-input v-model="form.transferReason" type="textarea" :autosize="{ minRows: 3, maxRows: 5}" :placeholder="`请输入${title}原因`" maxlength="150"></el-input> 
            </el-form-item>
            <div class="dialog-footer">
              <el-button size="medium" @click="isShow=false">取 消</el-button>
              <el-button type="primary" class="sure" size="medium" @click="submit">确 定</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      title: '转入',
      rules: {
        gameId: [
          {required: true, message: "请选择游戏", trigger: ["change", "blur"]}
        ],
        transferAmount: [
          {required: true, validator: this.$rules.donationAmount, title: '', trigger: ["change", "blur"]}
        ],
        transferReason: [
          {required: true,  message: "",trigger: ["change", "blur"]}
        ],
      },
      gameData: [],
      form: {
        fundType: null,
        gameId: null,
        insId: null,
        jackpotAmount: null,
        jackpotId: null,
        transferAmount: null,
        transferReason: null,
        type: null,
      },
      tableData: [],
      isShow: false,
      gameCode: null,
    };
  },
  created() {
    this.form.insId = this.$storage.get("userInfo").insId;
    this.getAllGameList();
  },
  methods: {
    // 选择游戏
    changeGame(val) {
      this.gameCode = val.gameCode;
      let data = val.id;
      this.fundTransfer(data)
    },
    // 调拨基金
    fundTransfer(data) {
      const self = this;
      (async (data) => {
        let res = await this.$api.fundTransfer({ data });
        if (res && res.code === 0) {
          res.data.forEach((item)=>{
            if(item.jackpotId=='0') {
              item.fundTypeName = '调节基金'
            }else if(item.jackpotId=='-1') {
              item.fundTypeName = '固定奖池'
            }else{
              item.fundTypeName = '累计奖奖池'
            }
            item.jackpotAmount = self.$common.thousandMark(item.jackpotAmount);
          })
          self.tableData = res.data;
        }
      })(data);
    },
    // 游戏下拉列表
    getAllGameList() {
      (async () => {
        let data = {
          gameStatus: "1,2,3"
        };
        let res = await this.$api.getAllGameList({ data });
        console.log(res, "所有游戏列表");
        if (res && res.code === 0) {
          this.gameData = res.data;
        }
      })();
    },
    // 新增基金调拨
    fundTransferCreate(data) {
      const self = this;
      (async data => {
        let res = await self.$api.fundTransferCreate({ data });
        if (res && res.code === 0) {
          self.$message.success('提交成功')
          self.$router.push({ name: "DelimitMoneySetting" });
        }
      })(data);
    },
    capital(val, type) {
      const self = this;
      self.isShow = true;
      this.$refs.dialogForm&&this.$refs.dialogForm.resetFields();
      self.title = type==0?'转入':'划出';
      self.rules.transferAmount[0].title = `${this.title}金额`;
      self.rules.transferReason[0].message = `${this.title}原因不能为空`;
      self.form.fundType = 2
      if(val.jackpotId==0) {
        self.form.fundType = 0
      }
      if(val.jackpotId==-1) {
        self.form.fundType = 1
      }
      self.form.type = type;
      self.form.jackpotAmount = val.jackpotAmount;
      self.form.jackpotId = val.jackpotId;
    },
    submit() {
      const self = this;
      self.$refs.dialogForm.validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(self.form));
          data.jackpotAmount = data.jackpotAmount.replace(/,/g, '');
          data.jackpotAmount = self.$common.accMul(Number(data.jackpotAmount), 100);
          data.transferAmount = self.$common.accMul(data.transferAmount, 100);
          self.fundTransferCreate(data)
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.btns {
  margin-left: 0px;
}
.single .title {
  padding: 10;
  font-weight: 0 !important;
}
.row-bg {
  margin: 10px 0;
}
.delimit {
  margin-top: 20px;
}
.submit-wrap{
  text-align: right;
  padding: 30px 0 10px;
}
.center{
  margin: auto;
  width: 520px;
  .vlt-edit-wrap{
    padding: 10px 16px 0;
  }
}
.dialog-footer{
  text-align: right;
  padding: 20px 0 10px;
}
</style>
<style lang="less">
.dialog-delimit .el-dialog{
  max-width: 600px;
  min-width: 550px;
}
</style>
