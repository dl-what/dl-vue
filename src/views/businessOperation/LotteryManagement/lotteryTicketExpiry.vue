<template>
  <div class="vlt-card">
    <div class="vlt-edit-single" v-show="status ===1">
      <base-form
        :formData="IdcOptions"
        ref="idcForm"
        labelWidth="120px"
        :rules="rules"
        direction="right"
        @change="IdcChange"
      ></base-form>
      <div class="btn-item">
        <el-button
          type="primary"
          @click="scanIdc"
          icon="el-icon-search"
          size="small"
          :loading="isScan"
        >{{scanLabel}}</el-button>
        <p class="tips">(注: 需要接入高拍仪)</p>
      </div>
      <base-form
        :formData="lotteryTicketRedeemData"
        ref="baseForm"
        labelWidth="120px"
        :rules="rules"
        direction="right"
        @change="changeForm"
      ></base-form>
      <div class="btn-item">
        <el-button @click="goBack" size="small" :id="$route.name + '-' + 'cancel'">取 消</el-button>
        <el-button
          type="primary"
          @click="toNext"
          size="small"
          :id="$route.name + '-' + 'tonext'"
        >下一步</el-button>
      </div>
    </div>

    <div class="photo-collection" v-show="status === 2">
      <div>
        <h2 class="title">兑奖信息</h2>
        <el-form :model="photoForm" :rules="rules" ref="photoForm" label-width="140px" class="take-group">
          <el-form-item
            class="take-item"
            :label="item.title" 
            :prop="`takeList.${index}.imgList`"
            v-for="(item, index) in photoForm.takeList"
            :key="index"
            @mouseenter="currentTakeItem = item"
          >
            <div class="take-bd">
              <div class="open-video" @click="openVideo(item)">
                <i class="icon el-icon-plus"></i>
              </div>
              <div class="img-list-bd" v-if="item.imgList.length">
                <h6>照片列表</h6>
                <ul class="img-list">
                  <li v-for="(imgItem, i) in item.imgList" :key="i">
                    <img :src="imgItem" alt @click="preview(imgItem)" />
                    <span class="del el-icon-close" @click="delImg(i)"></span>
                  </li>
                </ul>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="btns-ft">
          <el-button size="small" @click="goback" :id="$route.name + '-' + 'goback'">上一步</el-button>
          <el-button
            size="small"
            type="primary"
            @click="submit"
            :id="$route.name + '-' + 'submit'"
          >提 交</el-button>
        </div>
        <el-dialog
          :title="!isPreview ? currentTakeItem.title : '照片预览'"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          @closed="closeVideo"
          width="840px"
        >
          <div class="video-box">
            <img :src="base64Stream" alt />
            <ul class="img-list" v-if="currentTakeItem.imgList.length && !isPreview">
              <li v-for="(imgItem, i) in currentTakeItem.imgList" :key="i">
                <img :src="imgItem" alt />
                <span class="del el-icon-close" @click="delImg(i)"></span>
              </li>
            </ul>
          </div>
          <div slot="footer" class="dialog-footer" v-if="!isPreview">
            <el-button @click="closeVideo" :id="$route.name + '-' + 'photoEnter'">确 定</el-button>
            <el-button
              type="primary"
              @click="takePhoto"
              v-prevent="500"
              :id="$route.name + '-' + 'takePhoto'"
            >拍 照</el-button>
          </div>
          <div slot="footer" class="dialog-footer" v-else>
            <el-button type="primary" @click="closeVideo" :id="$route.name + '-' + 'enter'">确 认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import QWebChannel from "@/utils/qwebchannel";
import { mapGetters } from "vuex";

