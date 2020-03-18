<template>
  <div class="search-bar-comp">
    <el-collapse-transition>
      <div v-show="show">
        <el-form :inline="true" :model="form" :label-width="labelWidth">
          <span v-for="(formItem, itemIndex) in _options" :key="itemIndex" class="form-item-line">
            <el-form-item :label="formItem.title" v-if="formItem.type === 'input'">
              <el-input
                size="small"
                v-model.trim="form[formItem.prop]"
                :placeholder="`请输入${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                :maxlength="formItem.maxlength||50"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-input>
              <el-button
                class="device-btn"
                v-if="formItem.bindDevice"
                size="small"
                @click="deviceHandler(formItem)"
              >{{formItem.bindDevice.label || '设备读取'}}</el-button>
            </el-form-item>
            <el-form-item
              :label="formItem.title"
              v-show="formItem.show==false?formItem.show:true"
              v-if="formItem.type === 'select'"
            >
              <el-select
                filterable
                clearable
                size="small"
                v-model="form[formItem.prop]"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                :remote-method="typeof formItem.remoteMethod === 'function' ? formItem.remoteMethod : null"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              >
                <el-option
                  :label="optionItem[(formItem.setProps && formItem.setProps.label) || 'label']"
                  :value="optionItem[(formItem.setProps && formItem.setProps.key) || 'value']"
                  v-for="(optionItem, optionIndex) in formItem.options"
                  :key="optionIndex"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="formItem.title" v-if="formItem.type === 'minMax'" class="min-max">
              <el-input
                size="small"
                v-model.trim="form[formItem.options[0]]"
                type="text"
                v-enterTxt
                placeholder="输入最小值"
                maxlength="10"
              ></el-input>
              <span v-if="formItem.type=='minMax'" class="siding-flag">—</span>
              <el-input
                size="small"
                v-enterTxt
                v-model.trim="form[formItem.options[1]]"
                type="text"
                placeholder="输入最大值"
                maxlength="10"
              ></el-input>
            </el-form-item>

            <el-form-item :label="formItem.title" v-if="formItem.type === 'datepicker'">
              <el-date-picker
                size="small"
                v-model="form[formItem.prop]"
                type="date"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'datepicker-range'">
              <el-date-picker
                size="small"
                v-model="form[formItem.prop]"
                type="daterange"
                :picker-options="formItem.pickerOptions || null"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'datetime'">
              <el-date-picker
                size="small"
                v-model="form[formItem.prop]"
                type="datetime"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'datetime-range'">
              <el-date-picker
                size="small"
                v-model="form[formItem.prop]"
                type="datetimerange"
                :picker-options="formItem.pickerOptions || null"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'year'">
              <el-date-picker
                size="small"
                v-model="form[formItem.prop]"
                type="year"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'month'">
              <el-date-picker
                size="small"
                v-model="form[formItem.prop]"
                type="month"
                :picker-options="formItem.pickerOptions || null"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="formItem.title" v-if="formItem.type === 'cascader'">
              <el-cascader
                size="small"
                v-model="form[formItem.prop]"
                :value="formItem.value"
                :props="formItem.setProps"
                :options="formItem.options"
                :placeholder="`请选择${formItem.title}`"
                :disabled="disabled || formItem.disabled || false"
                @change="(val) => {typeof formItem.change === 'function' && formItem.change(val)}"
              ></el-cascader>
            </el-form-item>
          </span>
          <el-form-item class="btn-wrap">
            <el-button size="small" type="primary" v-prevent="2000" @click="onSubmit" icon="el-icon-search" :disabled="disabled || false">查询</el-button>
            <el-button size="small" @click="reset" :disabled="disabled || false">重置</el-button>
            <slot name="extend-btns"></slot>
            <el-button size="small" type="text" @click="onDrop" v-if="options.length > 2" :disabled="disabled || false">
              {{collapse ? '展开' : '收起'}}
              <i
                :class="[collapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"
              ></i>
            </el-button>
          </el-form-item>
        </el-form>
        <!--拓展插槽-->
        <slot name="extend-bar"></slot>
        <p class="tips-item" v-if="isResult" :class="{'mr80': showHandler}">
          <i class="el-alert__icon el-icon-info"></i>
          <span>
            共搜索到
            <em>{{total}}</em>条数据
          </span>
        </p>
      </div>
    </el-collapse-transition>
    <!--投注卡密码验证-->
    <idc-validation :showValidation.sync="showValidation"></idc-validation>
    <p class="handler" :class="{onTop: !show}" v-if="showHandler">
      <el-button
        size="mini"
        id="searchBar-handler"
        @click="show = !show"
        type="text"
        plain
        :icon="!show ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
      >{{show ? '收起' : '展开'}}搜索</el-button>
    </p>
  </div>
