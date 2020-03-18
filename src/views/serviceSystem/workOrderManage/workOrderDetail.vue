<template>
  <div class="work-order">
    <!-- 左侧区 -->
    <div class="left">
      <!-- 窗口 -->
      <div class="work-order-wrap" style="margin-bottom: 0;">
        <p class="title">
          <i class="el-icon-service"></i> 
          <span>问题区</span>
        </p>
        <div class="service-wrap" ref="msgWrapper">
          <ul class="service-wrapper" ref="msgContent">
            <li class="customer" :class="{'customer-service': msgItem.isAnswer == 1}"
              v-for="(msgItem, msgIndex) in msgList"
              :key="msgIndex"
            >
              <div class="msg-avatar">
                <span><i class="iconfont" :class="[msgItem.isAnswer == 1 ? 'icon-kefu' : 'icon-kehu']"></i></span>
              </div>
              <div class="msg-bd">
                <div class="content" v-if="msgItem.content">
                  <p class="content-bd">{{msgItem.content}}</p>
                </div>
                <div class="content" v-if="msgItem.questions">
                  <div class="content-bd">
                    <span class="tag">问题</span>
                    <p v-for="(question, qIndex) in msgItem.questions" :key="qIndex">
                      {{question.question}}
                    </p>
                  </div>
                </div>
                <p class="time">{{msgItem.createTime}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 回复 -->
      <div class="reply-wrap">
        <span class="mask" v-show="!$route.query.isDeal"></span>
        <div class="reply-btn-wrap flex-end">
          <el-link type="primary" class="btn" :underline="false" @click="showQuickReplay = true">快捷回复</el-link>
          <!-- <el-link type="primary" class="btn" :underline="false" @click="showHistory">查看历史</el-link> -->
        </div>
        <div class="reply-content">
          <el-input v-model="replyContent" type="textarea" :autosize="{ minRows: 5, maxRows: 5}" placeholder="请输入回复内容" maxlength="1000"></el-input> 
        </div>
        <div class="reply-btn-wrap reply">
          <el-button type="primary" size="small" v-prevent="2000" @click.native="reply(replyContent)">回 复</el-button>
        </div>
      </div>
    </div>
    <!-- 右侧区 -->
    <div class="right">
      <!-- 工单详情 -->
      <div class="work-order-wrap">
        <span class="mask" v-show="!$route.query.isDeal"></span>
        <p class="title">
          <span>工单详情</span>
        </p>
        <div>
          <div class="vlt-edit-double">
            <div class="vlt-edit-wrap work-order-detail">
              <el-form label-position="right" 
                label-width="6em" 
                :model="form"
                ref="form"
                class="baseInfo"
                size="mini"
                >
                <el-form-item label="工单编号:">
                  <el-input v-model="form.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="提交时间:">
                  <el-input v-model="form.createTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="问题类型:" prop="gameType">
                  <el-select v-model.number="form.questionType" placeholder="请选择" disabled>
                    <el-option v-for="(item,index) in questionTypeList" 
                      :key="index" 
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="处理小组:" prop="gameType">
                  <el-select v-model="form.teamId" 
                    filterable
                    placeholder="请选择"
                  >
                    <el-option v-for="(item,index) in teamList" 
                      :key="index" 
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                    <!-- <el-pagination
                      class="select-pagination"
                      small
                      layout="prev, pager, next"
                      @current-change="currentPageChange"
                      :page-size="params.pageSize"
                      :total="total">
                    </el-pagination> -->
                  </el-select>
                </el-form-item>
                <el-form-item label="问题状态:" prop="status">
                  <el-select v-model.number="form.status" placeholder="请选择">
                    <el-option v-for="(item,index) in statusList" 
                      :key="index" 
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="紧急程度:" prop="gameType">
                  <el-select v-model.number="form.urgentLevel" placeholder="请选择">
                    <el-option v-for="(item,index) in urgentLevelList" 
                      :key="index" 
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="btn-save">
            <el-button type="primary" size="small" v-prevent="2000" @click="save">保 存</el-button>
          </div>
        </div>
      </div>
      <!-- 客户信息 -->
      <div class="work-order-wrap">
        <p class="title">
          <span>客户详情</span>
        </p>
        <div>
          <div class="vlt-edit-double">
            <div class="vlt-edit-wrap work-order-detail lh24">
              <el-form label-position="right" 
                label-width="6em"
                class="baseInfo">
                <el-form-item label="客户类型:">
                  <span class="text">{{detail.customerType}}</span>
                </el-form-item>
                <el-form-item label="会员账户:" v-if="detail.sourceDevice == 2">
                  <span class="text">{{detail.userAccount}}</span>
                </el-form-item>
                <el-form-item label="普通账户:" v-else>
                  <span class="text">{{detail.customerName}}</span>
                </el-form-item>
                <el-form-item label="来源终端:">
                  <span class="text">{{detail.strSourceDevice}}</span>
                </el-form-item>
                <el-form-item label="来源页面:">
                  <span class="text">{{detail.sourcePage}}</span>
                </el-form-item>
                <!-- <el-form-item label="IP地址:">
                  <span class="text">{{detail.customerType}}</span>
                </el-form-item> -->
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- 快捷功能区 -->
      <div class="work-order-wrap" style="margin-bottom: 0px;">
        <p class="title">
          <span>快捷功能区</span>
        </p>
        <div class="quick-btn">
          <el-button plain size="small" @click="$router.push({name: 'customerAccountList', query: {source: 'customerService', activeName: 'workOrderList'}})">客户查询</el-button>
          <el-button plain size="small" @click="$router.push({name: 'rechargeRecord', query: {source: 'customerService', activeName: 'workOrderList'}})">充值记录</el-button>
          <el-button plain size="small" @click="$router.push({name: 'cashRecord', query: {source: 'customerService', activeName: 'workOrderList'}})">兑奖记录</el-button>
          <el-button plain size="small" @click="$router.push({name: 'withdrawalRecords', query: {source: 'customerService', activeName: 'workOrderList'}})">提现记录</el-button>
          <el-button plain size="small" @click="$router.push({name: 'integralRecord', query: {source: 'customerService', activeName: 'workOrderList'}})">积分记录</el-button>
          <!-- <el-button plain size="small">成长值记录</el-button> -->
        </div>
      </div>
    </div>
    <el-dialog
      title="消息记录"
      :visible.sync="isShow"
      width="70%">
      <question-history></question-history>
    </el-dialog>

    <quick-reply
      :showDialog.sync="showQuickReplay"
      @selected="quickReplaySelected"
    >
    </quick-reply>
  </div>
</template>

<script>
import QuestionHistory from './questionHistory'
import quickReply from './components/quickReply'
import moment from 'moment'

export default {
  name: "workOrderDetail",
  components: {
    quickReply,
    QuestionHistory
  },
  data() {
    return {
      id: this.$route.query.id,
      showQuickReplay: false,
      detail: {},
      form: {
        id: '',
        createTime: '',
        questionType: '',
        urgentLevel: '',
        teamId: '',
        status: '',
      },
      replyContent: '',
      params: {
        page: 1,
        pageSize: 10,
        param: {}
      },
      teamList: [],
      urgentLevelList: [
        {value: 0, label: '一般'},
        {value: 1, label: '紧急'},
      ],
      statusList: [
        {value: 1, label: '待处理', disabled: true},
        {value: 2, label: '处理中'},
        {value: 3, label: '已处理'},
      ],
      questionTypeList: [
        {value: 0, label: '其他'},
        {value: 1, label: '咨询'},
        {value: 2, label: 'BUG'},
        {value: 3, label: '建议反馈'},
        {value: 4, label: '使用问题'},
      ],
      isShow: false,
      total: 0,
      msgList: [],
    }
  },
  watch: {
    msgList() {
      this.$nextTick(() => {
        const scrollTop = this.$refs.msgContent.offsetHeight - this.$refs.msgWrapper.offsetHeight;
        if (scrollTop > 0) {
          this.$refs.msgWrapper.scrollTop = scrollTop;
        }
      })
    },
  },
  created() {
    this.getDetail();
    this.getTeamList();
    this.getServiceMsgList();
  },
  methods: {
    // 获取详情
    async getDetail() {
      const res = await this.$api.getServiceTicketDetail({
        data: this.id
      })
      if (res && res.code === 0) {
        this.detail = res.data;
        Object.keys(this.form).forEach(item => {
          this.form[item] = this.detail[item];
          this.detailTeamId = this.detail.teamId;
        })
      }
    },
    // 客服小组列表
    async getTeamList() {
      const res = await this.$api.queryTurnTeamList({
        data: {
          id: this.id
        }
      });
      if (res && res.code === 0) {
        this.teamList = res.data;
        // this.total = res.data.total;
      }
    },
    // 客服小组搜索
    // remoteTeam(query) {
    //   this.params.param.teamName = query;
    //   this.getTeamList();
    // },
    // currentPageChange(page) {
    //   this.params.page = page;
    //   this.getTeamList();
    // },
    // 获取消息记录
    async getServiceMsgList() {
      const res = await this.$api.getServiceMsgList({
        data: {
          questionType: this.$route.query.questionType,
          serviceTicketId: this.id
        }
      });
      if (res && res.code === 0) {
        this.msgList = (res.data || []).reverse();
      }
    },
    // 工单回复
    async reply(replyContent) {
      if (replyContent.trim() === '') {
        return;
      }
      const res = await this.$api.answerServiceTicket({
        data: {
          serviceTicketId: this.id,
          content: replyContent
        }
      });
      if (res && res.code === 0) {
        this.msgList.push({
          createTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
          isAnswer: 1,
          content: replyContent
        })
        // 清空表单内容
        this.replyContent = '';
      }
    },
    showHistory() {
      this.isShow = true;
    },
    save() {
      let apiName;
      const deal = async (apiName, data) => {
        const res = await this.$api[apiName]({
          message: '操作成功',
          data
        })
        if (res && res.code === 0) {
          this.$router.push({
            name: 'workOrderList'
          })
          this.eventBus.$emit('closeTag', 'workOrderDetail');
        }
      }
      switch(this.form.status) {
        // 处理中
        case 2:
          const teamId = this.form.teamId
          const data = {
            id: this.id,
            teamId,
            urgentLevel :this.detail.urgentLevel
          };
          if (teamId == this.detailTeamId) {
            this.$message({
              showClose: true,
              message: '请选择其他处理小组处理!',
              type: 'warning'
            });
            return;
          }
          this.$confirm('是否转办工单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deal('turnServiceTicket', data);
          })
          break;
        // 已处理
        case 3:
          this.$confirm('是否结束工单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deal('endServiceTicket', {
              id: this.id
            });
          })
          break;
      }
      
    },
    quickReplaySelected(data) {
      this.showQuickReplay = false;
      this.reply(data.content || data.answer || data.question.question)
    },
  },
}
</script>

