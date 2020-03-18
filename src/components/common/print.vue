<template>
  <div class="print-wrap">
    <el-button-group class="print-btn-wrap">
      <el-button type="primary" size="medium" icon="el-icon-printer" @click="print">打印</el-button>
      <el-button type="primary" size="medium" icon="el-icon-switch-button" @click="cancel">退出</el-button>
    </el-button-group>
    <div ref="print" class="print-content">
      <!-- <el-table :data="data.tableData"  border style="width: 100% border-color: #333;">
        <el-table-column type="index" label="序号" width="55px"></el-table-column>
        <el-table-column :prop="item.prop" :label="item.label" v-for="(item, index) in data.props" :key="index" :width="item.width"></el-table-column>
      </el-table> -->
      <h2 class="title">{{data.title}}</h2>
      <div class="print-box">
        <table class="print-table" border="1" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          <thead>
            <tr>
              <th v-for="(item, index) in data.props" :key="index" :width="item.width">{{item.label}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(items, indexs) in tableData" :key="indexs">
              <td v-for="(item, index) in items" :key="index" v-html="$xss(item)" :class="{'content-wrap':isActive}" style="text-align:center;"></td>
            </tr>
          </tbody>
        </table>
        <div class="printBottom" style="padding: 16px 10px 0 10px;text-align:right;font-size:12px;">
          <span>打印日期：{{printDate}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'print',
    props: {
      data: {
        type: Object,
        default: {},
      }
    },
    data() {
      return {
        printDate: '',
        tableData: [],
        isActive: false,
        newData: {},
        socket: null,
      }
    },
    watch: {
      'data': {
        handler (newVal, oldVal) {
          this.newData = {};
          Object.assign(this.newData, newVal);
          this.init(this.newData);
        },
        deep: true,
        immediate: true 
      },
    },
    created() {
      // this.init();
     
    },
    methods: {
      // 获取本地的打印机
      printerSocket() {
        const self = this;
        self.socket = new WebSocket("ws://127.0.0.1:8080/printer_list");
        console.log('socket', self.socket)

        //设置连接成功后的回调函数
        self.socket.onopen=function () {
          console.log("连接上打印机");
          let data = {
            jsonrpc: "2.0", 
            method: "printer_list", 
            id: 2
          };
          self.socket.send(JSON.stringify(data));
        };

        self.socket.onmessage = function(e){
          let data = JSON.parse(e.data);    // data就是要解析的接收到的JSON字符串
          if(data&&data.result.length>2) {
            self.$message.warning('该电脑已连接打印机')
            self.$print(self.$refs.print); // 使用
          }else{
            self.$message.warning('该电脑未连接打印机')
          }
          
        }
        //添加状态判断，当为OPEN时，发送消息
        // if (self.socket.readyState===1) {
        //   let data = {
        //     jsonrpc: "2.0", 
        //     method: "printer_list", 
        //     id: 2
        //   };
        //   self.socket.send(JSON.stringify(data));
        // }else{
        //   //do something
        //   self.$message.warning('未连接socket')
        // }
       
      },
      init (data) {
        this.isActive = data.title=='系统操作日志'?true:false;
        this.printDate = this.$moment(new Date()).format('YYYY-MM-DD');
        let propArray = [];
        data.props.forEach((item)=>{
          propArray.push(item.prop)
        })
        this.tableData = [];
        data.tableData.forEach((item, index)=>{
          item.index = index+1;
          let array = [];
          propArray.forEach((list)=>{
            array.push(item[list])
          })
          this.tableData.push(array)
        })
      },
      print() {
        // this.printerSocket()
        this.$print(this.$refs.print); // 使用
      },
      cancel() {
        this.newData = null;
        this.$emit('cancel')
      },
    },

  }
</script>

<style lang="less" scoped>

.print-wrap{
  text-align: right;
}
.print-btn-wrap{
  padding: 10px 0 0;
}
.table-print{
  text-align: center;
}
.print-content{
  text-align: center;
  padding: 0px 3% 0px;
}
.print-table{
  width: 100%;
}
.print-box{
  padding-top: 20px;
}
.title{
  font-size: 16px;
  padding-top: 40px;
}
table th{
  height: 36px;
  background-color: #f8f8f9;
  line-height: 1.5; 
  // td {
    font-size: 12px;
  // }
}
table tr td{
  padding: 5px;
  font-size: 12px;
  word-break: break-all;
}
.content-wrap{
  text-align: left;
}
.content-wrap>ul{
  padding-left: 20px;
  ul{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-left: 20px;
  }
  li{
    text-align: left;
    padding-right: 20px;
    flex: none;
    list-style-type: decimal;
  }
}
</style>
<style lang="less">
  .print-box {
    // width: 1042px;
  // margin: 20px auto;
 .el-table td, .el-table th.is-leaf,.el-table--border, .el-table--group{
  border-color: #333; 
}
.el-table--border::after, .el-table--group::after, .el-table::before{
  background-color: #333;
}
}
</style>