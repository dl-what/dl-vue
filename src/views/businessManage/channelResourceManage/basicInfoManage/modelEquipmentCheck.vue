<template>
  <!-- 型号管理设备查看页面 -->
  <div class="vlt-card basic-info">
    <panel :show="true" title="类型信息查看" style="margin-bottom:20px">
      <base-info :infoList="typeInfoList"></base-info>
    </panel>
    <panel :show="true" title="设备型号信息">
      <base-info :infoList="modelInfoList">
        <li class="info-item" v-for="(item,index) in urlList" :key="index+item">
          <span class="title">{{`图片${index + 1}：`}}</span>
          <p class="content"><el-link type="primary" :underline="false" tag="p" style="font-size: 12px;" @click="previewImg(item)">查看</el-link></p>
        </li>
      </base-info>
    </panel>
    <el-dialog :visible.sync="showImg">
      <img width="100%" :src="showImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "modelEquipmentCheck",
  data() {
    return {
      typeInfoList: [
        { title: "设备名称", value: "", prop: "goodsName" },
        { title: "设备单位", value: "", prop: "deviceUnit" },
        { title: "是否标配", value: "", prop: "isStandard" },
        { title: "是否回收", value: "", prop: "isRecovery" },
        { title: "备注", value: "", prop: "remark" }
      ],
      modelInfoList: [
        { title: "设备型号", value: "", prop: "deviceModel" },
        { title: "设备单价", value: "", prop: "unitPrice" },
        { title: "供应商", value: "", prop: "provider" },
        { title: "厂家信息", value: "", prop: "manufactorInfo" },
        // { title: "预警上限", value: "", prop: "upperLimit" },
        // { title: "预警下限", value: "", prop: "lowerLimit" },
        { title: "备注", value: "", prop: "remark" }
      ],
      urlList: [],
      showImg: false,
      showImgUrl: null,
    };
  },
  components: {},
  created() {
    this.modelDetail();
  },
  methods: {
    async modelDetail() {
      const self = this;
      const data = self.$route.query.id;
      let isRecovery = {
        1: "是",
        2: "否"
      };
      let isStandard = {
        1: "是",
        2: "否"
      };
      console.log(data);
      let res = await self.$api.modelDetail({ data });
      console.log(res);
      if (res && res.code == 0) {
        this.typeInfoList.forEach(item => {
          item.value = res.data[item.prop];
          if (item.prop == "isStandard") {
            item.value = isStandard[res.data.isStandard];
          }
          if (item.prop == "isRecovery") {
            item.value = isRecovery[res.data.isRecovery];
          }
        });
        this.modelInfoList.forEach(item => {
          item.value = res.data.goodsModelVo[item.prop];
          if (item.prop == "unitPrice") {
            item.value = `${self.$common.thousandMark(res.data.goodsModelVo[item.prop])} 元`;
          }
        });
        this.urlList = res.data.goodsModelVo.files && res.data.goodsModelVo.files.split(",");
      }
    },
    previewImg(val) {
      this.showImg = true;
      this.showImgUrl = val;
    }
  }
};
</script>

<style lang="less">
</style>
