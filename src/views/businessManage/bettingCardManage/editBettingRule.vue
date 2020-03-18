<template>
  <!-- 新增规则 -->
  <el-dialog
    :visible.sync="show"
    width="50%"
    title=""
    :before-close="close"
    class="dialog-form-list"
  >
    <div class="vlt-card-edit">
      <!-- <h2 class="title">新增规则</h2> -->
      <div class="vlt-edit-wrap">
        <el-form label-position="right" label-width="90px" :model="formDatas" :rules="rules2" ref="forms">
          <el-form-item label="所属机构" prop="insId">
            <el-cascader
              v-model="formDatas.insId"
              :options="formDatas.insOptions.options"
              :props="formDatas.insOptions.setProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所选渠道" prop="channelId">
            <el-select v-model="formDatas.channelId" placeholder="请选择所选渠道">
              <el-option v-for="item in formDatas.channelSelect.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="circle" label="周期">
            <el-input v-model="formDatas.circle"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formDatas.circleUnit">
              <el-option label= "天" value= "day" ></el-option>
              <el-option label= "周" value= "week" ></el-option>
              <el-option label= "月" value= "month" ></el-option>
              <el-option label= "年" value= "year" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="笔数" prop="limitPenNum">
            <el-input v-model="formDatas.limitPenNum"></el-input>
          </el-form-item>
          <el-form-item label="限额" prop="limitAmount">
            <el-input v-model="formDatas.limitAmount"></el-input>
          </el-form-item>
          <el-form-item label="限制次数" prop="limitNum">
            <el-input v-model="formDatas.limitNum"></el-input>
          </el-form-item>
        </el-form>
        <el-row class="vlt-edit-btn" style="text-align: right">
          <el-button
            type="primary"
            v-prevent="1000"
            size="medium"
            @click="onSubmit('forms')"
            :loading="showLoading"
          >提 交</el-button>
          <el-button size="medium" @click="close">取 消</el-button>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/javascript">
import rules from "@/utils/rules.js";

export default {
  name: "editBettingRule",
  props: {
    oData: {
      type: Object,
      default: 0
    },
    insDatas: {
      type: Array
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showLoading: false,
      params: {},
      formDatas: {
        insId: '',
        insOptions: {
          options: [],
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        channelId: '',
        channelSelect: {
          options: []
        },
        circle: '',
        circleUnit: 'day',
        limitPenNum: '',
        limitAmount: '',
        limitNum: '',
      },
      rules2: {
        insId: [
          { required: true, validator: rules.checkEmpty, trigger: ['change','blur'] }
        ],
        circle: [
          { required: false, validator: rules.numberVal2, trigger: ['change','blur'] }
        ],
        limitPenNum: [
          { required: false, validator: rules.numberVal2, trigger: ['change','blur'] }
        ],
        limitAmount: [
          { required: false, validator: rules.numberVal2, trigger: ['change','blur'] }
        ],
        limitNum: [
          { required: false, validator: rules.numberVal2, trigger: ['change','blur'] }
        ]
      },
      show: this.isShow,
      insList: this.insDatas,
    };
  },
  watch: {
    isShow(value) {
      console.log('insDatas', this.insList);
      this.show = value;
      this.backfill(this.oData);
      this.backFillIns(this.oData.insId, this.insList);
    },
    oData: {
      handler(newValue, oldValue) {
        console.log("这是改变的数据", newValue);
        this.getCurrentChannels(newValue.insId, newValue.channelId);
        this.backfill(newValue);
      }
    },
    insDatas: {
      handler(newVal, oldValue) {
        this.insList = newVal;
        this.backFillIns(this.oData.insId, this.insList);
      },
      deep: true
    },
    formDatas: {
      handler(newVal, oldVal) {
        Object.assign(this.params, newVal);
        // console.log(this.params, newVal.channelId);
      },
      deep: true
    }
  },
  components: {},
  created () {
    console.log('过来的值为', this.insList);
  },
  methods: {
    handleChange (val) { // 根据机构的选择 变化显示渠道的的下拉选择
      console.log(val);
      if (val && Array.isArray(val)) {
        let insId = val[val.length - 1];
        this.getCurrentChannels(insId); 
      }
    },
    backfill(newValue) {
      let arr = Object.keys(newValue);
      let aForm = this.formDatas;
      // console.log('回填需要的数据',newValue, aForm, this.oData.id);
      this.params.id =  this.oData.id;
      this.params = {
        ...newValue
      }
      Object.assign(aForm, newValue);
    },
    backFillIns (data, list) {
      // console.log(data, list);
      this.$set(this.formDatas.insOptions, 'options', list);
    },
    submit(baseForm) {
      const _this = this;
      this.showLoading = true;
      _this.params.insId = Array.isArray(_this.params.insId) ?  _this.params.insId[_this.params.insId.length - 1] : _this.params.insId
      let data = _this.params;
      console.log("发送的数据", data, this.formDatas.channelId);
      this.$refs[baseForm].validate((valid) => {
        if (valid) {
          (async data => {
            let result = await _this.$api.updateBettingRules({ data });
            console.log("result", result);
            if (result.code == 0) {
              _this.showLoading = false;
              _this.$message({
                message: result.msg,
                type: "success"
              });
              setTimeout(() => {
                _this.close();
              }, 1000);
            }
          })(data)
        } else {
          _this.showLoading = false;
          console.log('false'); 
        }
      })
    },
    // 获取所选渠道
    getCurrentChannels(id, channelId) {
      let self = this;
      (async id => {
        let res = await self.$api.getCurrentChannels({ data: id });
        if (res && res.code == 0) {
          // console.log("res------", res.data);
          if (res.data.length) {
            let channelList = res.data;
            let options = [];
            channelList && channelList.forEach(item => {
              options.push({
                label: item.channelAddress,
                value: item.channelId
              });
            });
            self.$set(self.formDatas.channelSelect, "options", options);
            if (channelId) {
              self.formDatas.channelId = Number(channelId);
            } else {
              self.formDatas.channelId = options[0].value;
            }
          }else {
            self.$set(self.formDatas.channelSelect, "options", []);
            self.formDatas.channelId = '';
          }
        } else {
          // self.$message.warning(res.msg)
        }
      })(id);
    },
    getInsArray(id, key, data, keyBack) {  // 返回完整数组 // 传入id和key是对应  keyBack是返回想要的key
      const self = this;
      for (var i in data) {
        if (data[i][key] == id) {
          return [data[i][keyBack]];
        }
        if (data[i].children) {
          let ro = self.getInsArray(id, key, data[i].children, keyBack);
          if (ro !== undefined) {
            return ro.concat(data[i][keyBack]);
          }
        }
      }
    },
    close() {
      this.$refs.forms.resetFields();
      // setTimeout(() => {
        this.$emit("closeDia");
      // }, 3000);
    },
    onSubmit(baseform) {
      this.submit(baseform);
    }
  }
};
</script>

<style lang="less">
.dialog-form-list {
  .el-select {
    width: 100%;
  }

  .el-form-item {
    .el-cascader {
      width: 100%;
      .el-input {
        width: 100%;
        .el-input__inner {
          width: 100%;
          height: 40px;
          line-height: 40px;
        }
      }
    }
    &:nth-of-type(3),
    &:nth-of-type(4) {
      display: inline-block;
      // width: 200px;
      // .el-input {
      //   width: 100%;
      // }
    }
    &:nth-of-type(3) {
      width: 70%;
    }
    &:nth-of-type(4) {
      width: 30%;
      .el-form-item__content {
        margin-left: 40px !important;
      }
    }
  }
}
</style>
