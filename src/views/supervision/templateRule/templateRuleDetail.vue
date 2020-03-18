<template>
    <div id="templateRuleDetail">
        <div class="operation">
            <span class="title">模板规则详情</span>
            <el-button type="primary" size="small" @click="returnPage">返回</el-button>
        </div>
        <div class="ruleCont">
            <div class="contList">
                <div class="list">
                    <span>规则名称：</span>
                    <div class="text">{{ruleForm.ruleName}}</div>
                </div>
                <div class="list">
                    <span>模板名称：</span>
                    <div class="text">{{ruleForm.templateName}}</div>
                </div>
            </div>
            <div class="contList">
                <div class="list">
                    <span>发送间隔：</span>
                    <div class="text">{{ruleForm.autoInterval}}</div>
                </div>
                <div class="list">
                    <span>单位：</span>
                <div class="text">{{ruleForm.intervalUnit}}</div>
                </div>
            </div>
            <div class="contList">
                <div class="list">
                    <span>创建时间：</span>
                    <div class="text">{{ruleForm.createTime}}</div>
                </div>
                <div class="list">
                    <span>创建人：</span>
                    <div class="text">{{ruleForm.createBy}}</div>
                </div>
            </div>
            <div class="contList">
                <div class="list">
                    <span>发送时间：</span>
                    <div class="text">{{ruleForm.autoTime}}</div>
                </div>
            </div>
        </div>
        
    </div>
</template>
<style>
    #templateRuleDetail{
        width: 100%;
        padding: 0 20px;
    }
    #templateRuleDetail .operation{
        height: 40px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ccc;
    }
    #templateRuleDetail .operation .title{
        float: left;
        width: 220px;
        line-height: 40px;
        font-size: 14px;
        color: #444444;
    }
    #templateRuleDetail .operation .el-button{
        float: right;
        margin: 3px 2px 0 0;
    }
    #templateRuleDetail .operation a{
        color: #fff;
    }
   
    #templateRuleDetail .contList{
        width: 100%;
        font-size: 0;
        margin-bottom: 20px;
    }
    #templateRuleDetail .list{
       
        font-size: 0;
        width: 50%;
        display: inline-block;
    }
    #templateRuleDetail .list span{
        display: inline-block;
        font-size: 14px;
        color: #606266;
        line-height: 30px;
        width: 100px;
        text-align: right;
    }
    #templateRuleDetail .list .text{
        display: inline-block;
        font-size: 14px;
        color: #606266;
        line-height: 30px;
    }
    #templateRuleDetail .list .detail-list{
        display: inline-block;
    }
    #templateRuleDetail .list .detail-list p{
        font-size: 14px;
        color: #606266;
    }
</style>
<script>
    export default {
        data() {
            return {
                ruleForm: ""
            };
        },
        mounted(){
            this.getRuleDetail()
        },
        methods: {
            async getRuleDetail(){  //模板规则详情
                //获取模板规则id
                let param=this.$route.query.id;
                //调用详情接口
                let res = await this.$api.getRuleId({data:param});
                //根据接口返回值判断
                if(res.status==true){
                    this.ruleForm=res.result;
                }else{
                    this.message.error(res.errmsg)
                }
            },
            returnPage(){ //模板规则详情返回
                this.$router.push({path:'/home/externalSupervision/templateRule'})
            }
        }
    }

</script>