<style lang="less" scoped>
.work-order{
  display: flex;
  justify-content: space-between;
  padding: 16px;
  position: relative;
  .mask{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255,255,255,.4);
    z-index: 99;
    cursor: not-allowed;
  }
  .left{
    flex: 40%;
    margin-right: 20px;
  }
  .right{
    flex: 40%;
    min-width: 450px;
  }
  
  &-wrap{
    padding: 0 16px 16px;
    border-radius: 4px;
    border: 1px solid #eee;
  }
  .title {
    position: relative;
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e8eaec;
    .el-icon-service {
      font-size: 16px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      margin-left: 5px;
    }
    .el-link {
      position: absolute;
      right: 20px;
      line-height: 24px;
      font-size: 12px;
    }
  }
  .service-wrap{
    height: 480px;
    overflow: auto;
    padding: 16px 0;
    -ms-overflow-style:none;
    overflow: -moz-scrollbars-none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .service-wrapper{
    display: flex;
    flex-direction: column;
  }
  .time{
    padding-left: 10px;
    line-height: 1.8;
    font-size: 12px;
    color: #999;
  }
  .msg-bd{
    display: inline-block;
    overflow: hidden;
    max-width: 70%;
    .content{
      text-align: justify;
    }
  }
  .content-bd{
    min-width: 120px;
    word-break: break-all;
    .tag{
      color: #f5f5f5;
    }
  }
  .customer{
    padding-bottom: 16px;
    margin-right: 30%;
    .msg-avatar{
      float: left;
    }
    
    .icon-kehu{
      font-size: 40px;
      color: #999;
    }
    
    .content{
      margin-left: 10px;
      border-radius: 4px;
      background-color: #e8eaec;
      padding: 8px;
      &-hd{
        line-height: 1.5;
      }
      &-bd{
        line-height: 1.5;
      }
    }
  }
  .customer-service{
    padding-bottom: 16px;
    margin-left: 30%;
    margin-right: 0;
    text-align: right;
    .msg-avatar{
      float: right;
    }
    .icon-kefu{
      font-size: 40px;
      
    }
    .time{
      text-align: right;
      padding-right: 10px;
    }
    .content{
      margin-right: 10px;
      border-radius: 4px;
      background-color: #409EFF;
      color: #fff;
      padding: 8px;
      &-hd{
        line-height: 1.5;
      }
      &-bd{
        line-height: 1.5;
      }
    }
  }
  .reply-btn-wrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flex-end{
    height: 40px;
    background-color: #f0faff;
    justify-content: flex-end;
    .btn{
      padding-right: 10px;
    }
  }
  .reply{
    padding: 20px 5px;
  }
  .reply-wrap{
    position: relative;
  }
  .work-order-detail{
    padding: 16px 0 0;
    &.lh24{
      /deep/.el-form-item__content,/deep/.el-form-item__label{
        line-height: 24px;
      }
    }
  }
  .btn-save{
    text-align: right;
  }
  .work-order-wrap{
    margin-bottom: 15px;
    position: relative;
  }
  .quick-btn{
    button{
      margin: 10px 10px 0 0;
    }
  }
  
}
.select-pagination{
  text-align: center;
}
</style>
<style lang="less">
.work-order-detail{
  .el-form-item__content{
    width: auto;
  }
}
</style>