export default {
  name: "",
  data() {
    const self = this;
    return {
      status: 1,
      dock: null,
      socket: null,
      isScan: false,
      scanLabel: "扫描身份证",
      sendData: "",
      takeList: [
        {
          title: "图像采集", // 标题
          cameraId: "USB CAM2", // 摄像头设备ID
          imgList: [],
          message: '图像采集不能为空',
        },
        {
          title: "身份证采集",
          cameraId: "S1020A3",
          imgList: [],
          message: '身份证采集不能为空',
        },
        {
          title: "中奖凭证采集",
          cameraId: "S1020A3",
          imgList: [],
          message: '中奖凭证采集不能为空',
        }
      ],
      photoForm: {},
      currentTakeItem: null,
      base64Stream: "", // base64视频流
      dialogVisible: false,
      isPreview: false, // 预览
      //点击兑奖弹框验证
      rules: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: ["change", "blur"]
          }
        ],
        idCard: [
          {
            required: true,
            validator: this.$rules.checkIdCard,
            trigger: ["change", "blur"]
          }
        ],
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: ["change", "blur"]
          }
        ],
        mobile: [
          {
            required: true,
            validator: this.$rules.checkPhone,
            trigger: ["change", "blur"]
          }
        ],
        winAmount: [
          {
            required: true,
            validator: this.$rules.checkMoney,
            trigger: ["change", "blur"]
          }
        ],
        // donateMoney: [
        //   {
        //     required: true,
        //     validator: this.$rules.checkMoney,
        //     trigger: ["change", "blur"]
        //   }
        // ],
        actualTax: [
          {
            required: true,
            validator: this.$rules.checkMoney,
            trigger: ["change", "blur"]
          }
        ],
        actualMoney: [
          {
            required: true,
            validator: this.$rules.checkMoney,
            trigger: ["change", "blur"]
          }
        ],
        taxAmount: [
          {
            required: true,
            validator: this.$rules.checkMoney,
            trigger: ["change", "blur"]
          }
        ]
      },
      // 身份证信息表单
      IdcOptions: [
        {
          type: "input",
          title: "姓名",
          prop: "name",
          value: "",
          maxlength: 10
        },
        {
          type: "input",
          title: "身份证",
          prop: "idCard",
          value: "",
          maxlength: 18
        },
        {
          type: "input",
          title: "地址",
          prop: "address",
          value: "",
          maxlength: 100
        }
      ],
      //点击兑奖弹框表单类型数据
      lotteryTicketRedeemData: [
        { type: "input", title: "手机号", prop: "mobile", value: "" },
        {
          type: "input",
          title: "中奖金额(元)",
          prop: "winAmount",
          value: null,
          disabled: true
        },
        {
          type: "input",
          title: "捐款金额(元)",
          prop: "donateMoney",
          value: null
        },
        {
          type: "input",
          title: "实际缴税(元)",
          prop: "actualTax",
          value: null,
          disabled: true
        },
        {
          type: "input",
          title: "实兑金额(元)",
          prop: "actualMoney",
          value: null,
          disabled: true
        }
      ],
      idName: {},
      RedeemData: {},
      data: {},
      toNextData: {},
      winAmount: "",
      taxRate: "",
      carcode: ""
    };
  },
  watch: {
    currentTakeItem: {
      handler(data) {
        if (data.imgList.length > 5) {
          data.imgList.splice(0, 1);
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(["HSP_SocketUrl"])
  },
  created() {
    this.currentTakeItem = this.takeList[0];
    this.getTaxCalculated();
    this.carcode = this.$storage.get("carcode");

    this.data = {
      betSn: this.$route.query.betSn,
      grade: this.$route.query.grade,
      transactionId: this.$route.query.transactionId
    };

    // 创建图像采集rules
    this.$set(this.photoForm, 'takeList', this.takeList);
    this.takeList.forEach((item, index) => {
      this.$set(this.rules, `takeList.${index}.imgList`, [
        {
          required: true,
          validator: this.$rules.checkEmpty,
          message: item.message,
          trigger: ["change", "blur"]
        }
      ])
    })
  },
  mounted() {
    this.initSocket();
  },

  //销毁
  destroyed() {
    this.closeVideo();
    this.socket.close();
    this.socket.onclose = () => {
      console.log("WebSocket已关闭");
    };
  },
  methods: {
    validate(name) {
      let res = false;
      this.$refs[name].$refs.form.validate(valid => {
        res = valid;
      });
      return res;
    },
    //获取并计算税额和中奖金额数据
    async getTaxCalculated() {
      let result = await this.$api.BigLotteryTaxrate();
      console.log(result);
      this.taxRate = result.data.taxRate;
      this.winAmount = this.changeNumber(this.$route.query.winAmount);

      this.lotteryTicketRedeemData[1].value = this.winAmount.toFixed(2);
      this.lotteryTicketRedeemData[3].value = (this.winAmount * (this.taxRate / 100)).toFixed(2);
      this.lotteryTicketRedeemData[4].value =
        (this.winAmount - this.lotteryTicketRedeemData[3].value).toFixed(2);
    },
    init() {
      this.toNextData = {
        ...this.data,
        ...this.idName,
        ...this.RedeemData
      };
      //console.log(toNextData);
    },
    // 转换千分符
    changeNumber(val) {
      var x = val.split(",");
      return parseFloat(x.join(""));
    },
    // 获取表单配置项
    getFormOption(formOptions, propName) {
      return formOptions.find(item => item.prop === propName);
    },
    // 初始化高拍仪
    initSocket() {
      this.socket = new WebSocket(this.HSP_SocketUrl);
      this.socket.onopen = () => {
        new QWebChannel(this.socket, channel => {
          //获取注册的对象
          this.dock = channel.objects.dialog;
          this.dock.send_priImgData.connect(data => {
            this.base64Stream = "data:image/jpg;base64," + data;
          });
          // 网页加载完成信号
          this.dock.html_loaded("one");
          //接收拍照base64，主头数据
          this.dock.send_priPhotoData.connect(data => {
            const imgData = "data:image/jpg;base64," + data;
            this.currentTakeItem.imgList.push(imgData);
          });
          // 接收身份证扫描
          this.dock.sendPrintInfo.connect(data => {
            console.log("服务返回信息: ", data);
            this.isScan = false;
            const nameOption = this.getFormOption(this.IdcOptions, "name");
            const idcOption = this.getFormOption(this.IdcOptions, "idCard");
            const adrOption = this.getFormOption(this.IdcOptions, "address");
            if (data.indexOf("IDcardInfo:") >= 0) {
              const infoList = data.replace(/IDcardInfo:/, "").split(" "); // 以空格分割为数组
              nameOption.value = infoList[0];
              idcOption.value = infoList[7];
              adrOption.value = infoList[6];
              this.scanLabel = "重新扫描";
              return;
            }
            console.log("身份证读取失败");
          });
          // 默认关闭
          this.dock.get_actionType("closePriVideo");
        });
      };
    },
    // 扫描身份证
    scanIdc() {
      // 清空表单数据
      // this.IdcOptions.forEach(item => {
      //   item.value = "";
      // });
      this.dock.get_actionType("singleReadIDCard");
      this.isScan = true;
    },
    IdcChange(form) {
      // /console.log("idcForm", form);
      this.idName = form;
      console.log(this.idName);
    },
    changeForm(val) {
      this.RedeemData = val;
      console.log(this.RedeemData);
    },
    goBack() {
      this.$router.go(-1);
    },
    toNext() {
      this.init();
      let self = this;
      let baseForm = self.validate("baseForm");
      let idcForm = self.validate("idcForm");
      if (baseForm && idcForm) {
        this.status = 2;
      }
    },
    // 拍照
    takePhoto() {
      this.dock.photoBtnClicked("primaryDev_");
      this.dock.get_actionType("savePhotoPriDev");
    },
    // 删除图片
    delImg(index) {
      this.currentTakeItem.imgList.splice(index, 1);
    },
    // 预览
    preview(imgPath) {
      this.isPreview = true;
      this.dialogVisible = true;
      this.base64Stream = imgPath;
    },
    //打开视频弹窗
    openVideo(item) {
      this.dialogVisible = true;
      this.dock.devChanged("primaryDev_:" + item.cameraId);
      this.dock.devChanged("primaryDev_:" + "1280 * 720");
      this.currentTakeItem = item;
    },
    //关闭视频
    closeVideo() {
      this.dialogVisible = false;
      this.isPreview = false;
      this.dock.get_actionType("closePriVideo", () => {
        this.base64Stream = null;
      });
    },
    //返回上一步
    goback() {
      this.status = 1;
    },
    //提交
    async submit() {
      const self = this;
      self.$refs.photoForm.validate(async valid => {
        if (valid) {
          let personImgList = self.takeList[0].imgList;
          let idCardScansList = self.takeList[1].imgList;
          let prizeEvidenceList = self.takeList[2].imgList;

          self.toNextData.winAmount = self.toNextData.winAmount?self.$common.accMul(self.toNextData.winAmount, 100):0;
          self.toNextData.actualTax = self.toNextData.actualTax?self.$common.accMul(self.toNextData.actualTax, 100):0;
          self.toNextData.actualMoney = self.toNextData.actualMoney?self.$common.accMul(self.toNextData.actualMoney, 100):0;
          self.toNextData.donateMoney = self.toNextData.donateMoney?self.$common.accMul(self.toNextData.donateMoney, 100):0;

          self.sendData = {
            winGrade: this.$route.query.winGrade,
            ...self.toNextData,
            ...self.carcode,
            personImgList,
            idCardScansList,
            prizeEvidenceList
          };
          let data = {
            ...self.sendData
          };
          let result = await self.$api.saveLotteryMessage({
            message: "保存成功",
            data
          });
          if (result && result.code === 0) {
            self.$router.push("lotteryTicket");
          }
          self.$storage.remove("carcode");

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index.less";
.vlt-edit-single {
  padding-top: 30px;
}
.asterisk{
  color: #F56C6C;
  margin-right: 4px;
}
.btn-item {
  padding-left: 120px;
  padding-bottom: 20px;
}
.tips {
  padding-top: 7px;
  color: #8e8e8e;
  opacity: 0.8;
  font-size: 12px;
}
</style>
