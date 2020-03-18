<template>
 <div class="vlt-card plan-check">
  <panel title="告警监控详情" :show="true">
      <base-info :infoList="planList"></base-info>
  </panel>
 </div>
</template>

<script type="text/javascript">
export default {
 name: "warningWatchDetail",
 data() {
 return {
   planList:[
     {title:'告警源',value:'',prop:'planName'},
     {title:'描述',value:'',prop:'planCode'},
     {title:'警报等级',value:'',prop:'planState'},
     {title:'告警次数',value:'',prop:'planState'},
     {title:'最新时间',value:'',prop:'startTime'},
     {title:'最新告警历时',value:'',prop:'startTime'},
     {title:'通知状态',value:'',prop:'startTime'},
     {title:'处理状态',value:'',prop:'startTime'},
   ],
   gameInfoList:[
     {title:'游戏ID',value:'',prop:'gameID'}
   ]
 }
 },
 components: {
 },
 methods: {
 },
}
</script>

<style lang="less" scoped>
.plan-check{
  background: white;
  margin:20px 20px;
  border-radius: 8px;
  padding: 25px
}

</style>
