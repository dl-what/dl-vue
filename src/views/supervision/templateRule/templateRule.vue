<template>
    <div id="templateRule">
        <div class="searchCont">
            <div class="templateRule-list">
                <span>规则名称：</span>
                <el-input size="small" v-model="ruleName" placeholder="请输入规则名称"></el-input>
            </div>
            <div class="templateRule-list">
                <span>模板名称：</span>
                <el-input size="small" v-model="templateName" placeholder="请输入模板名称"></el-input>
            </div>
            <div class="templateRule-list ">
                <span>创建时间：</span>
                <el-date-picker
                    size="small"
                    v-model="templateDate"
                    :picker-options="pickerOptions"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
            <div class="templateRule-list operation">
                <el-button type="primary" size="small" @click="searchTemplateRule">查询</el-button>
                <el-button type="primary" size="small" plain @click="addTemplateRule">添加</el-button>
            </div>
        </div>
        <p class="tips-item" v-if="isResult">
          <i class="el-alert__icon el-icon-info"></i>
          <span>
            共搜索到
            <em>{{pageTotal}}</em>条数据
          </span>
        </p>
        <div class="tables">
            <el-table
                :data="tableData"
                :header-cell-style="{background:'#f8f8f9',color:'#333'}"
                border
                style="width: 100%">
                <el-table-column
                    align="center"
                    label="序号"
                    width="60">
                    <template slot-scope="scope">
                        {{currentIndex+scope.$index+1}} 
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="ruleName"
                    label="规则名称"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="templateName"
                    label="模板名称"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="autoTime"
                    label="发送时间"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="autoInterval"
                    label="发送间隔"
                    width="100">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="intervalUnit"
                    label="单位"
                    width="60">
                </el-table-column>
               
                <el-table-column
                    align="center"
                    prop="createTime"
                    label="创建时间"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="createBy"
                    label="创建人"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="ruleDetail(scope.row)"> 查看</el-button>
                        
                        <el-button type="danger" size="mini" @click="delectRule(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination" v-show="pageTotal>0 && pageshow">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage4"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageNum"
                layout="total,prev, pager, next,sizes, jumper"
                :total="pageTotal">
            </el-pagination>
        </div>
    </div>
</template>
<style  scoped>
    #templateRule{
        width: 100%;
    }
    #templateRule .searchCont{
        font-size: 0;
        padding-top: 10px;
        margin-bottom: 10px;
    }
    #templateRule .searchCont .list{
        margin-bottom: 15px;
    }
    #templateRule .templateRule-list{
        display: inline-block;
    }
    #templateRule .templateRule-list span{
        font-size: 14px;
        display: inline-block;
        color: #333;
        width: 80px;
        text-align: center;
    }
    .operation{
        margin-left: 5px;
    }
    #templateRule .templateRule-list .el-select,
    #templateRule .templateRule-list .el-input{
        display: inline-block;
        width: 150px;
    }
    #templateRule .tips-item{
        height: 34px;
        line-height: 34px;
        background-color: #f0faff;
        border: 1px solid #abdcff;
        font-size: 12px;
        color: #515a6e;
        border-radius: 4px;
        padding: 0 10px;
        margin: 10px 0 0;
        display: flex;
        align-items: center;
        margin: 0 20px 10px ;
    }
    #templateRule .tips-item em {
        color: #2d8cf0;
        font-style: normal;
        padding: 0 3px;
    }
    #templateRule .tips-item i {
        vertical-align: middle;
        color: #2d8cf0;
        margin-right: 5px;
    }
    #templateRule .tables{
        padding: 0 5px;
        margin-bottom: 20px;
    }
    #templateRule .tables th{
        background-color: #f8f8f9;
        color: #333;
    }
    #templateRule .tables .el-button{
        float: left;
    }
    #templateRule .tables .el-button a{
        color: #66b1ff
    }
    #templateRule .pagination{
        text-align: right;
    }
