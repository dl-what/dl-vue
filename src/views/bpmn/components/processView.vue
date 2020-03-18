<template>
  <div class="bpmn-container">
    <div v-show="bpmnModeler">
      <div class="bpmn-view"></div>
      <bpmn-panel 
        ref="bpmnForm"
        :class="{disabled: isView || !propertieListLength || panelDisabled}" 
        :form="form"
        :formKey="currentElId"
        @selectChange="selectChange(arguments)"
        @dialogSelectorChange="dialogSelectorChange(arguments)"
        @closeTag="closeTag(arguments)"
      >
      </bpmn-panel>
      <ul class="io-zoom io-control io-control-list">
        <li>
          <el-button type="success" circle @click="zoomReset" icon="el-icon-aim" size="mini">
          </el-button>
        </li>
        <li>
          <el-button type="warning" circle @click="zoom(1)" icon="el-icon-plus" size="mini">
          </el-button>
        </li>
        <li>
          <el-button type="warning" circle @click="zoom(-1)" icon="el-icon-minus" size="mini">
          </el-button>
        </li>
        <li class="ft-btns">
          <el-button type="primary" :disabled="isView" size="small" @click="submit" v-prevent="3000">保存</el-button>
          <el-button size="small" @click="exportDiagram" v-prevent="3000">导出</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Modeler from '@/libs/bpmn/bpmn-modeler.development.js'
import customTranslate from  '@/libs/bpmn-i18n/customTranslate/customTranslate'
import bpmnPanel from './bpmnPanel'
import storage from '@/utils/storage'
import {init, disposeTypes, multiInstance} from '../panelConfig/formConfig'


