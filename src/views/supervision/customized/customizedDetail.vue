<template>
    <div id="customizedDetail">
        <div class="operation">
            <span class="title">模板定制详情</span>
            <el-button size="small" type="primary" @click="returnPage">返回</el-button>
        </div>
        <div class="customized_list">
            <div class="list">
                <span>模板名称：</span>
                <div class="text">{{ruleForm.templateName}}</div>
            </div>
            <div class="list">
                <span>数据源：</span>
                <div class="text">{{ruleForm.tableName}}</div>
            </div>
            <div class="list">
                <span>监管内容：</span>
                <div class="detail-list">
                    <el-tag 
                        v-for="(item,ind) in ruleForm.fieldList"
                        :title="item.fieldName"
                        :key="ind">
                        {{item.fieldName}}
                    </el-tag>
                </div>
            </div>
            <div class="list">
                <span>选中内容：</span>
                <div class="detail-list">
                    <el-tag 
                        v-for="(item,ind) in ruleForm.fieldList"
                        :title="item.fieldName"
                        :key="ind">
                        {{item.fieldName}}
                    </el-tag>
                </div>
            </div>
            <div class="list">
                <span>使用状态：</span>
                <div class="text" >{{stateText}}</div>
            </div>
        </div>
        
    </div>
</template>
<style>
    #customizedDetail{
        width: 100%;
        padding: 0 20px; 
    }
    #customizedDetail .operation{
        width: 100%;
        height: 40px;
        margin-bottom: 30px;
        border-bottom: 1px solid #ccc;
    }

    #customizedDetail .operation .title{
        float: left;
        width: 220px;
        line-height: 40px;
         font-size: 14px;
        color: #444444;
    }
    #customizedDetail .operation a{
        color: #fff;
        display: block;
        width: 100%;
        height: 100%;
    }
    #customizedDetail .operation .el-button{
        float: right;
         margin: 3px 2px 0 0;
    }
    #customizedDetail .operation .customized_list{
        /* width: 800px;
        text-align: center; */
        margin: 0 auto;
    }
    #customizedDetail .list{
        margin-bottom: 20px;
        font-size: 0;
    }
    #customizedDetail .list span{
        display: inline-block;
        font-size: 14px;
        color: #606266;
        line-height: 30px;
        width: 100px;
        text-align: right;
    }
    #customizedDetail .list .text{
        display: inline-block;
        font-size: 14px;
        color: #606266;
        line-height: 30px;
    }
    #customizedDetail .list .detail-list{
        display: inline-block;
    }
    #customizedDetail .list .detail-list .el-tag{
        font-size: 14px;
        color: #606266;
        margin:0 10px 10px 0;
        overflow: hidden;
        text-overflow:ellipsis;
        text-align: center;
    }
</style>
<script>
    export default {
        data() {
            return {
                ruleForm: "",  //模板定制详情数据
                stateText:"",  //模板定制状态
            };
        },
        mounted(){
            this.getCustomized()
        },
        methods: {
            getCustomized(){  //模板定制详情
                (async () => {
                    //获取模板定制id
                    let param=this.$route.query.id;
                    this.stateText=this.$route.query.state;
                    //调用模板定制详情
                    let res = await this.$api.getById({data:param});
                    //根据返回值判断
                    if(res.status==true){
                        this.ruleForm=res.result;
                    }else{
                        this.$message.error(res.errmsg);
                    }
                })();
            },
            returnPage(){  //模板定制详情返回
                this.$router.push({path:'/home/externalSupervision/Customized'})
            }
            
        }
    }

</script>
