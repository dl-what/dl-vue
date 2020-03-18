<template>
  <el-form label-position="top" :model="form" :rules="rules" class="bpmn-panel" ref="form">
    <h4 class="panel-header">节点信息</h4>
    <div class="form-panel-bd" v-if="form && form.general">
      <h6 class="heading">{{form.general.config.heading}}</h6>
      <div v-for="(formItem, itemIndex) in form.general.config.formOptions" :key="formItem.prop + itemIndex" class="form-group" v-show="!formItem.hidden">
        <el-form-item :key="formKey" :label="formItem.title" v-if="formItem.type === 'input'" :prop="formItem.rule ? `general.data.${formItem.prop}` : ''">
          <el-input size="mini" :autosize="formItem.autosize || false" v-model.trim="form.general.data[formItem.prop]" :placeholder="`请输入${formItem.title}`" :disabled="formItem.disabled || false">
            <template slot="append" v-if="formItem.appendText">{{formItem.appendText}}</template>
          </el-input>
        </el-form-item>
        <el-form-item :class="{'hidden-close': formItem.hiddenClose}" :key="formKey" :label="formItem.title" v-if="formItem.type === 'select'" :prop="formItem.rule ? `general.data.${formItem.prop}` : ''">
          <el-select size="mini"
            :clearable="formItem.clearable || false"
            v-model="form.general.data[formItem.prop]"
            :placeholder="`请选择${formItem.title}`" 
            :disabled="formItem.disabled || false"
            :multiple="formItem.multiple || false"
            :filterable="formItem.filterable || false"
            @change="val => selectChange(val, formItem)"
          >
            <el-option 
              :label="optionItem[(formItem.props && formItem.props.label) || 'label']" 
              :value="optionItem[(formItem.props && formItem.props.key) || 'value']" 
              v-for="(optionItem, optionIndex) in formItem.options"
              :key="optionIndex"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="formItem.title" v-if="formItem.type === 'cascader'" :prop="formItem.rule ? `general.data.${formItem.prop}` : ''">
          <el-cascader
            size="mini"
            v-model="form.general.data[formItem.prop]"
            :disabled="formItem.disabled || false"
            :props="formItem.props"
            :options="formItem.options"
            :placeholder="`请选择${formItem.title}`" 
            @change="val => selectChange(val, formItem)"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item :key="formKey" :label="formItem.title" v-if="formItem.type === 'tag'">
          <div class="checked-tagList el-input" @click="formItem.dialogSelector.show = true">
            <span class="placeholder" v-if="!formItem.options.length">请选择{{formItem.title}}</span>
            <el-tag 
              size="mini" 
              type="info" 
              closable 
              v-for="(tag, index) in formItem.options" 
              :key="index" 
              @close="() => closeTag(tag, formItem)"
            >
              {{tag[formItem.props.label]}}
            </el-tag>
          </div>
        </el-form-item>
        <!--弹窗选择器-->
        <el-dialog
          v-if="formItem.dialogSelector"
          :append-to-body="true" 
          :title="formItem.dialogSelector.title" 
          :visible.sync="formItem.dialogSelector.show" 
          :close-on-click-modal="false"
          width="680px"
          class="dialog-selector"
        >
          <el-row :key="formKey">
            <el-col :span="24 / formItem.dialogSelector.configOptions.length" v-for="(configOption, cfIndex) in formItem.dialogSelector.configOptions" :key="cfIndex">
              <p class="col-title">{{configOption.title}}</p>
              <el-tree 
                v-if="configOption.type === 'tree'"
                :data="configOption.options"
                :show-checkbox="configOption.showCheckbox"
                :props="configOption.props"
                :ref="configOption.prop"
                :node-key="configOption.props.key"
                :accordion="configOption.accordion || false"
                :expand-on-click-node="configOption.expandOnclickNode || false"
                :default-checked-keys="form.general.data[formItem.prop]"
                :default-expanded-keys="configOption.defaultExpandedKeys"
                :key="form.general.data[formItem.prop].length"
                @node-click="data => dialogSelectorChange({mode: 'nodeClick', data, configOption, formItem})"
                @check-change="(data, checked) => dialogSelectorChange({
                  mode: 'checkChange', 
                  data,
                  checked,
                  configOption
                })"
                @check="(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys) => dialogSelectorChange({
                  mode: 'check', 
                  data: {
                    checkedNodes, 
                    checkedKeys, 
                    halfCheckedNodes, 
                    halfCheckedKeys
                  },
                  configOption
                })"
              >
              </el-tree>
            </el-col>
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="formItem.dialogSelector.show = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="() => {
                formItem.dialogSelector.show = false;
                dialogSelectorChange({
                  mode: 'nodeChecked', 
                  data: null, 
                  configOption: formItem.dialogSelector.configOptions[formItem.dialogSelector.configOptions.length - 1]
                })
              }">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div class="form-panel-bd" v-if="form && form.multiInstance">
      <h6 class="heading">{{form.multiInstance.config.heading}}</h6>
      <div v-for="(formItem, itemIndex) in form.multiInstance.config.formOptions" :key="itemIndex" class="form-group" v-show="!formItem.hidden">
        <el-form-item :key="formKey" :label="formItem.title" v-if="formItem.type === 'input'" :prop="formItem.rule ? `multiInstance.data.${formItem.prop}` : ''">
          <el-input size="mini" v-model="form.multiInstance.data[formItem.prop]" :placeholder="`请输入${formItem.title}`" :disabled="formItem.disabled || false">
            <template slot="append" v-if="formItem.appendText">{{formItem.appendText}}</template>
          </el-input>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
  export default {
    name: 'bpmnPanel',
    props: {
      // 表单配置，数据
      form: {
        default() {
          return {}
        }
      },
      // 表单key
      formKey: {
        default() {
          return 'key'
        }
      },
    },
    data() {
      return {
        rules: {},
      };
    },
    computed: {
      isEdit() {
        return this.$route.query.id ? true : false;
      }
    },
    watch: {
      form(newForm) {
        this.setRule('general');
        this.setRule('multiInstance');
      },
    },
    created() {
  
    },
    mounted() {

    },
    methods: {
      clone(object) {
        return JSON.parse(JSON.stringify(object));
      },
      validate(cb) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            cb(true)
          } else {
            cb(false);
          }
        })
      },
      // 设置验证
      setRule(prop) {
        if (this.form[prop]) {
          this.form[prop].config.formOptions.forEach(item => {
            if (item.rule) {
              this.$set(this.rules, `${prop}.data.${item.prop}`, item.rule)
            }
          })
        }
      },
      // select选择完成
      selectChange(value, formOption) {
        this.$emit('selectChange', value, formOption);
      },
      resetForm() {
        this.$refs.form.resetFields();
      },
      clearValidate() {
        this.$refs.form.clearValidate();
      },
      // tree转一维数组
      treeTransArr(nodes, childrenAlias = 'children') {
        let result = [];
        if (Array.isArray(nodes)) {
          for (let i = 0, l = nodes.length; i < l; i++) {
            result.push(nodes[i]);
            if (Array.isArray(nodes[i][childrenAlias]) && nodes[i][childrenAlias].length > 0){
              result = result.concat(this.treeTransArr(nodes[i][childrenAlias]));
            }
            delete nodes[i][childrenAlias]
          }
        } 
        return result;
      },
      // 弹窗选择器相关
      dialogSelectorChange(options) {
        const {mode, data, configOption, formItem} = options;
        let checkedNodes = [];
        switch (mode) {
          // 节点点击
          case 'nodeClick':
            // 切换左侧关联节点时保存右侧已选中节点
            if (configOption.relationProp && formItem) {
              this.dialogSelectorChange({
                mode: 'nodeChecked', 
                data: null, 
                configOption: formItem.dialogSelector.configOptions[formItem.dialogSelector.configOptions.length - 1]
              })
            }
            
            this.$emit('dialogSelectorChange', mode, data, configOption);
            break;
          // 节点选择确定
          case 'nodeChecked':
            const nodeArr = this.treeTransArr(this.clone(configOption.options));
            const ref = this.$refs[configOption.prop][0];
            checkedNodes = ref.getCheckedNodes().concat(ref.getHalfCheckedNodes());
            // 获取未选中节点
            const cc = this.clone(checkedNodes);
            const uncheckedNodes = this.clone(nodeArr);
            for (let i = 0; i < uncheckedNodes.length; i++) {
              cc.forEach(_item => {
                delete _item[configOption.props.children || 'children'];
                if (JSON.stringify(uncheckedNodes[i]) === JSON.stringify(_item)) {
                  uncheckedNodes.splice(i, 1);
                  i -= 1;
                }
              })
            }
            this.$emit('dialogSelectorChange', mode, {
              checkedNodes,
              uncheckedNodes
            }, configOption);
            break;
          // 节点选中状态发生变化
          case 'checkChange':

            break;
          // 复选框被点击的时候触发
          case 'check':
            
            break;
        }
        
      },
      // tag关闭
      closeTag(tag, formOption) {
        this.$emit('closeTag', tag, formOption);
      },
    }
  }