</template>

<script>

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}

export default {
  name: "searchBar",
  props: {
    disabled: {
      default: false
    },
    showHandler: {
      default: false
    },
    // 配置参数
    options: {
      default() {
        return [
          //   {
          //     title: '表单名称', // 表单名
          //     prop: 'name', // 表单字段
          //     type: 'input', // 表单类型
          //     value: '', // 表单字段值
          //     options: [{ // select类型表单选项
          //       value: '', // 字段值
          //       label: '' // 字段名
          //     },
          //   ]
          // }
        ];
      }
    },
    // 标签宽度
    labelWidth: {
      default: "70px"
    },
    // 搜索结果条数
    total: {
      default: 0
    }
  },
  data() {
    return {
      show: true,
      form: {},
      _options: [],
      collapse: true,
      showValidation: false,
      isResult: false,
    };
  },
  watch: {
    form: {
      handler(newVal, oldVal) {
        this.$emit("change", newVal, oldVal);
      },
      deep: true
    }
  },
  created() {
    // 初始化
    this._options = this.options.slice(0, 2);
    this.options.forEach(item => {
      this.$set(this.form, item.prop, item.value);
    });
  },
  mounted() {
    this.options.forEach(item => {
      this.$set(this.form, item.prop, item.value);
      if (item.bindDevice) {
        item.socket = new WebSocket(item.bindDevice.socketUrl);
        item.socket.onopen = () => {
          console.log(item.bindDevice.type + "-websocket已打开");
        };
        item.socket.onmessage = e => {
          const data = JSON.parse(e.data);
          console.log("client：接收到服务端的消息: ", data);
          if (data && data.params && data.params.code) {
            this.form[item.prop] = data.params.code;
            switch (item.bindDevice.type) {
              case "IDC":
                if (!item.bindDevice.disValid) {
                  this.eventBus.$emit("idc_input_complete", data.params.code);
                }
                item.socket.send(
                  JSON.stringify({
                    jsonrpc: "2.0",
                    method: "readcard_read_stop",
                    id: 2
                  })
                );
                break;
              case "SCAN":
                this.eventBus.$emit("scan_input_complete", data.params.code);
                item.socket.send(
                  JSON.stringify({
                    jsonrpc: "2.0",
                    method: "barcode_scan_stop",
                    id: 2
                  })
                );
                break;
            }
          }
        };
        item.socket.onclose = () => {
          console.log(item.bindDevice.type + "-websocket已关闭");
        };
      }
    });
  },
  destroyed() {
    this.options.forEach(item => {
      if (item.bindDevice) {
        if (item.socket) {
          // 关闭websocket
          item.socket.close();
        }
      }
    });
  },
  methods: {
    onSubmit() {
      let formData = {};
      for (let key in this.form) {
        if (this.form[key] !== "") formData[key] = this.form[key];
      }
      // 校验特殊字符
      let title = '';
      if (this._options.some(item => {
        title = item.title;
        if (!item.unCheck) {
          return this.$rules.special(formData[item.prop])
        }
        return false;
      })) {
        this.$message.error(`${title}不能包含特殊字符`);
        return;
      }
      this.isResult = true;
      this.$emit("search", formData);
    },
    onDrop() {
      this.collapse = !this.collapse;
      if (!this.collapse) {
        this._options = this.options;
      } else {
        this._options = this.options.slice(0, 2);
      }
    },
    reset() {
      for (let key in this.form) {
        this.form[key] = "";
      }
      this.$emit("searchReset");
    },
    // 表单数据设备读取
    deviceHandler(formItem) {
      switch (formItem.bindDevice.type) {
        // id读卡器
        case "IDC":
          // 开始读卡
          formItem.socket.send(
            JSON.stringify({
              jsonrpc: "2.0",
              method: "readcard_read_start",
              params: { interval: 1000 },
              id: 2
            })
          );

          break;
        // 扫码器
        case "SCAN":
          // 开始扫码
          formItem.socket.send(
            JSON.stringify({
              jsonrpc: "2.0",
              method: "barcode_scan_start",
              params: { interval: 1000 },
              id: 2
            })
          );

          break;
        // 密码键盘
        case "NKB":
          break;
      }
    }
  },
  directives: {
    enterTxt:{
      inserted(el, binding){
        const input = el.getElementsByTagName('input')[0]
        input.onkeyup = function (e) {
          if (input.value.length === 1) {
            input.value = input.value.replace(/[^A-Za-z0-9-_\u4e00-\u9fa5]/g, '')
          } else {
            input.value = input.value.replace(/[^A-Za-z0-9-_\u4e00-\u9fa5]/g, '')
          }
          trigger(input, 'input')
        }
        input.onblur = function (e) {
          if (input.value.length === 1) {
            input.value = input.value.replace(/[^A-Za-z0-9-_\u4e00-\u9fa5]/g, '')
          } else {
            input.value = input.value.replace(/[^A-Za-z0-9-_\u4e00-\u9fa5]/g, '')
          }
          trigger(input, 'input')
        }
      }
    }
  },
}
</script>

