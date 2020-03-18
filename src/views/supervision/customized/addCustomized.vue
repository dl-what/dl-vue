<template>
    <div id="addCustomized">
        <div class="title">
            <span>模板定制新增</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="模板名称：" prop="templateName">
                <el-input size="small" v-model="ruleForm.templateName" maxlength="20" show-word-limit placeholder="请输入模板名称" @blur="templateChange($event)"></el-input>
            </el-form-item>
            <el-form-item label="数据源：" prop="tableCode">
                <el-radio-group v-model="ruleForm.tableCode" @change="changeSource($event)">
                    <el-radio :label="item.tableCode" v-for="(item,index) in sourceData" :key="index">{{item.tableName}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="监管内容：" prop="fieldList">
                <el-checkbox-group v-model="checkAll" >  
                    <el-checkbox :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
                    <span>最多选择12个</span>
                </el-checkbox-group>
                <el-checkbox-group v-model="ruleForm.fieldList" @change="handleCheckListChange">
                    <el-checkbox 
                        v-for="(res,ind) in superviseData"
                        :key="ind"
                        :label="res.fieldName" 
                        @change="checkBoxChange"
                        name="type">
                        {{res.fieldName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="选中内容：">
                <el-tag
                    v-for="(tag,index) in tagFieldList"
                    :key="index"
                    @close="handleClose(index)"
                    closable>
                        {{tag}}
                </el-tag>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
                <el-button type="primary" size="small" plain @click="resetForm('ruleForm')">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
    #addCustomized{
        width: 100%;
        padding: 0 20px;
    }
    #addCustomized .title{
        border-bottom: 1px solid #ccc;
        height: 36px;
        margin-bottom:30px;
    }
    #addCustomized .title span{
        display: block;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #444444;
    }
    #addCustomized .el-form .el-input{
        width: 350px;
    }
    #addCustomized .el-form .el-tag{
        margin-right: 10px;
    }
    #addCustomized .el-form .el-radio{
       margin:0 10px 10px 0;
        width: 270px;
    }
</style>
<script>
    export default {
        data() {
            return {
                ruleForm: {   //创建模板 定制表单
                    templateName: '',   //表单名称
                    tableCode: '',      //数据源
                    fieldList:[],       //监管内容
                    createTime:"",      //创建时间
                    createBy:"",        //创建者
                    lastModifyedTime:"", //最后修改时间
                    lastModifyedBy:"",   //最后修改人
                    state:"",             //状态
                }, 
                tagFieldList:[],        //选中内容 
                isIndeterminate:true,   //是否全选  
                checkAll:false,        //全选状态
                sourceData:[],        //数据源数组
                superviseData:[],   //监管内容数据数组
                rules: {     //表单验证
                    templateName: [
                        { required: true, message: '请输入模板名称', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                    ],
                    tableCode: [
                        { required: true, message: '请选择数据源', trigger: 'change' }
                    ],
                    fieldList:[
                        { type: 'array', required: true, message: '请至少选择一个监管内容', trigger: 'change' }
                    ],
                }
            };
        },
        created() {
            this.getSource()
        },
        mounted(){
        },
        methods: {
             async getSource(){    //异步获取数据源
                let res = await this.$api.getAllDataSource();
                if(res.status==true){
                    this.sourceData=res.result;
                }
            },
            async changeSource(val){   //数据源切换获取监管内容
                let data={
                    tableCode:val
                }; 
                let res = await this.$api.getTableContent({data});
                if(res.status==true){
                    this.superviseData=res.result;   //获取监管内容
                    this.ruleForm.fieldList=[];     //监管内容清空
                    this.tagFieldList=[];           //清空选中内容
                    this.checkAll=false;            //全选关闭
                }
            },
            handleCheckListChange(val){   //监管内容选择
                if(this.ruleForm.fieldList.length!=this.superviseData.length){
                    this.checkAll=false;
                }else if(this.ruleForm.fieldList.length==this.superviseData.length){
                     this.checkAll=true;
                }
            },
            handleCheckAllChange(val){    //是否全选切换
                this.ruleForm.fieldList = val ? this.superviseData : [];
                this.isIndeterminate = false;
                let listArr= this.ruleForm.fieldList;
                let fieldArr=[];
                for(var i=0;i<listArr.length;i++){
                    fieldArr.push(listArr[i].fieldName);
                };
                this.ruleForm.fieldList=fieldArr;
                this.tagFieldList=fieldArr;
            },
            checkBoxChange(val){
                this.tagFieldList=this.ruleForm.fieldList;
            },
            submitForm(formName) {   //模板定制保存验证判断
                this.$refs[formName].validate((valid) => {  //保存表单验证
                if (valid) {
                    let arr=this.ruleForm.fieldList;
                    let superviseArr=this.superviseData;
                    let selectData=[];
                    var fieldListArr=[];
                    //监管内容数量判断
                    if(arr.length>40){     
                        this.$message({
                            message: '监管内容最多选择40个',
                            type: 'warning'
                        });
                    }else{
                        for(let i=0; i<arr.length;i++){
                            for(let m=0;m<superviseArr.length;m++){
                                if(arr[i]==superviseArr[m].fieldName){
                                    selectData.push(superviseArr[m])
                                }
                            }
                        }
                        for(var j=0;j<selectData.length;j++){
                            let obj={
                                fieldCode:selectData[j].fieldCode,
                                fieldName:selectData[j].fieldName,
                                sort:j
                            };
                            fieldListArr.push(obj)
                        }
                        this.ruleForm.fieldList=fieldListArr;
                        //调用模板定制保存方法
                        this.Preservation()   
                    }
                } else {
                    //模板定制验证失败给出提示
                    this.$message.error('创建失败');
                    return false;
                }
                });
            },
            resetForm(formName) {   //取消模板定制的保存
                this.$refs[formName].resetFields();
                this.$router.push({path: '/home/externalSupervision/Customized'});
            },
            async Preservation(){   //模板定制保存方法
                var data=this.ruleForm;
                //创建模板定制调用接口
                let res = await this.$api.getSaveTemplate({data});  
                //根据接口返回值判断
                if(res.status==false){
                    if(res.errcode=='1002'){
                        var fieldListArr=[];
                        let fieldLists=this.ruleForm.fieldList;
                        for(var j=0;j< fieldLists.length;j++){
                            fieldListArr.push(fieldLists[j].fieldName)
                        }
                        this.ruleForm.fieldList=fieldListArr;
                    }
                    //创建失败给出接口返回提示
                    this.$message(res.errmsg);
                }else{
                    //创建成功给出提示
                    this.$message({
                      message: '模板创建成功',
                      type: 'success'
                    });
                  this.$router.push({path: '/home/externalSupervision/Customized'})
                }
            },
            handleClose(index){   //删除选中内容
                let arr=this.ruleForm.fieldList;
                arr.splice(index,1); 
            },
            templateChange(e){   //模板名称判断限制
                var patrn =new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                var tempVal=e.target.value;
                if (patrn.test(tempVal)) {
                    this.ruleForm.templateName="";
                    this.$message({
                        message: '模板名称不能包含特殊字符。',
                        type: 'warning'
                    });
                }
            }
        }
    }

</script>