</script>

<style lang="less" scoped>
.bpmn-panel {
  text-align: left;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  z-index: 10;
  border-left: 1px solid #dfdfdf;
  overflow-y: auto;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  &.disabled{
    cursor: not-allowed;
    &:after{
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255,255,255,0.5);
    }
  }
  .form-panel-bd{
    .heading{
      padding: 10px;
      border-left: 2px solid #409EFF;
      font-size: 14px;
    }
  }
  .panel-header{
    font-size: 16px;
    padding: 10px;
    border-bottom: 1px solid #dfdfdf;
  }
  /deep/.el-form-item__label{
    color: #333;
    font-size: 12px;
    padding: 0;
    line-height: 24px;
    min-height: 24px;
  }
  /deep/.el-input__inner{
    padding: 0 10px;
  }
  /deep/.el-select, /deep/.el-cascader{
    display: block;
  }
  /deep/.el-form-item__content{
    line-height: normal;
  }
  .form-group{
    padding: 10px 10px 0;
  }
  .el-form-item{
    margin-bottom: 10px;
    position: relative;
    &.hidden-close{
      /deep/.el-tag__close{
        display: none;
      }
    }
    /deep/.el-input-group__append{
      padding:0 10px;
    }
  }
  .checked-tagList{
    min-height: 34px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
    position: relative;
    .placeholder{
      position: absolute;
      left: 0;
      top: 0;
      padding: 0 10px;
      color: #C0C4CC;
      line-height: 32px;
    }
    /deep/.el-tag{
      margin-bottom: 3px;
      margin-right: 3px;
    }
  }
}
.dialog-selector{
  /deep/.el-dialog__body{
    padding: 20px;
    .col-title{
      margin-bottom: 15px;
    }
    .el-tree{
      max-height: 400px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 6px;
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background   : #7a7a7a;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        background   : #ededed;
      }
    }
    .el-col{
      margin-top: 10px;
    }
  }
}
</style>
