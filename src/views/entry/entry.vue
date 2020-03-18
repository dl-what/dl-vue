<template>
  <div class="entry-container">
    <div class="entry-hd">
      <div class="hd-logo">
        <span class="ct">
          <span class="logo-box">
            <i class="iconfont icon-B-fulicaipiao"></i>
          </span>
          <strong class="name">{{title}}</strong>
        </span>
      </div>
      <admin-info></admin-info>
    </div>
    <div class="entry-bd">
      <ul class="entry-list">
        <li @click="toHome(item.name, item.extendAttach)" v-for="(item, index) in entryList" :key="index">
          <dl>
            <dt class="iconfont" :class="[item.icon]"></dt>
            <dd>{{item.name}}</dd>
          </dl>
        </li>
      </ul>
      <el-row class="msg-con">
        <el-col :span="12" class="msg-bd">
          <div class="grid-content">
            <div class="heading">
              <p class="msg-tips">
                您有 <em class="red">{{todoList.length}}</em> 条 需处理待办
                <span class="el-icon-refresh refresh" @click="getTodoList('refresh')"></span>
              </p>
              <span class="title">我的待办</span>
            </div>
            <ul class="msg-list" v-if="todoList.length">
              <li class="list-dot dot-red" v-for="(item, index) in todoList" :key="index">
                <p @click="to('myToDo')">{{item.title}}</p>
              </li>
            </ul>
            <p class="no-data" v-else>暂无数据</p>
          </div>
        </el-col>
        <el-col :span="12" class="msg-bd">
          <div class="grid-content">
            <div class="heading">
              <p class="msg-tips">
                <!-- 您有 <em class="orange">{{notifyList.length}}</em> 条 需处理待办 -->
                <span class="el-icon-refresh refresh" @click="getMyNotifyList('refresh')"></span>
              </p>
              <span class="title">我的知会</span>
            </div>
            <ul class="msg-list" v-if="notifyList.length">
              <li class="list-dot dot-orange" v-for="(item, index) in notifyList" :key="index">
                <p @click="to('myKnowledge')">{{item.title}}</p>
              </li>
            </ul>
            <p class="no-data" v-else>暂无数据</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <lock-mask></lock-mask>
  </div>
</template>

<script>
import adminInfo from '@/components/main/adminInfo'
import lockMask from '@/components/main/lockMask'
import {mapActions, mapGetters} from 'vuex'
import menuList from '@/libs/menu/'

