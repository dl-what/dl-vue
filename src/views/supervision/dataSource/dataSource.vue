<template>
    <div id='dataSource'>
        <div class="top">
            <span>数据源配置</span>
        </div>
        <div class="conter">
            <div class="sourceCont">
                <span class="title">数据源名称</span>
                <div class="sourceList">
                    <el-checkbox-group v-model="checkList">
                        <el-checkbox :label="tag.tableName" :key="index" v-for="(tag,index) in tagFieldList"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="operation">
                <el-button type="primary" size="small" @click="save">保存</el-button>
            </div>
        </div>
    </div>
</template>
<style scoped>
    #dataSource{
        width: 100%;
        padding: 0 20px;
    }
    #dataSource .top{
        margin-left: 10px;
        line-height: 36px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 20px;
    }
    #dataSource .top span{
        font-size: 14px;
        color: #444444;
    }
    #dataSource .conter{
        padding: 0 10px;
    }
    #dataSource .sourceCont{
        margin: 0 auto;
    }
    #dataSource .sourceCont .title{
        margin-bottom: 20px;
        display: block;
        font-size: 14px;
    }
    #dataSource .sourceCont .el-checkbox{
        margin:0 10px 10px 0;
        width: 270px;
    }
   
    #dataSource .operation{
        text-align: left;
    }
</style>
<script>
    //import https from '../../http.js'
    export default {
        data() {
            return {
               tagFieldList:"",
               checkList:[],
            }
        },
        created() {
        
        },
         mounted(){
            this.getSourceList()
            this.getSource();
        },
        methods: {
            getSourceList(){ //获取数据源数据
                (async () => {
                    //调用数据源接口
                    let res = await this.$api.getTableInfo();
                    //根据返回值判断
                    if(res.status==true){
                        this.tagFieldList=res.result;
                    }else{
                        this.$message.error(res.errmsg);
                    }
                })();
            },
            getSource(){     //获取选中的数据源
                (async () => {
                    let seft=this;
                    seft.checkList=[];
                    //调用数据源接口
                    let res = await this.$api.getAllDataSource();
                    //根据接口返回值判断 
                    if(res.status==true){
                        let data=res.result;
                        for(var i=0;i<data.length;i++){
                            if(data[i]!=null){
                                seft.checkList.push(data[i].tableName);
                            }
                        }
                    }else{
                        this.$message.error(res.errmsg);
                    }
                })();
                
            },
            save(){  //数据源保存
                (async () => {
                    let list=[];
                    let seft=this;
                    let dataList=seft.checkList;
                    let resData=seft.tagFieldList;
                    for(var m=0;m<resData.length;m++){
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i]==resData[m].tableName){
                                var  obj={
                                    tableCode:resData[m].tableCode,
                                    tableName:resData[m].tableName 
                                }
                                list.push(obj)
                            }
                        }
                    }
                    let res = await this.$api.saveSource({data:list});
                    if(res.status==true){
                        this.$message({
                          message: '保存成功!',
                          type: 'success'
                        });
                    }else{
                        this.$message.error(res.errmsg);
                    }
             })();
            }
        }
    }
</script>