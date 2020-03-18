<template>
  <el-dialog title="快捷回复" :visible.sync="show" width="600px" @closed="$emit('update:showDialog', false);">
    <el-tabs v-model="activeIndex" type="card" @tab-click="handleClick">
      <el-tab-pane :label="tabItem.label" :name="String(tabIndex)" v-for="(tabItem, tabIndex) in tabList" :key="tabIndex">
        <el-form :model="tabItem.form">
          <el-form-item>
            <el-row :gutter="20">
              <el-col :span="14">
                <el-input v-model="tabItem.form.keyWord" autocomplete="off" size="mini"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" @click="search(tabItem)" size="mini" icon="el-icon-search">搜索</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <p class="search-tips" v-if="tabItem.total">共搜索到<span class="total">{{tabItem.total}}</span>条结果</p>
        </el-form>
        <ul class="list">
          <li v-for="(item, index) in tabItem.resultList" :key="index">
            <el-col :span="20">
              <p>{{item.keyWord || item.question.question}}</p>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" @click="use(item)" size="mini">使用</el-button>
            </el-col>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'quickReply',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      activeIndex: '0',
      tabList: [{
        apiName: 'queryQuickReplyList',
        label: '客服快捷回复',
        form: {
          status: 0,
          keyWord: '',
        },
        resultList: [],
        total: 0,
      },{
        apiName: 'queryKnowledgeReplyList',
        label: '知识库',
        form: {
          keyWord: '',
        },
        resultList: [],
        total: 0,
      }],
      show: this.showDialog,
    }
  },
  watch: {
    'showDialog'(value) {
      this.show = value;
    }
  },
  methods: {
    async search(tabItem) {
      const res = await this.$api[tabItem.apiName]({
        data: {
          page: 1,
          pageSize: 100,
          param: tabItem.form
        }
      })
      if (res && res.code === 0) {
        tabItem.resultList = res.data.records || [];
        tabItem.total = res.data.total;
      }
    },
    handleClick(tab, event) {
      const index = Number(tab.index);

    },
    use(item) {
      this.$emit('selected', item);
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.el-dialog__body{
    padding: 15px;
  }
  /deep/.el-tabs__item{
    font-size: 13px;
  }
  /deep/.el-row,.search-tips{
    padding-left: 19%;
  }
  /deep/.el-input__inner{
    padding: 0 10px;
  }
  .search-tips{
    margin-top: -20px;
    font-size: 12px;
    color: #999;
    .total{
      color: #F56C6C;
    }
  }
  .list{
    font-size: 13px;
    line-height: 28px;
    margin-top: 15px;
    li{
      margin-top: 5px;
      padding: 0 19%;
      overflow: hidden;
    }
  }
</style>
