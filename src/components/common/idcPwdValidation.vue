<template>
  <el-dialog
    class="idc-pwd-validation"
    :visible.sync="dialogVisible"
    width="200px"
    :show-close="false"
    :close-on-click-modal="false"
    top="30vh"
    @close="close"
  >
    <div class="input-loading" :class="{isReEnter: isReEnter}" v-loading="!isReEnter">
      <span class="el-icon-warning warning-icon" v-if="isReEnter"></span>
      <p class="hint">{{message}}</p>
    </div>
    <span slot="footer" class="dialog-footer" v-if="isReEnter">
      <span class="btn" @click="reEnter">重新输入</span>
      <span class="btn" @click="dialogVisible = false; isReEnter = false">关闭</span>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import md5 from "@/utils/md5";
// 投注卡密码验证
export default {
  name: "idcPwdValidation",
  props: {
    showValidation: false,
    idcCode: "" // 投注卡号
  },
  data() {
    return {
      ws: null,
      isReEnter: false,
      dialogVisible: false,
      message: "正在输入密码",
      password: "",
      IDCCODE: ""
    };
  },
  watch: {
    showValidation(val) {
      this.dialogVisible = val;
      if (val) {
        this.createSocket();
      } else {
        if (this.ws) {
          this.stopKeyboard();
        }
      }
    },
    idcCode(val) {
      this.IDCCODE = val;
    }
  },
  computed: {
    ...mapGetters(["NKB_SocketUrl"])
  },
  created() {
    // 接收验证
    this.eventBus.$off("idc_input_complete");
    this.eventBus.$on("idc_input_complete", idcCode => {
      console.log("投注卡号: ", idcCode);
      this.IDCCODE = idcCode;
      this.dialogVisible = true;
      this.createSocket();
    });
  },
  destroyed() {
    this.closeWs();
  },
  methods: {
    // 创建websocket连接
    createSocket() {
      this.ws = new WebSocket(this.NKB_SocketUrl);
      this.ws.onopen = () => {
        console.log("密码键盘连接成功");
        // 发送消息
        // 提示与启动输入密码
        this.sendInputPwd(1);
      };
      // 接收消息
      this.ws.onmessage = e => {
        const data = JSON.parse(e.data);
        console.log("client：接收到服务端的消息: ", data);
        if (data && data.params && "type" in data.params) {
          switch (data.params.type) {
            // 接收密码
            case 0:
              if (data.params.input === "") {
                this.password = "";
                console.log("已清除密码");
                return;
              }
              break;
            // 确定输入结束返回密码
            case 1:
              console.log("密码: ", data.params.input);
              this.password = data.params.input;
              this.verifyPwd();
              break;
            // 键盘超时
            case 2:
              console.log("键盘超时");
              this.message = "键盘连接超时";
              this.dialogVisible = false;
              // 关闭键盘
              this.ws.send(
                JSON.stringify({
                  jsonrpc: "2.0",
                  method: "pin_input_stop",
                  id: 2
                })
              );
              break;
            // 键盘关闭
            case 3:
              console.log("键盘关闭");
              break;
            default:
              console.log("未知类型数据");
          }
        }
      };
      this.ws.onclose = () => {
        console.log("密码键盘连接关闭");
      };
    },
    // 发送输入密码命令
    sendInputPwd(mode) {
      this.message = "正在输入密码";
      this.ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "pin_input_start",
          params: {
            pin_len: 6, // 输入长度
            prompt_mode: mode, // "声音提示(0=不提示,1=您好，请输入密码＋语音提示,2=请再输一次＋语音提示,17=语音提示“您好，请输入密码”,18=语音提示“请再输一次”))"
            timeout: 30, // "输入超时(单位秒)"
            enc: 0 // "是否加密"
          },
          id: 2
        })
      );
    },
    closeWs() {
      if (this.ws) {
        this.ws.close();
      }
    },
    // 停止键盘
    stopKeyboard() {
      this.ws.send(
        JSON.stringify({ jsonrpc: "2.0", method: "pin_input_stop", id: 2 })
      );
    },
    // 验证密码
    async verifyPwd() {
      this.message = "正在验证密码";
      let data = {
        cardCode: this.IDCCODE,
        cardPwd: md5(this.password)
      };
      let result = await this.$api.checkPassword({
        closeLoading: true,
        data
      });
      if (result && result.code == 0) {
        this.stopKeyboard();
        this.dialogVisible = false;
        this.eventBus.$emit("idcVerifySuccess", data);
      } else {
        this.message = "密码输入错误";
        this.isReEnter = true;
      }
    },
    close() {
      this.$emit("update:showValidation", false);
    },
    reEnter() {
      this.dialogVisible = true;
      this.sendInputPwd(1);
      this.isReEnter = false;
    }
  }
};
</script>

<style lang="less" scoped>
.idc-pwd-validation {
  /deep/.el-dialog__header {
    display: none;
  }
  /deep/.el-dialog__body {
    border-top: none;
    padding: 20px;
  }
  /deep/.el-loading-spinner {
    margin-top: -40px;
  }
  .input-loading {
    height: 100px;
    position: relative;
    text-align: center;
    .warning-icon {
      color: #ff4444;
      font-size: 60px;
      line-height: 40px;
    }
    &.isReEnter {
      .hint {
        bottom: 30px;
      }
    }
  }
  .hint {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10%;
    text-align: center;
    z-index: 2015;
  }
  /deep/.el-dialog__footer {
    text-align: center;
    padding: 0;
    margin-top: -40px;
    position: relative;
    z-index: 2015;
    overflow: hidden;
    .btn {
      border-top: 1px solid #eee;
      color: #409eff;
      float: left;
      padding: 10px 0;
      cursor: pointer;
      font-size: 13px;
      width: 50%;
      text-align: center;
      &:last-child {
        color: #666;
        border-left: 1px solid #eee;
      }
    }
  }
}
</style>
