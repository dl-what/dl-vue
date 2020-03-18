<template>
<!-- 活动计划模板 -->
  <div class="vlt-card template-set">
    <div class="el-card box-card add-wrap" @click="addTemplate">
      <!-- <div class="vlt-add-more"> -->
        <i class="el-icon-plus"></i>
      <!-- </div> -->
    </div>
    <el-card class="box-card flex-column" v-for="(item,index) in cardList" :key="index" @click.native="preview(item.id)">
      <div slot="header" class="clearfix">
        <span class="icon-wrap"><i class="iconfont icon-muban"></i></span>
        <em class="card-title">{{item.planTemplateName}}</em><br/><br/>
        <em class="card-text">{{item.remark.length>40?`${item.remark.slice(0, 40)}...`:item.remark}}</em>
        <!-- <span>
          <span class="card-title">{{item.planTemplateName}}</span>
          <span class="card-text">{{item.remark}}</span>
        </span> -->
      </div>
      <el-button :id="'planTemplateSet-detail' + index" type="text" class="card-btn" v-has="'planTemplateSet-detail'">预 览</el-button>
    </el-card>
  </div>
</template>
<script type="text/javascript">
import { async } from 'q';
export default {
  name: "planTemplateSet",
  data() {
    return {
      cardList: [],
      params: {insId: this.$storage.get("userInfo").insId}
    };
  },
  created() {
    this.getList()
  },
  methods: {
  async  getList(){
    const self = this;
    let data = self.params;
    (async data =>{
      let res = await self.$api.getTemplateList({ data })
      if (res && res.code == 0) {
        this.cardList = res.data
      }
    })(data)
  },
  preview(id) {
    this.$router.push({
      path: "previewTemplate",
      query: { id }
    });
  },
  addTemplate() {
    this.$router.push({ path: "planTemplateCreate" });
  }
  }
};
</script>

<style lang="less" scoped>
@import "./less/index";
.icon-wrap{
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #567CDB;
}
.icon-muban{
  color: #fff;
  font-size: 30px;
}
.add-wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .el-icon-plus{
    font-size: 42px;
    color: #aaa;
    cursor: pointer;
  }
}
.clearfix{
  cursor: pointer;
}
</style>
<style lang="less">
.template-set .el-card__header{
  padding: 16px;
  border-bottom: none;
}
.template-set .el-card__body{
  padding: 0;
  height: 40px;
  text-align: center;
  border-top: 1px solid #EBEEF5;
}
</style>