export default {
  name: 'processView',
  data() {
    const self = this;
    return {
      processConfig: {}, // 流程基本配置
      detailId: this.$route.query.id || '',
      containerHeight: 0,
      bpmnXml: `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn2:process id="myProcess" isExecutable="true"></bpmn2:process>
          <bpmndi:BPMNDiagram>
            <bpmndi:BPMNPlane></bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn2:definitions>`,
      preId: 'myProcess',
      bpmnModeler: null,
      // 当前节点表单类型配置
      currentFormConf: {},
      // 不同类型节点表单配置
      formInitConf: this.clone(init),
      form: {},
      // 节点属性
      properties: null,
      // 生成的节点元素属性存放列表: 元素id => 元素属性
      propertieList: {},
      // 当前节点id
      currentElId: '',

      panelDisabled: false,

      // 初始数据
      insList: [], // 机构列表
      roleList: [], // 角色列表
      conditionAttrList: [], // 条件属性


    }
  },
  watch: {
    form: {
      handler(currentForm) {
        if (this.currentElId) {
          this.setShapeProperties(this.currentElId, currentForm);
        }
      },
      deep: true
    },
    // 当前节点id
    currentElId(elId) {
      if (!elId) {
        return;
      }
      const self = this;
      const formData = self.propertieList[elId].general.data;
      const formConfig = self.propertieList[elId].general.config;
      // 表单数据回填
      (async () => {
        // 回填 机构-部门-处理人，角色
        const disposeType = formData.disposeType;
        switch (disposeType) {
          // 处理人规则-选择人员
          case '1':
          case '2':
          case '3':
            // 设置弹窗选择器机构列表选项
            formConfig.formOptions.forEach(formOption => {
              if (formOption.dialogSelector) {
                const subFormOption = self.getFormOption(formOption.dialogSelector.configOptions, 'institutions');
                if (subFormOption && subFormOption.options) {
                  self.$set(subFormOption, 'options', self.insList);
                }
              }
            })
            // 处理人类型-选择人员: 回填处理人列表选项
            const checkedUsers = formData.candidateUsers;
            const usersOption = self.getFormOption(formConfig.formOptions, 'candidateUsers');
            if (formData.candidateUserList) {
              usersOption.options = JSON.parse(formData.candidateUserList);
            }
            // 处理人类型-选择部门: 回填部门列表选项
            const departmentOption = self.getFormOption(formConfig.formOptions, 'department');
            if (formData.departmentList) {
              departmentOption.options = JSON.parse(formData.departmentList);
            }

            
            break;
          case '4':
            // 处理人类型-选择角色: 回填角色列表选项
            const roleOption = self.getFormOption(formConfig.formOptions, 'role');
            if (formData.role) {
              roleOption.options = this.roleList;
            }

            break;
          default:
            console.log('处理人类型为空!');
        }
      })()
    },
    // 条件列表
    conditionAttrList(list) {
      const prop = 'conditionAttr';
      // 设置条件属性列表
      const conditionOption = this.getFormOption(
        this.formInitConf['bpmn:SequenceFlow'].general.formOptions, 
        prop
      );
      this.$set(conditionOption, 'options', list);
      Object.values(this.propertieList).forEach(item => {
        if (prop in item.general.data) {
          const option = this.getFormOption(item.general.config.formOptions, prop);
          this.$set(option, 'options', list);
        }
      });
    },
    // 条件属性
    'form.general.data.conditionAttr'(val) {
      const config = this.form.general.config;
      const formData = this.form.general.data;
      const prop = 'conditionValue';
      if (prop in formData) {
        const option = this.getFormOption(this.form.general.config.formOptions, prop);
        if (!val) {
          this.$set(option, 'hidden', true);
          this.$set(formData, prop, '');
          return;
        }
        this.$set(option, 'hidden', false);
      }
    },
  },
  computed: {
    propertieListLength() {
      return Object.keys(this.propertieList).length;
    },
    // 是否为编辑
    isEdit() {
      return this.detailId ? true : false;
    },
    // 是否为查看
    isView() {
      return this.$route.query.view ? true : false;
    }

  },
  created() {
    if (this.isEdit) {
      this.getProcessDetail()
    } else {
      this.getBusinessList();
    }
  },
  mounted() {

  },
  methods: {
    // 获取表单配置项
    getFormOption(formOptions, propName) {
      return formOptions.find(item => item.prop === propName);
    },
    // 获取propertieList流程根节点属性值
    getRootValue(prop) {
      return Object.values(this.propertieList).find(item => 'actCategoryIds' in item.general.data)
      .general
      .data[prop];
    },
    // 获取流程类别
    async getActCategoryData() {
      const res = await this.$api.getProcessTree();
      if (res && res.data) {
        this.treeData = res.data;
        // 设置流程类别下拉选项
        const formOption = this.getFormOption(
          this.currentFormConf.general.formOptions,
          'actCategoryIds'
        );
        this.$set(formOption, 'options', res.data || []);
      }
    },
    // 获取业务名称列表
    async getBusinessList() {
      const res = await this.$api.getBusinessList({
        data: {
          pageSize: 100,
          param: {}
        }
      });
      if (res && res.data) {
        // 初始化表单面板
        this.currentFormConf = this.formInitConf['bpmn:Process'];
        // 获取机构列表
        await this.getInsList();
        // 获取角色列表
        await this.getRoleList();
        // 设置流程业务下拉选项
        const actBusFormOption = this.getFormOption(
          this.currentFormConf.general.formOptions, 
          'actBusinessConfigId'
        );
        const list = res.data.records || [];
        this.$set(actBusFormOption, 'options', list);
        await this.getActCategoryData();
        if (this.isEdit) {
          this.currentFormConf.general.formOptions.forEach(item => {
            this.$set(item, 'disabled', true);
          })
          const item = list.find(item => item.id == this.processConfig.actBusinessConfigId);
          try {
            this.conditionAttrList = JSON.parse(item.conditionAttr);
          } catch (error) {
            this.conditionAttrList = [];
          }
        }
        // 流程初始化
        this.initBpmn();
      }
    },
    // 获取用户机构列表
    async getInsList() {
      const res = await this.$api.QueryUserAndInsTree();
      if (res && res.code === 0) {
        this.insList = res.data || [];
        // 设置流程所属机构下拉选项
        const formOption = this.getFormOption(
          this.currentFormConf.general.formOptions,
          'processInsIds'
        );
        // 只保留顶级和省机构
        const insList = this.clone(res.data) || [];
        (function filter(_data) {
          if (_data && _data.length) {
            _data.forEach(item => {
              if (item.type === 1) {
                delete item.children;
              }
              filter(item.children);
            });
          } else {
            return false;
          }
        })(insList);
        this.$set(formOption, 'options', insList);
      }
    },
    // 获取处理人员列表
    async getAssigneeUserList(insId) {
      const res = await this.$api.getAssigneeUserList({
        data: {
          insId,
          isShowChild: 0
        }
      });
      if (res && res.code === 0) {
        return res.data || [];
      }
      return [];
    },
    // 获取角色列表
    async getRoleList() {
      const res = await this.$api.QueryRoleInfoPage({
        data: {
          page: 1,
          pageSize: 1000
        }
      })
      if (res && res.code === 0) {
        this.roleList = res.data.records || [];
      }
    },
    // 获取流程详情
    async getProcessDetail() {
      const res = await this.$api.getProcessDetail({
        data: this.detailId
      })
      if (res && res.code === 0) {
        this.bpmnXml = res.data.bpmnXml;
        // 流程配置回填
        this.$set(this, 'processConfig', {
          ...res.data
        })
      }
      this.getBusinessList();
    },
    // 选择框选择完成 
    async selectChange(data) {
      const val = data[0];
      const formOption = data[1];
      const {prop, dataType} = formOption;
      switch (prop) {
        case 'processInsIds':
          this.$set(this.form.general.data, 'processInsIds', val);
          this.processConfig.insId = val[val.length - 1];
          const insIdSuffix = '-' + val[val.length - 1];
          if (this.preId.indexOf('-') > -1) {
            this.setProcessId(this.preId.replace(/-\d{1,}$/g, insIdSuffix));
          } else {
            this.setProcessId(this.preId + insIdSuffix);
          }
          break;
        case 'actCategoryIds':
          this.processConfig.actCategoryIds = val.join();
          this.processConfig.actCategoryId = val[val.length - 1];
          this.$set(this.form.general.data, 'actCategoryId', val[val.length - 1]);
          break;
        case 'actBusinessConfigId':
          this.processConfig.actBusinessConfigId = val;
          this.actBusinessChange(val);
          break;
        case 'disposeType':
          this.disposeTypeChange(val);
          const configFormOptions = this.form.general.config.formOptions;
          let subFormOption;
          switch(val) {
            // 设置弹窗选择器机构列表选项
            case '1':
            case '2':
            case '3':
              configFormOptions.forEach(formOption => {
                if (formOption.dialogSelector) {
                  subFormOption = this.getFormOption(formOption.dialogSelector.configOptions, 'institutions');
                  if (subFormOption && subFormOption.options) {
                    this.$set(subFormOption, 'options', this.insList);
                  }
                  if (subFormOption && subFormOption.defaultExpandedKeys) {
                    this.$set(subFormOption, 'defaultExpandedKeys', [this.insList[0].id]);
                  }
                }
              })
              break;
            // 设置角色列表选项
            case '4':
              subFormOption = this.getFormOption(configFormOptions, 'role');
              this.$set(subFormOption, 'options', this.roleList);
              break;
          }
          break;
        case 'department':
          this.departmentChange(val);
          break;
        case 'candidateUsers':
          this.candidateUsersChange(val);
          break;
        case 'role':
          this.roleChange(val);
          break;
      }
    },
    // 弹窗选择器事件监听
    async dialogSelectorChange(data) {
      const mode = data[0], configOption = data[2];
      let checkedNodes = [],
      uncheckedNodes = [],
      formOption = null,
      options = [],
      hash = {};
      switch(mode) {
        case 'nodeClick':
          const nodeData = data[1];
          switch(configOption.prop) {
            case 'institutions':
              const form_institutions = this.form.general.data.institutions;
              if (!form_institutions) {
                this.$set(this.form.general.data, configOption.prop, [nodeData.id]);
              }
              if (form_institutions && form_institutions.indexOf(nodeData.id) < 0) {
                form_institutions.push(nodeData.id)
              }
              const assigneeUserList = await this.getAssigneeUserList(nodeData.id);
              // 设置弹窗选择器部门及负责人列表选项
              const configFormOptions = this.form.general.config.formOptions;
              configFormOptions.forEach(formOption => {
                if (formOption.dialogSelector) {
                  const configOptions = formOption.dialogSelector.configOptions;
                  const subFormOption = this.getFormOption(configOptions, 'assigneeUserList') 
                  || this.getFormOption(configOptions, 'departmentList');

                  switch (true) {
                    // 设置处理人选项
                    case (subFormOption && subFormOption.options && subFormOption.prop === 'assigneeUserList'):
                      this.$set(
                        subFormOption, 
                        'options', 
                        JSON.parse(JSON.stringify(assigneeUserList).replace(/text/g, 'userName'))
                      );
                      break;
                    // 设置部门选项(过滤处理人)
                    case (subFormOption && subFormOption.options && subFormOption.prop === 'departmentList'):
                      const departmentList = this.clone(assigneeUserList).map(item => {
                        delete item.children;
                        return item;
                      });
                      this.$set(
                        subFormOption, 
                        'options', 
                        departmentList
                      );
                      break;
                  }
                }
              })
              break;
          }
          break;
        case 'nodeChecked':
          switch(configOption.prop) {
            // 处理人列表
            case 'assigneeUserList':
              checkedNodes = data[1].checkedNodes.filter(item => item.userId);
              uncheckedNodes = data[1].uncheckedNodes.filter(item => item.userId);
              formOption = this.getFormOption(this.form.general.config.formOptions, 'candidateUsers');
              options = formOption.options.concat(
                JSON.parse(JSON.stringify(checkedNodes).replace(/"text"/gm, '"userName"'))
              );
              // 去重
              hash = {};
              options = options.reduce((item, next) => {
                  hash[next.userId] ? '' : hash[next.userId] = true && item.push(next);
                  return item
              }, []);
              // 删除已取消选择项
              for (let i = 0; i < options.length; i++) {
                uncheckedNodes.forEach(_item => {
                  if (options[i] && _item.userId && options[i].userId === _item.userId) {
                    options.splice(i, 1);
                  }
                })
              }
              this.$set(formOption, 'options', options);
              const candidateUsers = options.map(item => item.userId);
              this.$set(
                this.form.general.data,
                'candidateUsers', 
                candidateUsers
              );
              this.$set(this.form.general.data, 'candidateUserList', JSON.stringify(options.map(item => {
                return {
                  userName: item.userName,
                  userId: item.userId
                }
              })));
              break;


            // 部门列表
            case 'departmentList':
              checkedNodes = data[1].checkedNodes.filter(item => item.id);
              uncheckedNodes = data[1].uncheckedNodes.filter(item => item.id);
              formOption = this.getFormOption(this.form.general.config.formOptions, 'department');
              options = formOption.options.concat(checkedNodes);
              // 去重
              hash = {};
              options = options.reduce((item, next) => {
                  hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                  return item
              }, []);
              // 删除已取消选择项
              for (let i = 0; i < options.length; i++) {
                uncheckedNodes.forEach(_item => {
                  if (options[i] && _item.id && options[i].id === _item.id) {
                    options.splice(i, 1);
                  }
                })
              }
              this.$set(formOption, 'options', options);
              const departments = options.map(item => item.id);
              this.$set(
                this.form.general.data,
                'department', 
                departments
              );
              this.$set(this.form.general.data, 'departmentList', JSON.stringify(options.map(item => {
                return {
                  text: item.text,
                  id: item.id
                }
              })));
              break;



          }
          break;
      }
    },
    // 标签关闭监听
    closeTag(data) {
      const tag = data[0];
      const formOption = data[1];
      const {prop, dataType} = formOption;
      switch(prop) {
        case 'candidateUsers':
        case 'department':
          const tagId = tag[formOption.props.key];
          const index = this.form.general.data[prop].indexOf(tagId);
          if (index > -1) {
            this.form.general.data[prop].splice(index, 1);
          }
          formOption.options.splice(formOption.options.findIndex(item => item[formOption.props.key] === tagId), 1);
          break;
      }
      switch (prop) {
        case 'candidateUsers':
          this.$set(this.form.general.data, 'candidateUserList', JSON.stringify(formOption.options.map(item => {
            return {
              userName: item.userName,
              userId: item.userId
            }
          })));
          break;
        case 'department':
          this.$set(this.form.general.data, 'departmentList', JSON.stringify(formOption.options.map(item => {
            return {
              text: item.text,
              id: item.id
            }
          })));
          break;
      }
    },
    // 流程类型选择
    processCateChange(id) {
      console.log('processCateChange', id);
    },
    // 设置流程id
    setProcessId(id) {
      this.$set(this.form.general.data, 'id', id);
      this.$set(this.propertieList, id, this.propertieList[this.preId]);
      delete this.propertieList[this.preId];
      this.currentElId = id;
    },
    // 流程业务名称选择
    actBusinessChange(id) {
      if (!this.isEdit) {
        const actBusFormOption = this.getFormOption(
          this.formInitConf['bpmn:Process'].general.formOptions, 
          'actBusinessConfigId'
        );
        const item = actBusFormOption.options.find(item => item.id == id);
        this.conditionAttrList = JSON.parse(item.conditionAttr);
        const matchArr = this.preId.match(/-\d{1,}$/g);
        this.setProcessId(item.router + (matchArr ? matchArr[0] : ''));
      }
    },
    // 处理类型选择
    disposeTypeChange(id) {
      this.removeProperties('general', ['institutions', 'department', 'candidateUsers', 'role']);
      this.insertProperties(disposeTypes[id].formOptions, 'general', 'disposeType');
    },
    // 部门选择
    departmentChange(id) {
      console.log('departmentChange', id);
      this.clearProperties('general', ['candidateUsers']);
      // 获取部门处理人
      const candidateUsersOptions 
      = this.getFormOption(this.form.general.config.formOptions, 'department')
      .options
      .find(item => item.id == id).children || [];
      const formOption = this.getFormOption(this.form.general.config.formOptions, 'candidateUsers');
      formOption && this.$set(formOption, 'options', candidateUsersOptions);
    },
    // 处理人选择
    candidateUsersChange(ids) {
      console.log('candidateUsersChange', ids);
    },
    // 角色选择
    roleChange(ids) {
      console.log('roleChange', ids);
    },
    // 创建节点属性
    createProperties(object, newProp, newConfig) {
      const config = this.clone(newConfig);
      this.$set(object, newProp, {});
      this.$set(object[newProp], 'data', {});
      this.$set(object[newProp], 'config', config)
      // 初始化data/节点新属性
      config.formOptions.forEach(option => {
        this.$set(object[newProp].data, option.prop, option.value);
      })
    },
    // 当前表单插入节点属性与配置
    insertProperties(formOptions, insertParentProp, insertAfterProp) {
      const insertFormOptions = this.clone(formOptions);
      const currentConfig = this.form[insertParentProp].config;
      const currentData = this.form[insertParentProp].data;
      let startIndex = currentConfig.formOptions.findIndex(option => option.prop === insertAfterProp);
      // 插入属性与配置
      insertFormOptions.forEach(option => {
        startIndex++;
        currentConfig.formOptions.splice(startIndex, 0, option);
        this.$set(currentData, option.prop, option.value);
      })
    },
    // 当前表单删除节点属性与配置
    removeProperties(parentProp, props) {
      const formData = this.form[parentProp].data;
      const formOptions = this.form[parentProp].config.formOptions;
      // 删除属性与配置
      props.forEach(prop => {
        if (prop in formData) {
          delete formData[prop];
          formOptions.splice(formOptions.findIndex(option => option.prop === prop), 1);
        }
      })
    },
    // 当前表单清空节点属性值与配置值
    clearProperties(parentProp, props) {
      const formData = this.form[parentProp].data;
      const formOptions = this.form[parentProp].config.formOptions;
      // 删除属性与配置
      props.forEach(prop => {
        if (prop in formData) {
          formData[prop] = '';
          const item = formOptions.find(option => option.prop === prop);
          if (item.options) {
            this.$set(item, 'options', []);
          }
        }
      })
    },
    // 转换节点属性以回填表单
    transProperties(eleProps) {
      const reg = /^camunda:/g;
      const properties = {};
      for (let key in eleProps) {
        if (reg.test(key)) {
          // 移除 camunda:
          properties[key.replace(reg, '')] = eleProps[key];
        } else {
          properties[key] = eleProps[key] || '';
        }
      }
      return properties;
    },
    // 根据表单配置数据类型转换以回填表单
    transDataType(formOptions, data, dataProp) {
      formOptions.forEach(item => {
        switch (item.dataType) {
          case 'number':
            const value =  data[item.prop] ? Number(data[item.prop]) : '';
            this.$set(this.form[dataProp].data, item.prop, value);
            break;
          case 'array':
            if (!data[item.prop]) {
              this.$set(this.form[dataProp].data, item.prop, []);
            } else {
              const value =  data[item.prop] 
              ? data[item.prop].split(',').map(item => Number(item))
              : [];
              this.$set(this.form[dataProp].data, item.prop, value);
            }
            break;
          default:
            this.$set(this.form[dataProp].data, item.prop, data[item.prop]);
        }
      })
    },
    // 初始化
    initBpmn() {
      this.bpmnModeler = new Modeler({
        container: '.bpmn-view',
        additionalModules: [
          {
            // 汉化
            translate: [ 'value', customTranslate]
          }
        ]
      });
      this.bpmnModeler.importXML(this.bpmnXml, err => {
        if (err) {
          this.$message.error('流程初始化创建失败')
        }
        console.log('xml创建完成');
        if (this.isEdit) {
          // 默认显示根节点表单面板
          setTimeout(() => {
            const id = this.getRootValue('id');
            this.updateForm(id);
          }, 0);
        }
      });
      const eventBus = this.bpmnModeler.get('eventBus');
      // 事件监听
      // 点击元素|自动选中
      eventBus.on(['element.click', 'autoPlace.end'], evt => {
        console.log('点击元素|自动选中: ', evt);
        this.panelDisabled = false;
        setTimeout(() => {
          const element = (evt.element || evt.shape);
          const id = element.businessObject.id;
          if (this.propertieList[id]) {
            this.currentBusinessObject = element.businessObject;
            this.currentFormConf = this.getCurrentOptions(element.businessObject.$type);
            this.updateForm(id);
          }
        }, 0)
      })
      // 节点文本编辑完成
      eventBus.on('directEditing.complete', () => {
        // 更新表单
        const currentBusinessObject = this.currentBusinessObject;
        if (currentBusinessObject) {
          const id = currentBusinessObject.id;
          if ('text' in currentBusinessObject) {
            this.propertieList[id].general.data.text = currentBusinessObject.text;
          } else {
            this.propertieList[id].general.data.name = currentBusinessObject.name;
          }
          this.updateForm(id);
        }
      })
      // 删除元素
      eventBus.on(['element.remove', 'connection.remove'], evt => {
        console.log('删除元素: ', evt.element.businessObject.id)
        this.$delete(this.propertieList, evt.element.businessObject.id);
        this.panelDisabled = true;
      })
      // 新增元素
      eventBus.on(['element.add', 'root.added'], evt => {
        console.log('添加元素: ', evt)
        this.panelDisabled = false;
        setTimeout(() => {
          const businessObject = evt.element.businessObject;
          const id = businessObject.id;
          this.currentFormConf = this.getCurrentOptions(evt.element.type);
          if (!this.propertieList[id]) {
            this.$set(this.propertieList, id, {});
          }
          this.createProperties(this.propertieList[id], 'general', this.currentFormConf.general);
          this.updateForm(id);
          // 基本数据回填
          const generalProps = {...businessObject, ...businessObject.$attrs};
          const _generalProps = this.transProperties(generalProps);
          const disposeType = _generalProps.disposeType;
          if(disposeType) {
            this.insertProperties(disposeTypes[disposeType].formOptions, 'general', 'disposeType');
          }
          // 条件表达式回填
          if (businessObject.conditionExpression) {
            _generalProps.conditionExpression = businessObject.conditionExpression.body;
          }

          this.transDataType(
            this.form.general.config.formOptions,
            _generalProps,
            'general'
          );

          // 会签/多实例数据回填
          const loopCharacteristics = businessObject.loopCharacteristics || null;
          if (loopCharacteristics) {
            let completionCondition = '';
            let loopCardinality = '';
            if ('completionCondition' in loopCharacteristics) {
              completionCondition = loopCharacteristics.completionCondition.body || '';
            }
            if ('loopCardinality' in loopCharacteristics) {
              loopCardinality = loopCharacteristics.loopCardinality.body || '';
            }
            const multiInstanceProps = {
              ...loopCharacteristics,
              ...(loopCharacteristics.$attrs || {}),
              completionCondition,
              loopCardinality
            };
            const _multiInstanceProps = this.transProperties(multiInstanceProps);
            this.createProperties(this.form, 'multiInstance', multiInstance);
            this.transDataType(
              this.form.multiInstance.config.formOptions,
              _multiInstanceProps,
              'multiInstance'
            );
          }
          

          
        }, 0)
      })
      // 流程方式
      // 按串行,并行
      eventBus.on(['sequentialActivated', 'parallelActivated'], () => {
        console.log('串行,并行');
        this.createProperties(this.form, 'multiInstance', multiInstance);
        this.$set(this.form.multiInstance.data, 'collection', '${assigneeList_' + this.currentElId + '}');
      });
      // 按循环
      eventBus.on('loopActivated', () => {
        console.log('按循环');
        this.$delete(this.form, 'multiInstance');
      });
      // 按点对点
      eventBus.on('AdHocActivated', () => {
        console.log('按点对点')
      });
      // 按串行-取消,按并行-取消
      eventBus.on(['sequentialDeactivated', 'parallelDeactivated'], () => {
        console.log('按串行-取消,按并行-取消');
        this.$delete(this.form, 'multiInstance');
      
      });
      // 按循环-取消
      eventBus.on('loopDeactivated', () => {
        console.log('按循环-取消')
      });
      // 按点对点-取消
      eventBus.on('AdHocDeactivated', () => {
        console.log('按点对点-取消');
        
      });
    },
    // 设置节点属性
    setShapeProperties(elId, currentForm) {
      const modeling = this.bpmnModeler.get('modeling');
      const moddle = this.bpmnModeler.get('moddle');
      const shape = this.bpmnModeler.get('elementRegistry').get(elId) 
      || this.bpmnModeler.get('elementRegistry').get(this.preId);
      this.preId = elId;
      const updateProperties = {};
      // 基本属性
      if (currentForm.general && currentForm.general.data) {
        const props = currentForm.general.data;
        const _properties = {};
        for (let key in props) {
          if (/^(text|name|id|conditionExpression)$/gm.test(key)) {
            _properties[key] = props[key];
          } else {
            _properties[`camunda:${key}`] = props[key];
          }
        }
        modeling.updateProperties(shape, _properties);
        // 条件表达式
        if (props.conditionValue && props.conditionAttr) {
          shape.businessObject.conditionExpression 
          = moddle.create('bpmn:FormalExpression', {
            body: '${' + props.conditionAttr + props.conditionValue + '}'
          })
          // 添加文案（写入条件属性）
          shape.businessObject.documentation = [
            moddle.create('bpmn:Documentation', {
              text: props.conditionAttr
            })
          ];
        } else {
          delete shape.businessObject.conditionExpression;
          delete shape.businessObject.documentation;
        }
      }
      // 多实例/会签属性
      if (currentForm.multiInstance && currentForm.multiInstance.data) {
        const _properties = currentForm.multiInstance.data;
        const loopCharacteristics = shape.businessObject.loopCharacteristics;
        if (_properties.loopCardinality) {
          loopCharacteristics.loopCardinality 
          = moddle.create('bpmn:FormalExpression', {
            body: _properties.loopCardinality
          })
        }
        if (_properties.collection) {
          loopCharacteristics.$attrs['camunda:collection'] = _properties.collection;
        }
        if (_properties.elementVariable) {
          loopCharacteristics.$attrs['camunda:elementVariable'] = _properties.elementVariable;
        }
        if (_properties.completionValue) {
          loopCharacteristics.$attrs['camunda:completionValue'] = _properties.completionValue;
          _properties.completionCondition = '${nrOfCompletedInstances/nrOfInstances >=' 
          + (_properties.completionValue / 100).toFixed(1)
          + '}';
          loopCharacteristics.completionCondition 
          = moddle.create('bpmn:FormalExpression', {
            body: _properties.completionCondition
          })
        }
      }
      
    },

    // 更新表单面板
    updateForm(elementId) {
      this.$refs.bpmnForm.clearValidate();
      this.$set(this, 'form', this.propertieList[elementId]);
      this.currentElId = elementId;
    },

    // 获取节点对应表单配置
    getCurrentOptions(type) {
      switch(type) {
        case 'bpmn:Process':
        case 'bpmn:TextAnnotation':
        case 'bpmn:SequenceFlow':
        case 'bpmn:Association':
        case 'bpmn:UserTask':
          return this.formInitConf[type];
          break;
        default:
          return this.formInitConf['base'];
      }
    },
    // 克隆对象
    clone(object) {
      return JSON.parse(JSON.stringify(object));
    },
    // 还原视图位置与缩放
    zoomReset() {
      this.bpmnModeler.get("zoomScroll").reset();
    },
    // 缩放
    zoom(val) {
      this.bpmnModeler.get("zoomScroll").stepZoom(val);
    },

    // 导出bpmnXML
    exportDiagram() {
      const name = this.getRootValue('name');
      this.bpmnModeler.saveXML({ format: true },  (err, xml) => {
        const encodedData = encodeURIComponent(xml)
        if (xml) {
          const link = document.createElement('a');
          link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
          link.download = `${name || '未命名'}.bpmn`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })
    },
    // 提交保存
    submit() {
      this.$refs.bpmnForm.validate((valid) => {
        if (valid) {
          this.bpmnModeler.saveXML({ format: true }, async (err, xml) => {
            if (err) {
              this.$message.error('流程保存失败!');
              return false;
            }
            
            const bpmnXml = xml;
            const name = this.getRootValue('name');
            const insId = this.clone(this.getRootValue('processInsIds') || []).reverse()[0];
            const {actCategoryId, actBusinessConfigId} = this.processConfig;
            if (!insId) {
              this.$message.error('流程所属机构不能为空!')
              return false;
            }
            if (!name) {
              this.$message.error('流程名称不能为空!')
              return false;
            }
            if (!actCategoryId) {
              this.$message.error('流程分类不能为空!')
              return false;
            }
            if (!actBusinessConfigId) {
              this.$message.error('流程业务不能为空!')
              return false;
            }

            if (Object.keys(this.propertieList).length === 1) {
              this.$message.error('请先绘制流程图!')
              return;
            }

            if (Object.values(this.propertieList).some(
              item => 'name' in (item.general.data) && !item.general.data.name && this.getFormOption(item.general.config.formOptions, 'name').rule
            )) {
              this.$message.error('任务或节点名称不能为空!')
              return false;
            }
            
            


 
            const res = await this.$api.saveProcess({
              message: this.isEdit ? '编辑成功' : '新增成功',
              data: {
                actCategoryId,
                actBusinessConfigId,
                insId,
                name,
                bpmnXml,
                isAdd: !this.isEdit
              }
            })
            if (res && res.code === 0) {
              this.$router.push({
                name: 'processSet',
                params: {
                  fromRouteName: this.$route.name
                }
              })
            }
          });
        }
      });
      
    },
  },
  components: {
    bpmnPanel
  }
}
</script>


<style lang="less">
@import '../less/index.less';
</style>
