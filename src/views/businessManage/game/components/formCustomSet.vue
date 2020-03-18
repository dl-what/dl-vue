<template>
  <div class="vlt-card drag-form-container">
    <div class="top">
      <!-- <el-form :inline="true" :model="formInfo">
          <el-form-item label="表单名称">
            <el-input size="small" v-model="formInfo.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input size="small" v-model="formInfo.remark" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form> -->
        <div>
          <!-- <el-switch class="status-switch" v-model="formInfo.status" active-text="启用" inactive-text="禁用"></el-switch> -->
          <el-button type="primary" size="small" @click="showSettings = true">主屏设置</el-button>
          <!-- <el-button type="warning" size="small" @click="preview">预览</el-button> -->
          <el-button @click="close" size="small">取 消</el-button>
          <el-button size="small" type="danger" @click="saveConfig">保 存</el-button>
          
        </div>
      <div class="el-icon-delete del-bar" :class="{show: showDel}"></div>
    </div>
    <div class="content-bd">
      <div class="left-col">
        <el-form label-width="80px" label-position="top" class="form-option-list">
          <form-component
            v-for="(item, index) in formTypeList"
            :key="index"
            :config="item"
            class="form-option-item"
          ></form-component>
        </el-form>
      </div>
      <div class="right-col">
        <drag-view :boxList="boxList" :styles="boxStyle" @update="updateConfig"></drag-view>
      </div>
    </div>
    <form-config
      :config="currentConfig"
      :showDialog="showFieldConfig"
      @changeForm="updateConfig"
    ></form-config>
    <setting :showDialog.sync="showSettings" @confirm="confirmSetting"></setting>
  </div>
</template>
<script>
import storage from "@/utils/storage";
import formTypeList from "../dragForm/config/formTypeList";
import formComponent from "../dragForm/formComponent";
import dragView from "../dragForm/dragView";
import setting from "../dragForm/setting";
import formConfig from "../dragForm/formConfig";

export default {
  model: {
    prop: 'form',
    event: 'returnBack'
    },
  props: {
    form: {
      type: String,
      default: {}
    },
  },
  data() {
    return {
      formInfo: {
        name: "",
        remark: "",
        status: true,
      },
      showDel: false,
      showSettings: false,
      config: null, // 保存配置
      screen: {
        col: 0,
        row: 0
      },
      // 所有表单列表
      formTypeList,
      // 表单渲染容器列表
      boxList: [],
      boxStyle: {},
      fromDragIndex: "", // 当前容器里拖拽的index，用于与目标容器对换表单

      showFieldConfig: false,
      currentConfig: {},
      showPreview: false
    };
  },
  beforeCreated() {},
  created() {
    this.init(this.screen);
  },
  mounted() {
    const self = this;

    // 预览重新编辑 --> 模板编辑初始化
    // let data = '{}'
    // const previewConfig = JSON.parse(data) || false;
    const previewConfig = JSON.parse(this.form) || false;
    if (previewConfig) {
      this.init(previewConfig);
      this.boxList = previewConfig.list;
    }

    // 拖拽事件交互
    document.addEventListener("dragstart", function(event) {
      event.target.classList.add('moving');
      self.dragFormType = event.target.dataset.formType;
      const target = self.findClass(event.target, 'form-box')
      if (target) {
        self.fromDragIndex = Number(target.dataset.index);
        if (!self.showDel) {
          self.showDel = true;
        }
      }
    }, false);
    document.addEventListener("dragend", function(event) {
      event.target.classList.remove('moving');
    }, false);
    document.addEventListener("dragover", function(event) {
      event.preventDefault();
    }, false);
    document.addEventListener("dragenter", function(event) {
      const target = self.findClass(event.target, 'form-box');
      if (target) {
        target.classList.add('active');
      }
      const delBar = self.findClass(event.target, 'del-bar');
      if (delBar) {
        delBar.classList.add('active');
      }

    }, false);
    document.addEventListener("dragleave", function(event) {
      const target = self.findClass(event.target, 'form-box');
      if (target) {
        if (self.mouseOutEl(event.clientX, event.clientY, target)) {
          target.classList.remove('active');
        }
      }
      const delBar = self.findClass(event.target, 'del-bar');
      if (delBar) {
        if (self.mouseOutEl(event.clientX, event.clientY, delBar)) {
          delBar.classList.remove('active');
        }
      }
    }, false);
    document.addEventListener("drop", function(event) {
      event.preventDefault();
      self.showDel = false;
      const target = self.findClass(event.target, 'form-box');
      if (target) {
        target.classList.remove('active');
        // 互换位置
        if (self.fromDragIndex !== '') {
          const item1 = self.boxList[self.fromDragIndex];
          const item2 = self.boxList[target.dataset.index];
          // 互换下标
          const index1 = self.fromDragIndex;
          const index2 = target.dataset.index;
          item1.index = index2;
          item2.index = index1;
          self.$set(self.boxList, target.dataset.index, item1);
          self.$set(self.boxList, self.fromDragIndex, item2);
          self.fromDragIndex = '';
        } else {
          // 设置初始配置
          const current = formTypeList.find(item => item.type === self.dragFormType);
          self.$set(self.boxList[target.dataset.index], 'type', self.dragFormType);
          self.$set(self.boxList[target.dataset.index], 'label', current.label);
          self.$set(self.boxList[target.dataset.index], 'value', '');
          self.$set(self.boxList[target.dataset.index], 'field', self.dragFormType + Math.floor(Date.now() / 1000));
          current.options && self.$set(self.boxList[target.dataset.index], 'options', JSON.parse(JSON.stringify(current.options)));
        }
      }
      // 清空当前容器表单
      const delBar = self.findClass(event.target, 'del-bar');
      if (delBar) {
        self.$set(self.boxList, self.fromDragIndex, {
          index: self.fromDragIndex
        });
        self.fromDragIndex = '';
      }
      // self.saveConfig();
    }, false);
  },
  methods: {
    close() {
      this.$emit('close')
    },
    // 初始化
    init(config) {
      this.config = {
        ...config
      }
      let len = config.row * config.col;
      this.boxList = [];
      for (let i = 0; i < len; i++) {
        this.boxList.push({
          index: i // 容器下标
        })
      }
      Object.assign(this.boxStyle, {
        margin: '0 1% 12px',
        width: (100 - 1 * config.col * 2) / config.col + '%'
      });
    },
    confirmSetting(config) {
      this.init(config)
    },
    saveConfig() {
      this.$set(this.config, 'list', this.boxList);
      localStorage.setItem('previewConfig', JSON.stringify(this.config));
      this.$emit('change', JSON.stringify(this.config))
    },
    // 预览
    preview() {
      this.saveConfig();
      // this.$router.push({name: 'formPreview'})
    },
    // 更新渲染容器内表单配置
    updateConfig(config) {
      this.$set(this.boxList, config.index, config);
    },
    // 查找元素以及它父级是否含有className
    findClass(el, className) {
      if (el.classList) {
        if (el.classList.contains(className)) {
          return el;
        }
        return this.findClass(el.parentNode, className);
      }
      return false;
    },
    // 鼠标移出拖拽容器元素
    mouseOutEl(clientX, clientY, el) {
      if(clientX < el.getBoundingClientRect().left || 
        clientX > el.getBoundingClientRect().right - 1 ||
        clientY < el.getBoundingClientRect().top ||
        clientY > el.getBoundingClientRect().bottom - 1
      ) {
        return true;
      }
      return false;
    }
  },
  components: {
    formComponent,
    dragView,
    setting,
    formConfig
  }
};
</script>
<style lang="less">
@import "../less/index.less";

</style>