<style lang="less">
.search-bar-comp {
  padding: 15px 0 10px;
  .handler {
    padding-top: 5px;
    text-align: right;
    font-size: 12px;
    margin-top: -33px;
    color: #999;
    margin-bottom: 10px;
    &.onTop {
      padding-top: 0;
      margin-top: -15px;
      margin-bottom: 0;
    }
    .el-button {
      margin-right: 0;
      padding: 5px 7px;
      height: 18px;
      color: #409eff;
      background: transparent;
      border-color: transparent;
      span {
        margin-left: 0;
      }
    }
  }
  .el-form {
    background-color: #fff;
    .el-button--text:hover {
      background-color: transparent;
      color: #57a3f3;
      border-color: transparent;
    }
    .el-button--text:focus {
      background-color: transparent;
      color: #57a3f3;
      border-color: transparent;
    }
  }
  .btn-wrap {
    padding-left: 30px;
    margin-bottom: 10px;
  }
  .el-button {
    margin: 0 8px 0 0;
  }
  .tips-item {
    height: 34px;
    line-height: 34px;
    background-color: #f0faff;
    border: 1px solid #abdcff;
    font-size: 12px;
    color: #515a6e;
    border-radius: 4px;
    padding: 0 10px;
    margin: 10px 0 0;
    display: flex;
    align-items: center;
    &.mr80 {
      margin-right: 80px;
    }
    em {
      color: #2d8cf0;
      font-style: normal;
      padding: 0 3px;
    }
    i {
      vertical-align: middle;
      color: #2d8cf0;
      margin-right: 5px;
    }
  }
  .form-item-line {
    display: inline-block;
    vertical-align: top;
    .el-form-item {
      margin-bottom: 10px;
      position: relative;
      .device-btn {
        position: absolute;
        right: 1px;
        top: 2px;
        bottom: 11px;
        border: none;
        box-sizing: border-box;
        margin-right: 0;
        border-left: 1px solid #dcdfe6;
        border-radius: 0 5px 5px 0;
        padding: 0 7px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        min-width: 4em;
      }
    }
    * {
      font-size: 12px;
    }
  }
  .el-input__inner {
    width: 240px;
  }
  .el-input {
    width: auto;
  }
  .el-form-item__label,
  .el-form-item__content {
    line-height: 32px;
  }
  .min-max {
    .siding-flag {
      margin: 0 5px;
    }
    input {
      width: 108px;
    }
    .el-input {
      width: 108px;
    }
  }
}
</style>
