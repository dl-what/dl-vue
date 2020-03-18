<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  name: 'app',
  created() {
    this.getInsData();
    // this.getAllGameType();
    let data = {type: 0}
    this.getMenuData(data);
  },
  watch: {
    insData: {
      handler(newValue, oldValue) {
        if(newValue&&newValue.length<1) {
          this.getInsData()
        }
      },
      deep: true,
    },
    gameTypeData: {
      handler(newValue, oldValue) {
        if(newValue&&newValue.length<1) {
          this.gameTypeData()
        }
      },
      deep: true,
    }
  },
  computed: {
    ...mapGetters(['insData', 'gameTypeData', 'scoreWS', 'menuData'])
  },
  methods: {
     ...mapActions(['getInsData', 'getAllGameType', 'getMenuData']),
     ...mapMutations(['SET_SCOREWS']),
    // 消息推送初始化
    wsInit() {
      if(!self.scoreWS){
        self.SET_SCOREWS(self.$api.scoreWS());
      }
      this.scoreWS.emit('match-list', total,  (data) => {
        this.scoreWS.on("match-list", (data) => {
          self.sortData(data)
        });
      });
    },
    // 断开消息推送
    wsClear() {
      this.scoreWS.on('disconnect',() => {
        this.scoreWS.off('match-list');
        // this.ws.off('round');
      });
    },
  }

}
</script>

<style lang="less">
@import './assets/less/app.less';
@import './assets/less/common.less';
</style>
