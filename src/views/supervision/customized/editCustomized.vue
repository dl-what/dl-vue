<template>
    <div id="editCustomized">
        <div class="title">
            <span>模板定制编辑</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="模板名称：" prop="templateName">
                <el-input size="small" v-model="ruleForm.templateName" maxlength="20" show-word-limit @blur="templateChange($event)"   placeholder="请输入模板名称"></el-input>
            </el-form-item>
            <el-form-item label="数据源：" prop="tableCode">
                <el-radio-group v-model="ruleForm.tableCode" @change="changeSource($event)">
                    <el-radio :label="item.tableCode" v-for="(item,index) in sourceData" :key="index">{{item.tableName}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="监管内容：" prop="fieldList">
                 <el-checkbox-group v-model="checkAll">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                     <span>最多选择12个</span>
                </el-checkbox-group>
                <el-checkbox-group v-model="ruleForm.fieldList" @change="handleCheckListChange">
                    <el-checkbox 
                        v-for="(res,ind) in superviseData"
                        :key="ind"
                        @change="checkBoxChange"
                        :label="res.fieldName" 
                        name="type">
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="选中内容：" >
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
    #editCustomized{
        width: 100%;
        padding: 0 20px;
    }
    #editCustomized .title{
        border-bottom: 1px solid #ccc;
        height: 36px;
        margin-bottom:30px;
    }
    #editCustomized .title span{
        display: block;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #444444;
    }
    #editCustomized .el-form .el-input{
        width: 350px;
    }
    #editCustomized .el-form .el-tag{
        margin-right: 10px;
    }
   #editCustomized  .el-form .el-radio{
        margin:0 10px 10px 0;
        width: 270px;
    }

</style>
<script>
    export default {
        data() {
            return {
                custId:"",                 //模板定制id
                ruleForm: {
                    id:"",                 //模板定制id
                    templateName: "",      //模板定制名称
                    tableCode: "",         //数据源
                    fieldList:[],          //监管内容
                    createTime:"",         //创建时间
                    createBy:"",           //创建人
                    lastModifyedTime:"",   //最后修改时间
                    lastModifyedBy:"",     //最后修改人
                    state:"",              //状态
                },
                tagFieldList:[],           //选中内容
                isIndeterminate:true,      //
                checkAll:false,            //全选状态
                sourceData:[],            //数据源数组
                superviseData:[],        //监管内容数据数组
                resourceState:"已发布",  //发布状态
                selectData:[],           //选中内容
                rules: {
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
        created(){
            this.getSource();
        },
        mounted(){
            this.getCustomized()
        },
        methods: {
            async getSource(){  //获取数据源方法
                //调用数据源接口 
                let res = await this.$api.getAllDataSource();
                //根据返回值判断
                if(res.status==true){
                    this.sourceData=res.result;
                }else{
                    this.$message.error(res.errmsg);
                }
            },
            async changeSource(val){ //数据源切换
                this.ruleForm.fieldList=[];
                this.tagFieldList=[];
                this.checkAll=false;
                let data={
                    tableCode:val
                }; 
                //调用获取监管内容接口
                let res = await this.$api.getTableContent({data});
                //根据接口返回值判断
                if(res.status==true){
                    this.superviseData=res.result;
                }else{
                    this.$message.error(res.errmsg);
                }
            },
            handleCheckListChange(val){   //判断全选状态
                if(this.ruleForm.fieldList.length!=this.superviseData.length){
                    this.checkAll=false;
                }else if(this.ruleForm.fieldList.length==this.superviseData.length){
                     this.checkAll=true;
                }
            },
            handleCheckAllChange(val){ //全选监管内容
                this.ruleForm.fieldList = val ? this.superviseData : [];
                this.isIndeterminate = false;
                let listArr= this.ruleForm.fieldList;
                let fieldArr=[];
                for(var i=0;i<listArr.length;i++){
                    fieldArr.push(listArr[i].fieldName)
                };
                this.ruleForm.fieldList=fieldArr;
                this.tagFieldList=fieldArr;
            },
            checkBoxChange(){//监管内容选择
                this.tagFieldList=this.ruleForm.fieldList;
            },
            async getCustomized(){   //获取模板定制详情
                let param=this.$route.query.id;
                this.custId=this.$route.query.id;
                let res = await this.$api.getById({data:param});
                if(res.status==true){
                    let resultData=res.result;
                    this.ruleForm.templateName=resultData.templateName;
                    this.ruleForm.tableCode= resultData.tableCode;
                    this.ruleForm.createTime=resultData.createTime;
                    this.ruleForm.createBy=resultData.createBy;
                    this.ruleForm.lastModifyedTime=resultData.lastModifyedTime;
                    this.ruleForm.lastModifyedBy=resultData.lastModifyedBy;
                    this.ruleForm.state=resultData.state;
                    this.changeSource(resultData.tableCode)
                    
                    let selectArr=resultData.fieldList;
                    for(let i=0;i<selectArr.length;i++){
                        this.ruleForm.fieldList.push(selectArr[i].fieldName);
                        this.tagFieldList.push(selectArr[i].fieldName);
                    }
                }
            },
            submitForm(formName) {  //模板定制编辑验证
                this.$refs[formName].validate((valid) => {   //模板定制表单验证
                    if (valid) {
                        let arr=this.ruleForm.fieldList;
                        let superviseArr=this.superviseData;
                        let fieldListArr=[];
                        let selectData=[];
                        if(arr.length>40){
                            this.$message({
                                message: '监管内容最多选择40个',
                                type: 'warning'
                            });
                            return
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
                            this.ruleForm.id=this.custId;
                            this.ruleForm.fieldList=fieldListArr;
                            this.Preservation()
                        }
                    } else {
                         this.$message.error("请检查输入内容");
                        return false;
                    }
                });
            },
            async Preservation(){  //模板定制编辑保存
                let data=this.ruleForm;
                let res = await this.$api.updateTemplate({data});
                if(res.status==false){
                    if(res.errcode=="1002"){
                        let fieldListArr=[];
                        let fieldLists=this.ruleForm.fieldList;
                        for(var j=0;j< fieldLists.length;j++){
                            fieldListArr.push(fieldLists[j].fieldName)
                        }
                        this.ruleForm.fieldList=fieldListArr;
                    }
                    this.$message(res.errmsg);
                }else{
                     this.$message({
                      message: '模板创建成功',
                      type: 'success'
                    });
                    this.$router.push({path: '/home/externalSupervision/Customized'})
                }
            },
            resetForm(formName) {   //取消保存
                this.$router.push({path:'/home/externalSupervision/Customized'});
            },
            handleClose(index){    //删除选中内容
                let arr=this.ruleForm.fieldList;
                let tagArr=this.tagFieldList;

                arr.splice(index,1); 
                tagArr.splice(index,1); 
            },
            templateChange(e){    //模板名称验证
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