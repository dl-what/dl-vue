<template>
    <div id="editTemplateRule">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="模板名称：" prop="templateId">
                <el-select v-model="ruleForm.templateId" placeholder="请选择模板名称">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.templateName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规则名称：" prop="ruleName">
                <el-input v-model="ruleForm.ruleName" maxlength="20" show-word-limit @blur="reluChange($event)" placeholder="请输入规则名称"></el-input>
            </el-form-item>
            <el-form-item label="发送时间：" >
                <el-date-picker 
                    type="datetime" 
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期" 
                    :picker-options="pickerOptions"
                    v-model="ruleForm.autoTime" 
                    style="width: 100%;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="发送间隔：" required>
                <el-col :span="11">
                    <el-form-item prop="autoInterval">
                        <el-input v-model="ruleForm.autoInterval" type="number" min="1" max="365" placeholder="请输入间隔时间"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item prop="intervalUnit">
                        <el-select v-model="ruleForm.intervalUnit" placeholder="请选择单位">
                            <el-option 
                                v-for="item in companyData"
                                :label="item.name"
                                :key="item.id" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                <el-button type="primary" plain @click="resetForm('ruleForm')">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
    #editTemplateRule{
        width: 600px;
        margin: 30px auto 0;
    }
    #editTemplateRule .el-form .el-input{
        width: 350px;
    }
    #editTemplateRule .el-form .el-tag{
        margin-right: 10px;
    }
</style>
<script>
    export default {
        data() {
            return {
                 pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    },
                },  
                companyData:[
                    {
                        name:"日/次",
                        id:"日",
                    },
                ],
                options:[],
                templateId:"",
                ruleForm: {
                    autoFlag: '1',
                    autoInterval: "",
                    autoTime: "",
                    createBy: "",
                    createTime: "",
                    id: null,
                    intervalUnit: "",
                    lastModifyedBy: "",
                    lastModifyedTime: "",
                    ruleName: "",
                    state: 1,
                    tableCode: null,
                    templateId: "",
                    templateName: "",
                    templateState: null,
                },
                rules: {
                    ruleName: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                    ],
                    templateId: [
                        { required: true, message: '请选择活动区域', trigger: 'change' }
                    ],
                    autoInterval:[
                        { required: true, message: '请输入时间间隔', trigger: 'blur' }
                    ],
                    
                    intervalUnit:[
                        { required: true, message: '请选择单位', trigger: 'change' }
                    ],
                    autoTime:[
                        { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                    ],
                }
            };
        },
        created() {
            this.getAllTemplate();
            this.getRuleDetail();
        },
        mounted(){
            
        },
        methods: {
            getAllTemplate(){//获取模板名称数据
                (async () => {
                    //调用模板名称接口
                    let res = await this.$api.getAllTemplate();
                    //根据接口返回值判断
                    if(res.status==true){
                        this.options=res.result;
                    }else{
                        this.message.error(res.errmsg);
                    }
                })();
            },
            async getRuleDetail(){   //获取模板规则详情
                let param=this.$route.query.id;
                let res = await this.$api.getRuleId({data:param});
                if(res.status==true){
                    let  ruleData=res.result;
                    let autoTime=ruleData.autoTime.split(".");
                    autoTime=autoTime.slice(0,1);
                    let actionTime=autoTime.join("");
                    let creatTime=ruleData.createTime.split(".");
                    creatTime=creatTime.slice(0,1);
                    let cTime=creatTime.join("");
                    let lastTime=ruleData.lastModifyedTime.split(".");
                    lastTime=lastTime.slice(0,1);
                    let lTime=creatTime.join("");
                    let createTime=ruleData.createTime.split(".");
                    let lastModifyedTime=ruleData.lastModifyedTime.split(".");
                    this.ruleForm.autoInterval=ruleData.autoInterval;
                    this.ruleForm.autoTime=actionTime;
                    this.ruleForm.createBy=ruleData.createBy;
                    this.ruleForm.createTime=cTime;
                    this.ruleForm.id=id;
                    this.ruleForm.intervalUnit=ruleData.intervalUnit;
                    this.ruleForm.lastModifyedBy= ruleData.lastModifyedBy,
                    this.ruleForm.lastModifyedTime= lTime,
                    this.ruleForm.ruleName=ruleData.ruleName;
                    this.ruleForm.state=ruleData.state;
                    this.ruleForm.tableCode=ruleData.tableCode,
                    this.ruleForm.templateId=ruleData.templateName;
                    this.templateId=ruleData.templateId;
                    this.ruleForm.templateName=ruleData.templateName;
                    this.ruleForm.templateState=ruleData.templateState;
                }else{
                    this.message.error(res.errmsg);
                }
            },
            submitForm(formName) {   //模板规则编辑验证
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Preservation()
                } else {
                     this.$message({
                        message: '请检查输入内容',
                        type: 'warning'
                    });
                    return
                }
                });
            },
            async Preservation(){   //模板规则编辑保存
                if(this.ruleForm.autoInterval*1>365){
                    this.$message({
                        message: '发送间隔不能大于365',
                        type: 'warning'
                    });
                    return
                }
                if(this.ruleForm.autoInterval*1<1){
                    this.$message({
                        message: '发送间隔不能小于1',
                        type: 'warning'
                    });
                    return
                }
                if(this.ruleForm.templateName==this.ruleForm.templateId){
                    this.ruleForm.templateId=this.templateId;
                }
                let data=this.ruleForm;
                //调用模板规则更新接口
                let res = await this.$api.updateRule({data});
                //根据接口返回值判断
                if(res.status==true){
                    this.$router.push({path: '/home/externalSupervision/templateRule'})
                }else{
                    this.$message.error(res.errmsg);
                }
            },
            resetForm(formName) {//取消模板规则的编辑
                this.$refs[formName].resetFields();
                this.$router.push({path: '/home/templateRule'});
            },
            reluChange(e){  //模板规则名称的验证
                var patrn =new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                var tempVal=e.target.value;
                if (patrn.test(tempVal)) {
                    this.ruleForm.ruleName="";
                    this.$message({
                        message: '规则名称不能包含特殊字符。',
                        type: 'warning'
                    });
                }
            }
        }
    }

</script>
