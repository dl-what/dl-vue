<template>
  <div class="vlt-card">
    <test-forms  :formData="formData" v-model="form" ref="baseForm" @change="changeForm" labelWidth="140px" :rules="rules" direction="right">
      <el-upload
        class="upload-demo"
        slot="slotA"
        drag
        multiple
        action=""
        :limit="10"
        :show-file-list="true"
        :on-remove="handleRemove"
        :http-request="uploadFileOther">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
      <el-upload
        class="upload-demo"
        slot="slotB"
        drag
        multiple
        action=""
        :limit="10"
        :show-file-list="true"
        :on-remove="handleRemove"
        :http-request="uploadFileOther">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </test-forms>
    <el-button type="primary" v-prevent="1000" size="medium" @click="submit">提 交</el-button>
  </div>
</template>

<script type="text/javascript">
// import formMethods from '@/utils/formMethods'
import TestForms from '@/components/common/testForms'
import rules from '@/utils/rules.js';

export default {
  components: {
    TestForms
  },
  data() {
    return {
      rules: {
        test: [
          { required: true, validator: rules.checkEmail, trigger: 'blur' }
        ],
        status: [
          { required: true, validator: rules.checkEmpty, trigger: 'blur' }
        ],
        all: [
          { required: true, validator: rules.checkEmail, trigger: 'blur' }
        ],
        uploadA: [
          { required: true, validator: rules.checkEmail, trigger: 'blur' }
        ]
      },
      baseData: [
        {title: '上市游戏', type: 'select',  prop: 'a', value: 1, options:[{label:'苹果',value:1},{label:'香蕉',value:2}]},
        {title: '销售区域', type: 'cascader',  prop: 'all', value: [1,60], options: [],
          setProps: {
            label: "text",
            value: "id",
            children: "children",
            // multiple: true, // 多选
            checkStrictly: true //设置父子节点取消选中关联，从而达到选择任意一级选项的目的
          }
        },
        {title: '状态', type: 'select',  prop: 'status', value: 1, options:[{label:'启用',value:1},{label:'禁用',value:2}], rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: '姓名', type: 'input',  prop: 'd', value: '', options:[{label:'启用',value:1},{label:'禁用',value:2}], rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: '上传附件', type:'slot', slotName: 'slotA', prop:'uploadA', rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: '备注', type: 'input',  prop: 'e', value: '', rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: '上传附件', type:'slot', slotName: 'slotB', prop:'uploadB'},
        {title: '简介', type: 'input',  prop: 'test', value: '', disable: true , rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: "单选",type: "radio",prop: "radio",value: 1,options: [{ label: "选项一", value: 1 }, { label: "选项二", value: 2 }], rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: "下拉（多选）",type: "select-multiple",prop: "xiala",value:'',options: [{ label: "男", value: "0" }, { label: "女", value: "1" }]},
        {title: "说明", type: "textarea", prop: "textarea", value:'', rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: "兑奖权限", type: "switch", prop: "switch", value:'', options:[], rules: { required: true, validator: rules.checkEmail, trigger: 'blur' }},
        {title: "日期选择", type: "datepicker", prop: "date1", value: "",},
        {title: "日期选择range", type: "datepicker-range",prop: "date2",value: "",options: ["start", "end"]},
        {title: "时间", type: "datetime", prop: "date3", value: "",  },
        {title: "时间range",type: "datetime-range",prop: "date4",value: "",options: ["startTime", "endTime"]},
        {title: '多选', type:'checkbox',prop:'checkbox',value:[],options:[{label:'类型1',value:1},{label:'类型2',value:2},{label:'类型3',value:3}]}
      ],
      formData: {
        options: []
      },
      form: {

      },
    }
  },
  watch: {
    form:{
      handler(newValue,oldValue) {
        console.log('父组件表单变化', newValue)
        // this.$refs.form.validate();
        this.changeForm(newValue)
        // return newValue;
      },
      deep: true,
    },
  },
  created() {
    let form = {
          a:'',
          all:'',
          d:'',
          e:'', 
          test:'',
          uploadA:'',
          uploadB:'',
          radio:'',
          xiala:'',
          date1:'',
          date4:'',
          checkbox:''
        }
    this.form = form;
    this.formData.options = this.$formMethods.toggle(this.baseData, form) // 切换菜单
    this.getInsData()
  },
  methods: {
    change() {

    },
    submit() {
      const self = this;
      // self.$refs.baseForm.validate((val)=>{
      //   console.log(val)
      //   // self.createDevelopPlan();
      // });
    },
    uploadFileOther() {
      this.$formMethods.set(this.baseData, 'uploadA', 1); // 设置表单的值
    },
    handleRemove() {},
    changeForm(res) {
      // let clone = JSON.parse(JSON.stringify(this.form))
      // let res = this.$formMethods.get(val); // 获取表单的值
      console.log('获取表单的值', res)
      // this.$formMethods.set(val, 'c', 1); // 设置表单的值
      // console.log('设置的数据', data)
      // this.$refs.baseForm.resetForm()
      if(res.a=='1'){
        // let formA = {
        //       a:clone.a,
        //       all:clone.all,
        //       d:clone.d,
        //       e:clone.e, 
        //       test:clone.test,
        //       uploadA:clone.uploadA,
        //       uploadB:clone.uploadB,
        //       radio:clone.radio,
        //       xiala:clone.xiala,
        //       date1:clone.date1,
        //       date4:clone.date4,
        //       checkbox:clone.checkbox
        //     }
        // this.$set(this.form, date1, '')
        // this.$set(this.form, date4, '')
        this.form.date1 = '';
        this.form.date4 = '';
        this.$set(this.form, 'test', '')
        delete this.form.date3;
        delete this.form.date2;
        
        this.formData.options = this.$formMethods.toggle(this.baseData, this.form) // 切换菜单
        // console.log('切换的菜单',this.formData.options)
        // console.log('array', array)
      }else if(res.a=='2') {
        // let formB = {
        //       a:clone.a,
        //       status:clone.status,
        //       e:clone.e, 
        //       uploadA:clone.uploadA,
        //       uploadB:clone.uploadB,
        //       switch:clone.switch,
        //       textarea:clone.textarea,
        //       date2:clone.date2,
        //       date3:clone.date3,
        //       checkbox:clone.checkbox
        //     }
        // this.$set(this.form, date2, '')
        // this.$set(this.form, date3, '')
        this.form.date2 = '';
        this.form.date3 = '';
        delete this.form.date4;
        delete this.form.test;
        delete this.form.date1;
        // console.log('更新的表单', this.form)
        this.formData.options = this.$formMethods.toggle(this.baseData, this.form) // 切换菜单
        // console.log('切换的菜单',this.formData)
        // console.log('array', array)
      }
      // if(res.all) {
      //   // this.$set(this.baseData[3], 'value', val.b)
      //   if(res.all=='65') {
      //     // this.$formMethods.set(val, 'e', 'value', res.all)
      //     this.$formMethods.set(val, 'e', 'disabled', true)
      //   } else {
      //     // this.$formMethods.set(val, 'e', 'value', '')
      //     this.$formMethods.set(val, 'e', 'disabled', false)
      //   }
      // }
    },
    changeForms(form) {
      this.formData.options = this.$formMethods.setOptions(this.formData, form); // 设置表单的值
    },
    // 获取机构数据
    getInsData() {
      const self = this;
      const data = {};
      (async (data)=>{
				let res = await self.$api.QueryUserAndInsTree({data})
				if(res && res.code == 0) {
          console.log('res', res.data)
          self.$set(self.baseData[1], 'options', res.data)
          // self.formData[1].options = res.data;
          // self.cascaderOptions = res.data;
				} else {
          // self.$message.warning(res.msg)
        }
      })(data)
    },
  },
}
</script>

<style lang="less" scoped>

</style>
