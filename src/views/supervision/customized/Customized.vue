<template>
    <div id="Customized">
        <div class="searchCont">
            <div class="list">
                <div class="Customized-list">
                    <span>模板名称：</span>
                    <el-input size="small" v-model="templateName" placeholder="请输入模板名称"></el-input>
                </div>
                <div class="Customized-list">
                    <span>使用状态：</span>
                    <el-select size="small" v-model="usedState" placeholder="请选择模板状态">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="list">
                <div class="Customized-list ">
                    <span>数据源：</span>
                    <el-select  size="small" v-model="tableCode"  placeholder="请选择数据源">
                        <el-option value="" label="全部">全部</el-option>
                        <el-option 
                            v-for="(item,index) in sourceData"
                            :key="index"
                            :label="item.tableName" 
                            :value="item.tableCode">
                            </el-option>
                    </el-select>
                </div>

                <div class="Customized-list ">
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
                <div class="Customized-list operation">
                    <el-button type="primary"  size="small" @click="searchCustomized">查询</el-button>
                    <el-button type="primary" size="small" plain @click="addCustomized">添加</el-button>
                </div>
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
                style="width: 100%"
                class="elTable">
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
                    prop="templateName"
                    label="模板名称"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="tableName"
                    label="数据源"
                    width="">
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
                    prop="usedState"
                    label="使用状态"
                    width="">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="操作"
                    width="220">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="customizedDetail(scope.row)"> 查看</el-button>
                        <el-button type="" size="mini" @click="editCustomized(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini" v-if="scope.row.usedState=='未使用'" @click="delCustomized(scope.row)">删除</el-button>
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
    #Customized{
        width: 100%;
    }
    #Customized .searchCont{
        font-size: 0;
        padding-top: 10px;
    }
    #Customized .list{
        margin-bottom: 15px;
    }
    #Customized .Customized-list{
        display: inline-block;
        margin-right: 10px;
    }
    #Customized .Customized-list span{
        font-size: 14px;
        display: inline-block;
        color: #333;
        width: 85px;
        text-align: center;
    }
    #Customized .Customized-list .el-select,
    #Customized .Customized-list .el-input{
        display: inline-block;
        width: 220px;
    }
    #Customized .tips-item{
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
    #Customized .tips-item em {
        color: #2d8cf0;
        font-style: normal;
        padding: 0 3px;
    }
    #Customized .tips-item i {
        vertical-align: middle;
        color: #2d8cf0;
        margin-right: 5px;
    }
    #Customized .tables{
        padding: 0 5px;
        margin-bottom: 20px;
    }
    #Customized .tables th{
        background-color: #f8f8f9;
        color: #333;
    }
    #Customized .tables .el-table tr{
        background: red;
    }
    #Customized .tables .el-table .cell{
        height: 40px;
    }
    #Customized .tables .el-button{
        float: left;
    }
    #Customized .tables .el-button span{
        display: block;
        width: 100%;
        height: 100%;
    }
    #Customized .tables .el-button a{
        color: #66b1ff;
        display: block;
        width: 100%;
        height: 100%;
    }
    #Customized .pagination{
        text-align: right;
    }
    #Customized .Customized-list .el-input input{
        height: 35px;
    }
