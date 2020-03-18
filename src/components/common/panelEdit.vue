<template>
  <!-- 带编辑可收缩面板 -->
  <div class="collapse-panel">
    <div class="collapse-panel-hd" :class="[showInfo?'collapse-hd-btn':'']">
      <i
        @click="toggle"
        :class="[showInfo?'el-icon-caret-bottom':'el-icon-caret-right']"
        class="collapse-panel-caret"
      ></i>
      <h2 @click="toggle" class="title">{{title}}</h2>
      <span class="tips">{{tips}}</span>
      <span @click="edit" class="edit blue">编辑</span>
      <span class="flag">|</span>
      <span @click="toggle" class="text blue">
        {{collapseName}}
        <i :class="[showInfo?'el-icon-arrow-down':'el-icon-arrow-up']"></i>
      </span>
    </div>
    <div class="collapse-panel-bd">
      <el-collapse-transition>
        <div v-show="showInfo" class="info-content">
          <slot>
            <!-- 这里插入信息的内容 name="info-content" -->
          </slot>
          
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "Panel",
  props: {
    // 面板标题
    title: {
      type: String,
      default: "标题"
    },
    // 温馨提示
    tips: {
      type: String,
      default: ""
    },
    editShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showEdit: "",
      collapseName: "收缩",
      showEdit: false,
      showInfo: true,
      active: this.show == true ? "active" : ""
    };
  },
  watch: {
    editShow(val) {
      this.showEdit = !this.showEdit;
    }
  },
  created() {
    this.showEdit = this.editShow;
  },
  methods: {
    edit() {
      // this.showEdit = !this.showEdit;
      this.$emit('edit')
    },
    toggle() {
      this.showInfo = !this.showInfo;
      this.collapseName = this.showInfo ? "收缩" : "展开";
    }
  }
};
</script>

<style lang="less" scoped>
.collapse-panel {
  border-radius: 4px;
  background-color: #fff;
  transition: all .2s ease-in-out;
  border: 1px solid #dcdee2;
  border-color: #e8eaec;
  &-caret {
    font-size: 20px;
    margin-right: 3px;
    color: #000a12;
    cursor: pointer;
  }
  &-hd {
    padding: 0 15px 0 10px;
    height: 50px;
    background-color: #fff;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    align-items: center;
    font-size: 13px;
    .title {
      font-weight: normal;
      font-size: 14px;
      color: #000a12;
      cursor: pointer;
      flex: auto;
    }
    .tips {
      // flex: 1;
    }
    .flag {
      font-size: 13px;
      color: #dfdfdf;
    }
    .edit {
      font-size: 12px;
      padding: 0 5px;
      cursor: pointer;
    }
    .text {
      font-size: 12px;
      padding: 0 5px;
      cursor: pointer;
    }
  }
  &-bd {
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    .info-content {
      color: #666;
      font-size: 12px;
    }
  }
}
.collapse-panel:hover {
  box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  border-color: #eee;
}
.collapse-hd-btn{
  border-bottom: 1px solid #e8eaec;
}
</style>
