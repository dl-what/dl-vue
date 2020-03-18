<template>
  <div class="user-admin" v-if="loginInfo">
    <router-link class="opr-icon iconfont icon-shouye" tag="span" :to="{name: 'entry'}"></router-link>
    <!-- 
    <el-dropdown class="fs-dropdown" size="small" trigger="click">
      <span class="el-dropdown-link">
        <i class="opr-icon iconfont icon-ziti"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, i) in fsList"
          :key="i"
          @click.native="setFs(item, i)"
          :class="{active: i == fsMode.index}"
        >{{item.label}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> 
    -->
    <span class="opr-icon iconfont icon-fullscreen" @click="fullScreen(null)" v-if="!isFull"></span>
    <span class="opr-icon iconfont icon-exitfullscreen" @click="exitFullScreen" v-else></span>
    <span class="opr-icon el-icon-lock" @click="lock"></span>
    <span class="opr-icon el-icon-bell" @click="showMessageDock = true"></span>
    <span class="opr-icon iconfont icon-tuichu" @click="logoutConfirm"></span>
    <span class="el-dropdown-link">
      <span class="user-info">
        <el-popover placement="bottom" width="320" trigger="click">
          <span slot="reference">
            <span class="avatar">
              <img v-if="loginInfo.avatar" :src="loginInfo.avatar" @error="loginInfo.avatar = ''" />
              <i v-else class="iconfont icon-touxiang"></i>
            </span>
            <span class="user-name">{{loginInfo.userName}}</span>
          </span>
          <el-card class="box-card user-info-content">
            <div slot="header" class="clearfix">
              <span>用户信息</span>
              <el-button
                style="float: right; padding: 0;"
                type="text"
                @click="showUserSettings = true"
              >用户设置</el-button>
            </div>
            <div class="info-item">
              <span class="title">用户账号：</span>
              {{loginInfo.account}}
            </div>
            <div class="info-item">
              <span class="title">手机号码：</span>
              {{loginInfo.mobile}}
            </div>
            <div class="info-item">
              <span class="title">本次登录：</span>
              {{loginInfo.lastLoginTime}}
            </div>
            <div class="info-item">
              <span class="title">登录IP：</span>
              {{loginInfo.loginIp}}
            </div>
          </el-card>
        </el-popover>
      </span>
    </span>
    <!-- 用户设置 -->
    <el-dialog
      title="用户设置"
      top="8vh"
      :visible.sync="showUserSettings"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="800px"
    >
      <user-settings @enter="showUserSettings = false"></user-settings>
    </el-dialog>
    
    <!-- 站内信 -->
    <message-dock :showDialog.sync="showMessageDock"></message-dock>
  </div>
</template>

<script>
import storage from "@/utils/storage";
import windowScreen from "@/utils/windowScreen";
import moment from "moment";
import { mapGetters, mapActions, mapMutations } from "vuex";
import messageDock from "./messageDock";
import userSettings from "./userSettings"
import { Notification } from "element-ui";

export default {
  name: "adminInfo",
  data() {
    return {
      ws: null,
      showMessageDock: false,
      showUserSettings: false,
      // fsList: [
      //   {
      //     label: "小",
      //     className: "fs-s"
      //   },
      //   {
      //     label: "中",
      //     className: "fs-m"
      //   },
      //   {
      //     label: "大",
      //     className: "fs-b"
      //   },
      //   {
      //     label: "特大",
      //     className: "fs-b2"
      //   }
      // ]
    };
  },
  computed: {
    ...mapGetters(["isFull", "fsMode", "loginInfo"])
  },
  created() {
    this.watchScreen(
      () => {
        this.setFull(true);
      },
      () => {
        this.setFull(false);
      }
    );
    if (this.loginInfo) {
      this.$set(
        this.loginInfo,
        "lastLoginTime",
        moment(this.loginInfo.lastLoginTime).format("YYYY-MM-DD HH:mm:ss")
      );
      this.initWS();
    }
  },
  methods: {
    ...mapMutations(['SET_MENUDATA']),
    // 设置内容区域字体大小
    setFs(item, index) {
      this.setFontSize({
        index,
        className: item.className
      });
    },
    initWS() {
      // 连接站内信ws
      const socket = this.$api.getMsgWs({
        data: {
          uid: this.loginInfo.userId,
          account: this.loginInfo.account
        }
      });
      socket.on("connect", () => {
        socket.on("message", data => {
          if (typeof data === "string") {
            this.showNotify(data);
          }
        });
      });
    },
    // 显示通知窗口
    showNotify(msg) {
      this.$notify.info({
        title: "您有一条新消息",
        message: msg,
        position: "top-right",
        customClass: "msgNotify",
        duration: 10000,
        offset: 107
      });
    },
    logoutConfirm() {
      this.$confirm("是否退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loginOut();
        })
        .catch(() => {
          // 取消
        });
    },
    async loginOut() {
      const res = await this.$api.getLogOut({
        message: "退出成功"
      });
      if (res && res.code == 0) {
        this.SET_MENUDATA([]);
        storage.remove("token");
        storage.remove("userInfo");
        Notification.closeAll();
        this.$router.push({
          path: "/login"
        });
        return;
      }
    },
    lock() {
      this.eventBus.$emit("lock", true);
    },
    fullScreen: windowScreen.fullScreen,
    exitFullScreen: windowScreen.exitFullScreen,
    watchScreen: windowScreen.watchScreen,
    ...mapActions(["setFull", "setFontSize"])
  },
  components: {
    messageDock,
    userSettings
  }
};
</script>

<style lang="less" scoped>
  .user-admin {
    position: absolute;
    right: 2%;
    top: 15px;
    color: #666;
    .msg-tips {
      color: #2d8cf0;
      font-size: 12px;
      margin-right: 15px;
      cursor: pointer;
      .icon {
        font-size: 20px;
        color: #333333;
        font-weight: bold;
      }
    }
    .user-info {
      line-height: 32px;
      cursor: pointer;
    }
    .user-name {
      font-size: 14px;
    }
    .avatar {
      display: inline-block;
      vertical-align: top;
      overflow: hidden;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin: 0 5px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
      .iconfont {
        font-size: 32px;
        color: #bdbdbd;
      }
    }
    .opr-icon {
      font-size: 20px;
      color: #666;
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      cursor: pointer;
    }
    .logout {
      margin-right: 30px;
    }
    
  }
  /deep/.el-dialog__body{
    padding: 20px 40px;
  }
  /deep/.user-setting-comp{
    /deep/.el-form-item__label, /deep/.el-form-item__content, /deep/.el-input__inner{
      font-size: 13px;
    }
  }
</style>
<style lang="less">
  .user-info-content {
    &.el-card {
      background-color: transparent;
      border: none;
      box-shadow: none;
      margin: -10px;
      font-size: 13px;
      color: #999;
    }
    .el-button--text {
      font-size: 12px;
    }
    .el-card__header {
      padding: 10px 15px;
    }
    .el-card__body {
      padding: 10px 15px;
    }
    .info-item {
      line-height: 2;
      font-size: 12px;
      .title {
        color: #999;
        display: inline-block;
        vertical-align: top;
        width: 5.5em;
      }
      color: #333;
    }
  }
  .entry-container .entry-hd,
  .home-container .user-admin {
    .message-content {
      margin-right: 0;
      line-height: 0;
      .el-badge__content {
        line-height: 16px;
        border-radius: 50%;
        padding: 2px 2px;
        width: 22px;
        text-align: center;
        height: 22px;
      }
    }
  }
  .pb-20 {
    padding-bottom: 20px;
  }
</style>