</style>
<script>
    export default {
        data() {
            return {
                pickerOptions: {     //判断创建
                    disabledDate(time) {
                        return time.getTime() > Date.now() ;
                    },
                },
                ruleName:"",                       //规则名称
                templateName:"",                   //模板名称
                templateDate:"",                   //创建日期
                currentPage4: 1,                   //初始页码
                pageTotal:0,                       //数据总数
                currentIndex:0,                    //
                pageNum:10,                        //页面条数
                tableData: [],                     //模板规则列表数据
                pageSize:10,                      
                currentSize:1,
                pageshow:true,
                isResult:false
            }
        },
        created() {
        
        },
        mounted(){
            this.getTemplateRule()
        },
        methods: {
            async getTemplateRule(){
                let pageSizeNum=localStorage.getItem("temPageSizeNum");
                if(pageSizeNum!=undefined){
                    this.pageSize= pageSizeNum;
                    this.pageNum=Number(pageSizeNum);
                }
                let data={
                    pageSize:this.pageSize,
                    page:  this.currentSize
                }
                let res = await this.$api.getRuleList({data});
                if(res.status==true){
                    this.tableData=res.result;
                    this.pageTotal=res.totalCounts;
                    this.currentIndex=(this.currentSize-1)*this.pageSize;
                }else{
                    this.message.error(res.errmsg)
                }
            },
            async searchTemplateRule(){    //模板规则查询
                if(this.templateDate==null){
                    this.templateDate=[];
                }
                //获取操作的页面条数
                let pageSizeNum=localStorage.getItem("temPageSizeNum");
                if(pageSizeNum!=undefined){
                    this.pageSize= pageSizeNum;
                    this.pageNum=Number(pageSizeNum);
                }
                let currentPage=Math.ceil(this.pageTotal/this.pageSize);
                if(currentPage == this.currentSize){
                    this.currentSize=1;
                    this.currentPage4=1;
                }
                let data={
                    ruleName:this.ruleName,
                    templateName: this.templateName,
                    beginTime: this.templateDate[0]?this.templateDate[0]:"",
                    endTime: this.templateDate[1]?this.templateDate[1]:"",
                    pageSize:this.pageSize,
                    page: this.currentSize
                }
                //调用模板规则列表接口
                let res = await this.$api.getRuleList({data});
                //根据接口返回值判断
                if(res.status==true){
                    this.tableData=res.result;
                    this.pageTotal=res.totalCounts;
                    this.currentIndex=(this.currentSize-1)*this.pageSize;
                    this.isResult=true;
                }else{
                    this.message.error(res.errmsg)
                }
                //让分页隐藏
                this.pageshow = false;
                //重新渲染分页
                this.$nextTick(() => {
                    this.pageshow = true;
                });
            },
            async changeTemplateRule(){  //页面操作公共方法
                if(this.templateDate==null){
                    this.templateDate=[];
                }
                //获取操作的页面条数
                let pageSizeNum=localStorage.getItem("temPageSizeNum");
                if(pageSizeNum!=undefined){
                    this.pageSize= pageSizeNum;
                    this.pageNum=Number(pageSizeNum);
                }
                let data={
                    ruleName:this.ruleName,
                    templateName: this.templateName,
                    beginTime: this.templateDate[0]?this.templateDate[0]:"",
                    endTime: this.templateDate[1]?this.templateDate[1]:"",
                    pageSize:this.pageSize,
                    page: this.currentSize
                }
                //调用模板规则列表接口
                let res = await this.$api.getRuleList({data});
                //根据接口返回值判断
                if(res.status==true){
                    this.tableData=res.result;
                    this.pageTotal=res.totalCounts;
                }else{
                    this.message.error(res.errmsg)
                }
            },
            delectRule(result){  //模板规则删除
                let seft=this;
                this.$confirm('此操作将永久删除"'+result.ruleName+'"规则, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                     cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        (async ()=>{
                            let param=result.id;
                            //调用模板规则删除
                            let res = await this.$api.deleteRule({data:param});
                            //根据返回值判断
                            if(res.status==true){
                                seft.$message({
                                  message: '规则删除成功',
                                  type: 'success'
                                });
                                this.getTemplateRule()
                            }else{
                                seft.message.error(res.errmsg)
                            }
                        })()
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                });
            },
            addTemplateRule(){ //创建模板规则方法
                 this.$router.push({path:'/home/externalSupervision/addTemplateRule'});
            },
            ruleDetail(data){  //模板规则详情方法
                this.$router.push({path:'/home/externalSupervision/templateRuleDetail',query:{id:data.id}});
            },
            ruleEdit(data){//模板规则编辑方法
                this.$router.push({path:'/home/externalSupervision/editTemplateRule',query:{id:data.id}});
            },
            handleSizeChange(val) {   //切换页面条数
                this.pageSize=val;
                this.pageNum=val;
                localStorage.setItem("temPageSizeNum",val);
                if(this.pageTotal<this.pageSize*this.currentSize){
                    this.currentSize=Math.ceil(this.pageTotal/this.pageSize);
                    this.currentPage4=Math.ceil(this.pageTotal/this.pageSize);
                }
                //调用公共方法
                this.changeTemplateRule();  
            },
            handleCurrentChange(val) {   //切换页码
                this.currentSize=val;
                //调用公共方法
                this.changeTemplateRule();
            }
        }
    }
</script>