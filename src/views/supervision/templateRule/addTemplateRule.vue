<template>
    <div id="addTemplateRule">
        <div class="title">
            <span>模板规则新增</span>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="模板名称：" prop="templateId">
                <el-select  size="small" class="inpWid" v-model="ruleForm.templateId" placeholder="请选择模板名称">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.templateName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

             <el-form-item label="规则名称：" prop="ruleName">
                <el-input  size="small" class="inpWid" v-model="ruleForm.ruleName" maxlength="20" show-word-limit placeholder="请输入规则名称" @blur="reluChange($event)"></el-input>
            </el-form-item>
            <el-form-item label="发送时间：" >
                <el-date-picker 
                    size="small"
                    type="datetime" 
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期" 
                    v-model="ruleForm.autoTime" 
                    :picker-options="pickerOptions"
                    style="width: 100%;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="发送间隔：" required>
                <el-col :span="18">
                    <el-form-item prop="autoInterval">
                        <el-input size="small" v-model="ruleForm.autoInterval" type="number" min="1" max="365"  placeholder="请输入有效时间间隔"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item prop="intervalUnit" class="mins">
                        <el-select size="small"  v-model="ruleForm.intervalUnit" placeholder="请选择单位">
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
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">保存</el-button>
                <el-button type="primary" size="small" plain @click="resetForm('ruleForm')">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
    #addTemplateRule{
        width: 100%;
        padding: 0 20px;
    }
    #addTemplateRule .title{
        border-bottom: 1px solid #ccc;
        height: 36px;
        margin-bottom:30px;
    }
    #addTemplateRule .title span{
        display: block;
        height: 36px;
        line-height: 36px;
        color: #444444;
        font-size: 14px;
    }
    #addTemplateRule .demo-ruleForm{
        width: 600px;
        /* margin: 0 auto ; */
    }
    #addTemplateRule .el-form .el-input{
        width: 350px;
    }
    #addTemplateRule .el-form .mins{
        width: 120px;
    }
    #addTemplateRule .el-form .mins .el-input{
        width: 120px;
    }
    #addTemplateRule .el-form .el-tag{
        margin-right: 10px;
    }
</style>
<script>
    export default {
        data() {
            return {
                pickerOptions: {    //判断创建时间
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
                options:[],           //模板名称数据
                ruleForm: {           //模板规则表单
                    ruleName:"",      //规则名称
                    templateId: '',   //模板id
                    autoTime:"",      //发送日期
                    autoInterval:"",     //时间间隔
                    intervalUnit:"日",   //单位
                    autoFlag:"1",
                },
                rules: {
                    ruleName: [
                        { required: true, message: '请输入规则名称', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                    ],
                    autoInterval:[
                        { required: true, message: '请输入有效时间间隔', trigger: 'blur' }
                    ],
                    templateId: [
                        { required: true, message: '请选择模板', trigger: 'change' }
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
            this.ruleForm.autoTime=this.getCurrentTime();
        },
        mounted(){
            
        },
        methods: {
            getCurrentTime(){ 
                //创建对象  
                var date = new Date();  
                //获取年份  
                var y = date.getFullYear(); 
                //获取月份  返回0-11     
                var m =date.getMonth()+1; 
                // 获取日   
                var d = date.getDate();
                //获取星期几  返回0-6   (0=星期天)   
                //var w = date.getDay();    
                //星期几
                //var ww = ' 星期'+'日一二三四五六'.charAt(date.getDay()) ;
                //时
                var h = date.getHours();
                //分  
                var minute = date.getMinutes() 
                //秒 
                var s = date.getSeconds(); 
                //毫秒
                //var sss = date.getMilliseconds() ;
                
                if(m<10){
                    m = "0"+m;
                }
                if(d<10){
                    d = "0"+d;
                }
                if(h<10){
                    h = "0"+h;
                }
                if(minute<10){
                    minute = "0"+minute;
                } 
                if(s<10){
                    s = "0"+s;
                }
                // if(sss<10){
                //     sss = "00"+sss;
                // }else if(sss<100){
                //     sss = "0"+sss;
                // }
                return y+"-"+m+"-"+d+" "+h+":"+minute+":"+s;  
            }, 
            getAllTemplate(){   //获取模板信息
                (async () => {
                    let res = await this.$api.getAllTemplate();   //调用获取模板接口
                    //根据接口返回值判断
                    if(res.status==true){
                        this.options=res.result;
                    }else{
                        this.message.error(res.errmsg)
                    }
                })();
            },
            submitForm(formName) {  //模板规则创建验证
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.Preservation();    
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            async Preservation(){    //模板规则创建方法
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
                let data=this.ruleForm;
                //调用模板规则保存接口
                let res = await this.$api.getSaveRule({data});
                //根据接口返回值判断。
               if(res.errcode=="1002"){
                    this.$message(res.data.errmsg);
                }else{
                    this.$router.push({path: '/home/externalSupervision/templateRule'})
                }
            },
            resetForm(formName) { //取消模板规则的创建
                this.$refs[formName].resetFields();
                this.$router.push({path: '/home/externalSupervision/templateRule'});
            },
            reluChange(e){  //规则名称判断
                var patrn =new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                var tempVal=e.target.value;
                if (patrn.test(tempVal)) {
                    this.ruleForm.ruleName="";
                    this.$message({
                        message: '规则名称不能包含特殊字符。',
                        type: 'warning'
                    });
                }
            },
        }
    }

</script>
