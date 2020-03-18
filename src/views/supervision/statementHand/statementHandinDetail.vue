<template>
    <div id="statementHandinDetail">
        <div class="statementTop">
            <span class="title">报表上交详情</span>
            <div class="operation">
                <el-button  type="primary" size="small" @click="exportList">导出</el-button>
                <el-button  type="primary" size="small" @click="returnPage">返回</el-button>
            </div>
        </div>
        <div class="tableCont">
            <div class="tables">
                <table>
                    <thead>
                        <tr>
                            <th 
                                v-for="(item,ind) in  tableData.fieldNameList"
                                :key="ind">
                                <p>{{item}}</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(item,ind) in  tableData.fieldValueList"
                            :key="ind">
                            <td v-for="(res,kind) in  item" :key="kind">
                                {{res}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="pagination" v-show="resTotal>0">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageNum"
                layout="  prev, pager, next,sizes, jumper"
                :total="resTotal">
            </el-pagination>
        </div>
    </div>
</template>
<style>
    #statementHandinDetail{
        width: 100%;
    }
    #statementHandinDetail .statementTop{
        height: 42px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
    }
    #statementHandinDetail .statementTop .title{
        font-size: 14px;
        color: #444444;
        display: block;
        float: left;
        line-height: 42px;
        text-indent: 10px;
    }
    #statementHandinDetail .statementTop .operation{
        float: right;
        margin-top: 5px;
    }
    #statementHandinDetail .statementTop .operation span{
        display: block;
        width: 100%;
        height: 100%;
    }
    #statementHandinDetail .statementTop .operation a{
        color: #fff;
        display: block;
        width: 100%;
        height: 100%;
    }
    #statementHandinDetail .tableCont{
        width: 100%;
        overflow: hidden;
    }
    #statementHandinDetail .tables{
        overflow-x: auto;
        text-align: center;
       padding: 0 20px;
    }
    #statementHandinDetail .tables table{
        border: 1px solid #EBEEF5;
       
    }
    #statementHandinDetail .tables table thead{
        height: 48px;
        background: #f8f8f9;
        border-bottom: 1px solid #EBEEF5;
    }
    #statementHandinDetail .tables table thead tr{
        line-height: 30px;
        height: 30px;
    }
    #statementHandinDetail .tables table thead th{
        font-weight: normal;
        font-size: 14px;
        border-right: 1px solid #EBEEF5;
        white-space: normal;
        word-break: keep-all;
        padding: 0 10px;
    }
    #statementHandinDetail .tables table thead th:last-child{
        border-right: none;
    }
    #statementHandinDetail .tables table tbody tr{
        line-height: 30px;
        height: 30px;
        border-bottom: 1px solid #EBEEF5;
        background: #fff;
    }
    #statementHandinDetail .tables table tbody tr:hover{
        background: #f8f8f9;
    }
    #statementHandinDetail .tables table tbody td{
        font-weight: normal;
        font-size: 14px;
        border-right: 1px solid #EBEEF5;
        white-space: normal;
        word-break: keep-all;
        padding: 0 10px;
    }
    #statementHandinDetail .tables table tbody td:last-child{
        border-right: none;
    }
    #statementHandinDetail .pagination{
        text-align: center;
        margin-top: 5px;
    }
</style>
<script  type="text/javascript">
    export default {
        data() {
            return {
                currentPage4: 1,           //报表详情页码
                resTotal:0,                //报表总数
                pageSize:10,               
                pageNum:10,
                currentSize:1,
                currentIndex:0,
                tableData:{
                    fieldNameList: [
                        "模板名称",
                        "模板id",
                        "模板状态",
                        "创建时间"
                    ],
                    fieldValueList: [
                        [
                            "充值模板2",
                            "2",
                            "张三",
                            "2019-10-25"
                        ],
                        [
                            "充值模板",
                            "1",
                            "李四",
                            "2019-10-25"
                        ]
                    ]
                },
            }
        },
        mounted(){
            this.statementDetail();
        },
        methods:{
           async statementDetail(){   //获取报表详情方法
                let dateArr=this.$route.query;
                localStorage.getItem("staDetailPageSizeNum");
                let pageSizeNum=localStorage.getItem("staPageSizeNum");
                if(pageSizeNum!=undefined){
                    this.pageSize= pageSizeNum;
                    this.pageNum=Number(pageSizeNum);
                }

                let data={
                    beginTime:dateArr.beginTime,
                    endTime:dateArr.endTime,
                    templateId:dateArr.id,
                    pageSize: this.pageSize,
                    page: this.currentSize
                }
                //调用获取报表详情接口
                let res = await this.$api.getReportInfo({data});
                //根据返回值判断 
                if(res.status==true){
                   this.tableData=res.result;
                   this.resTotal=res.totalCounts;
                   this.currentIndex=(this.currentSize-1)*this.pageSize;
                }else{
                    this.message.error(res.errmsg)
                }
            },
            async exportList(){
                let queryData=this.$route.query;
                let res = await this.$api.getRepExport({
                        data: {
                                templateId:queryData.id,
                                templateName:queryData.name,
                                beginTime:queryData.beginTime,
                                endTime:queryData.endTime
                        },
                        responseType: "blob"
                    });
                var blob = new Blob([res.blob], {
                    type: "application/vnd.ms-excel;charset=utf-8"
                  });
                var url = window.URL.createObjectURL(blob);
                var aLink = document.createElement("a");
                aLink.style.display = "none";
                aLink.href = url;
                aLink.setAttribute("download", queryData.name+"报表.xls");
                document.body.appendChild(aLink);
                aLink.click();
                document.body.removeChild(aLink); //下载完成移除元素
                window.URL.revokeObjectURL(url); //释放掉blob对象
            },
            returnPage(){   //报表详情返回
                this.$router.push({path:'/home/externalSupervision/statementHandin'})
            },
            handleSizeChange(val) {  //切换报表详情显示条数
                this.pageSize=val;
                this.pageNum=val;
                localStorage.setItem("staDetailPageSizeNum",val);
                if(this.resTotal<this.pageSize*this.currentSize){
                    this.currentSize=Math.ceil(this.resTotal/this.pageSize);
                    this.currentPage4=Math.ceil(this.resTotal/this.pageSize);
                }
                this.statementDetail()
            },
            handleCurrentChange(val) {  //切换报表详情页码
                this.currentSize=val;
                this.statementDetail()
            }
        }
    }
</script>