export default {
  name: 'entry',
  data() {
    return {
      title: '视频彩票运营管理平台',
      entryList: [],
      todoList: [],
      notifyList: [],
    }
  },
  computed: {
    ...mapGetters(['menuData'])
  },
  created() {
    this.getMyNotifyList();
    this.getTodoList();
    // 初始化系统模块列表
    this.init();
  },
  watch: {
    menuData: {
      handler(val) {
        val.length && this.init()
      },
      deep: true
    }
  },
  // methods: {
  //   init() {
  //     this.entryList = [];

  //     this.menuData && this.menuData[0].children.forEach(item => {
  //       if (item.extendAttach) {
  //         this.entryList.push({
  //           name: item.text,
  //           extendAttach: item.extendAttach,
  //           icon: item.iconCls || 'el-icon-menu'
  //         })
  //       }
  //     })
  //   },
  //   async getMenuList() {
  //     let res = await this.$api.QueryModuleTree();
  //     if(res && res.code  === 0) {
  //       this.menuData = res.data;
  //       if (!this.menuData) {
  //         return;
  //       }
  //       this.menuData[0].children.forEach(item => {
  //         if (item.extendAttach) {
  //           this.entryList.push({
  //             name: item.text,
  //             extendAttach: item.extendAttach,
  //             icon: item.iconCls || 'el-icon-menu'
  //           })
  //         }
  //       })

  //     }
  //   },
  //   async getChartUserInfo() {
  //     const res = await this.$api.getChartUserInfo({
  //       data: {}
  //     });
  //     if (res && res.code === 0) {
  //       this.$router.push({name: 'centerWatch'});
  //     }
  //   },
  //   toHome(title, extendAttach) {
  //     this.setEntry({
  //       title,
  //       extendAttach
  //     })
  //     let list;
  //     this.menuData[0].children.forEach(item => {
  //       if (item.extendAttach  === extendAttach) {
  //         list = item.children[0].children;
  //       }
  //     })
  //     let name;
  //     // 系统管理
  //     if(extendAttach == 'systemManage') {
  //       name = 'dataDictionary'
  //     }
  //     // 业务管理
  //     if(extendAttach == 'businessManage') {
  //       name = 'overview'
  //     }
  //     // 业务运营
  //     if(extendAttach == 'businessOperation') {
  //       name = 'overviews'
  //     }
  //     // 客服管理
  //     if(extendAttach == 'serviceSystem') {
  //       name = 'workOrderList'
  //     }
  //     // 业务监控
  //     if(extendAttach == 'businessCharts') {
  //       name = 'centerWatch'
  //     }
  //     if(name=='centerWatch') {
  //       this.getChartUserInfo()
  //     }
  //     if(extendAttach == 'externalSupervision')
  //     {
  //       name = 'Customized'
  //       // console.log(name,extendAttach)
  //       this.$router.push({name})
  //     }
  //     else{
        
  //       this.$router.push({name})
  //     }
  //   },
  //   to(name) {
  //     this.toHome(this.entryList[0].name, this.entryList[0].extendAttach);
  //     this.$router.push({
  //       name
  //     })
  //   },
  //   ...mapActions(['setEntry'])
  // },
  methods: {
    init() {
      this.entryList = [];
      this.menuData && this.menuData[0].children.forEach(item => {
        if (item.extendAttach) {
          this.entryList.push({
            name: item.text,
            extendAttach: item.extendAttach,
            icon: item.iconCls || 'el-icon-menu'
          })
        }
      })
    },
    async getMenuList() {
      let res = await this.$api.QueryModuleTree();
      if(res && res.code  === 0) {
        this.menuData = res.data;
        if (!this.menuData) {
          return;
        }
        this.menuData[0].children.forEach(item => {
          if (item.extendAttach) {
            this.entryList.push({
              name: item.text,
              extendAttach: item.extendAttach,
              icon: item.iconCls || 'el-icon-menu'
            })
          }
        })

      }
    },
    async getTodoList(flag) {
      const res = await this.$api.getTaskTodo({
        data: {
          page: 1,
          pageSize: 3
        }
      });
      if (res && res.code === 0) {
        this.todoList = res.data.records || [];
        if(flag=='refresh') {
          this.$message.success('数据已刷新')
        }
      }
    },
    async getMyNotifyList(flag) {
      const res = await this.$api.getMyNotify({
        data: {
          page: 1,
          pageSize: 3
        }
      });
      if (res && res.code === 0) {
        this.notifyList = res.data.records || [];
        if(flag=='refresh') {
          this.$message.success('数据已刷新')
        }
      }
    },
    toHome(title, extendAttach) {
      this.setEntry({
        title,
        extendAttach
      })
      let list;
      this.menuData[0].children.forEach(item => {
        if (item.extendAttach  === extendAttach) {
          list = item.children&&item.children[0].children;
        }
      })
      let name;
      // 系统管理
      if(extendAttach == 'systemManage') {
        name = 'dataDictionary'
        this.$router.push({name})
      }
      // 业务管理
      if(extendAttach == 'businessManage') {
        name = 'overview'
        this.$router.push({name})
      }
      // 业务运营
      if(extendAttach == 'businessOperation') {
        name = 'overviews'
        this.$router.push({name})
      }
      // 客服管理
      if(extendAttach == 'serviceSystem') {
        name = 'workOrderList'
        this.$router.push({name})
      }
      // 业务监控
      if(extendAttach == 'businessCharts') {
        name = 'centerWatch'
        this.$router.push({name})
      }
      if(name=='centerWatch') {
        this.getChartUserInfo()
      } 
       if(extendAttach == 'supervision') {
        name = 'Customized'
        // console.log(name,extendAttach)
        this.$router.push({name})
      } 
      // 外部监管
      if(extendAttach == 'externalSupervision') {
        name = 'Customized'
        // console.log(name,extendAttach)
        this.$router.push({name})
      }
      // 技术运营平台
      if(extendAttach == 'technicalOperation'){
        this.getMonitorLogin()
      }
    },
    async getChartUserInfo() {
      const res = await this.$api.getChartUserInfo();
      if (res && res.code === 0) {
        this.$router.push({name: 'centerWatch'});
      }
    },
    // 技术运营平台登录接口
    async getMonitorLogin() {
      const res = await this.$api.getMonitorLogin({
        data: {}
      });
      if (res && res.code == 0) {
        window.open(res.data.httpResultUrl)
      }
    },
    to(name) {
      this.toHome(this.entryList[0].name, this.entryList[0].extendAttach);
      this.$router.push({
        name
      })
    },
    ...mapActions(['setEntry'])
  },
  components: {
    adminInfo,
    lockMask
  }
}
</script>


<style lang="less">
@import './less/entry.less';
.entry-container 
.entry-bd 
.entry-list 
.icon-kefuxitong{
  background-color: #4D8CEE;
}
.entry-container 
.entry-bd 
.entry-list 
.icon-jixiao{
  background-color: #64d572;
}
</style>