</style>
<script>
    export default {
        data() {
            return {
                pickerOptions: {  //创建日期不能小于当前日期判断
                    disabledDate(time) {
                        return time.getTime() > Date.now() ;
                    },
                }, 
                isResult: false,    //搜索状态
                templateName:"",    //模板名称
                usedState:"",       //使用状态
                templateDate:[],    //创建时间
                currentPage4: 1,    //分页初始页码
                tableData: [],      //表格数据
                pageshow:true,      //分页显示状态
                tableCode:"",       //数据源
                pageTotal:0,        //数据总数
                pageSize:10,        //页面显示条数
                pageNum:1,          //第几页
                currentIndex:0,     //序号
                currentSize:1,      //切换页码
                sourceData:[],      //数据源数据  
                options: [           //状态数据
                    {
                        value: '',
                        label: '全部'
                    }, 
                    {
                        value: '2',
                        label: "已使用"
                    }, 
                    {
                        value: '1',
                        label: '未使用'
                    }, 
                ],
            }
        },
        created() {
            this.getSource();
            this.getCustomized();
        },
        mounted(){
        },
        methods: {
            getSource(){
                (async () => {
                    //获取数据源数据
                    let res = await this.$api.getAllDataSource();
                    if(res.status==true){
                        this.sourceData=res.result;
                    }
                })();
            },
            getCustomized(){   //获取模板定制列表
                (async () => {
                    let pageSizeNum=localStorage.getItem("pageSizeNum");
                    if(pageSizeNum!=undefined){//判断是否有页码
                        this.pageSize= pageSizeNum;
                        this.pageNum=Number(pageSizeNum);
                    }
                    let data={
                        pageSize:this.pageSize,
                        page:  this.currentSize
                    }
                    //调用获取模板定制列表接口
                    let res = await this.$api.getList({data});
                    //根据接口返回值判断
                    if(res.status==true){
                        this.tableData=res.result;
                        this.pageTotal=res.totalCounts;
                    }else{
                        this.$message.error(res.errmsg);
                    }
                })();
            },
            async searchCustomized(){  //模板定制查询
                let beginTime;
                let endTime;
                //处理创建日期
                if(this.templateDate!=undefined && this.templateDate.length>0){
                    beginTime=this.templateDate[0];
                    endTime=this.templateDate[1];
                }
                //根据模板定制状态重新赋值
                if(this.usedState==2){
                    this.usedState="已使用";
                }else if(this.usedState==1){
                    this.usedState="未使用";
                }
                //获取当前页码
                let pageSizeNum=localStorage.getItem("pageSizeNum");
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
                    templateName:this.templateName ,
                    usedState: this.usedState,
                    tableCode:this.tableCode,
                    beginTime:beginTime?beginTime:"",
                    endTime:endTime?endTime:"",
                    pageSize: this.pageSize,
                    page: this.currentSize
                }
                //调用模板定制列表接口
                let res = await this.$api.getList({data});
                //根据接口返回值判断
                if(res.status==true){
                    this.tableData=res.result;
                    this.pageTotal=res.totalCounts;
                    this.currentIndex=0;
                    this.isResult=true;
                }else{
                    this.$message.error(res.errmsg);
                }
                //让分页隐藏
                this.pageshow = false;
                //重新渲染分页
                this.$nextTick(() => {
                    this.pageshow = true;
                });
            },
            async changeCustomized(){   //页面操作获取表单数据
                let beginTime;
                let endTime;
                //处理创建日期
                if(this.templateDate!=undefined && this.templateDate.length>0){
                    beginTime=this.templateDate[0];
                    endTime=this.templateDate[1];
                }
                //根据模板定制状态值重新赋值
                if(this.usedState==2){
                    this.usedState="已使用";
                }else if(this.usedState==1){
                    this.usedState="未使用";
                }
                let currentPage=Math.ceil(this.pageTotal/this.pageSize);
                let pageSizeNum=localStorage.getItem("pageSizeNum");
                if(pageSizeNum!=undefined){
                    this.pageSize= pageSizeNum;
                    this.pageNum=Number(pageSizeNum);
                }
                let data={
                    templateName:this.templateName ,
                    usedState: this.usedState,
                    tableCode:this.tableCode,
                    beginTime:beginTime?beginTime:"",
                    endTime:endTime?endTime:"",
                    pageSize: this.pageSize,
                    page: this.currentSize
                }
                //调用模板定制列表接口
                let res = await this.$api.getList({data});
                //根据接口返回值
                if(res.status==true){
                    this.tableData=res.result;
                    this.pageTotal=res.totalCounts;
                    this.currentIndex=(this.currentSize-1)*this.pageSize;
                }else{
                    this.$message.error(res.errmsg);
                }
            },
            addCustomized(){   //模板定制创建
                this.$router.push({path: '/home/externalSupervision/addCustomized'})
            },
            async delCustomized(result){   //模板定制删除
                let seft=this;
                seft.$confirm('此操作将永久删除"'+result.templateName+'"模板, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        (async () =>{
                            //获取模板定制id
                            let param=result.id;
                            //调用删除接口
                            let res = await seft.$api.deleteTemplate({data:param});
                            //根据接口返回值判断
                            if(res.status==true){
                                seft.$message({
                                  message: '模板删除成功',
                                  type: 'success'
                                });
                                seft.getCustomized()
                            }else{
                                this.$message.error(res.errmsg);
                            }
                        })()
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                });
            },
            customizedDetail(data){  //模板定制详情
                this.$router.push({path:'/home/externalSupervision/customizedDetail',query:{id:data.id,state:data.usedState}})
            },
            editCustomized(data){   //模板定制编辑
                this.$router.push({path:'/home/externalSupervision/editCustomized',query:{id:data.id}})
            },
            handleSizeChange(val) {  //页面条数切换
                this.pageSize=val;
                this.pageNum=val;
                localStorage.setItem("pageSizeNum",val);
                if(this.pageTotal<this.pageSize*this.currentSize){
                    this.currentSize=Math.ceil(this.pageTotal/this.pageSize);
                    this.currentPage4=Math.ceil(this.pageTotal/this.pageSize);
                }
                this.changeCustomized();
            },
            handleCurrentChange(val) {  //页码切换
                this.currentSize=val;
                this.changeCustomized();
            },
            
        }
    }
</script>