<template>
  <div class="vlt-card betting-new-card">
    <panel :show="true" title="新建卡片">
      <div class="vlt-edit-single">
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
            <el-button id="newCard-submit" type="primary" v-prevent="1000" size="medium" @click="submit('baseForm')" :loading="showLoading" >确 定</el-button>
            <el-button id="newCard-cancel" size="medium" @click="close">取 消</el-button>
          </el-row>
        </div>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";
export default {
  name: "newCard",
   data() {
    let checkCardNum = (rule, value, callback) => {
      
      if (value > 1000000) {
        callback(new Error('发卡数量不能大于100万张'));
      } else {
        callback();
      }
    };
    return {
      showLoading: false,
      show: this.showForm,
      params: {
        batch: "",
        bettingCardId: 0,
        bettingCardType: 0,
        cardMakingQuantity: 0,
        createBy: "",
        createTime: "",
        insId: 0,
        insName: "",
        remark: "",
        status: 0,
        updateBy: "",
        updateTime: ""
      },
      formDatas: [
        {
          type: "cascader",
          prop: "insId",
          value: "",
          title: "所属机构",
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          },
          options: []
        },
        {
          type: "select",
          title: "投注卡类型",
          prop: "bettingCardType",
          options: [
            { label: "投注卡", value: 0 },
            { label: "会员卡", value: 1 },
            { label: "试玩卡", value: 2 }
          ]
        },
        { type: "input", title: "发卡数量", prop: "cardMakingQuantity", value: "" },
        { type: "textarea", title: "备注", prop: "remark", maxlength: 200}
      ],
      rule: {
        insId: [{ required: true, message: "请选择所属机构", trigger: ['change','blur'] }],
        bettingCardType: [{ required: true, message: "请选择投注卡类型", trigger: ['change', 'blur'] }],
        cardMakingQuantity: [
          { required: true, validator:this.$rules.numberCheck, title: "发卡数量", trigger: ["change", "blur"] },
        { validator: checkCardNum,  trigger: ["change", "blur"] } ]
      },
      cascaderOptions: [],
      cardTypeArr: ['投注卡','会员卡','试玩卡'],
      cardType: null,
    };
  },
  created() {
    this.getInsData();
  },
  methods: {
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        console.log(res);
        if (res && res.code == 0) {
          if (res.data != null && res.data.length) {
            let insList = res.data[0].id == 1 ? res.data[0].children : res.data;

            insList&&insList.forEach(element => {
              element.children&&element.children.forEach(item => {
                item.children && item.children.forEach(i => {
                  delete i.children
                }) 
              })
            });
            self.$set(self.formDatas[0], "options", insList);
            self.cascaderOptions = res.data;
          }

          // console.log("获取机构数据", self.cascaderOptions, res.data);

          // let arr = self.getInsArray(self.insId,'id', res.data, 'id') // 传入id 和对象
          // console.log('arrs', arr.reverse());
          // self.insArray.push(arr);
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    changeForm(val) {
      Object.assign(this.params, val);
    },
    handleClose() {
      console.log("close");
    },
    close() {
      this.$router.back();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid === 'true') {
          (async ()=> {
            const _this = this;
            _this.showLoading = true;
            _this.params.cardMakingQuantity = _this.params.cardMakingQuantity != '' ? _this.params.cardMakingQuantity : 0;
            _this.cardType = _this.cardTypeArr[_this.params.bettingCardType];
            console.log(_this.params);
            let data = _this.params;
            // console.log("提交的数据", data);
            // data.status = data.status ? 1 : 2;
            let result = await _this.$api.createCardGeneration({
              timeout: 600000,
              loadingText: `正在生成${_this.cardType}，请耐心等待！`,
              data,
            });
            console.log("ressss", result);
            if (result.code == 0) {
              _this.$message({
                message: result.msg,
                type: "success"
              });
              setTimeout(() => {
                _this.$router.back();
              }, 1000);
            }
            _this.showLoading = false;
          })()
        }
      })
    },
    onSubmit() {
      console.log("formData", this.params);
      this.close();
    },
       async exportExcel(row) {
      this.outData = {
        page: 0,
        pageSize: 0,
        param: {
          all: true,
          batch: "",
          bettingCardId: row.bettingCardId
        }
      };
      const data = JSON.parse(JSON.stringify(this.outData));
      let result = await this.$api.bettingCardExportExcel({
        data,
        responseType: "blob"
      });
      var blob = new Blob([result.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "投注卡生成信息.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      //console.log("res", result);
    },
  }
};
</script>

<style lang="less">
.betting-new-card {
  .vlt-edit-single .vlt-edit-btn{
    margin-left: 140px;
  }
}
.gb-loading .el-loading-spinner {
  width: 200px;
}
// .betting-new-card {
//   .el-form-item {
//     &:nth-of-type(7),
//     &:nth-of-type(8) {
//       display: inline-block;
//       width: 200px;
//     }
//     &:nth-of-type(8) {
//       margin-left: 40px;
//     }
//   }
//   .el-input.cycle {
//     width: 50% !important;
//   }
//   .el-select.cycle-selection {
//     width: 40% !important;
//   }
// }
</style>

