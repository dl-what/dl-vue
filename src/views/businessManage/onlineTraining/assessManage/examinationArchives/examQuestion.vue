<template>
<div class="vlt-card content-block">
  <panel title="考试题目(勾选的为题目正确答案)" :show="true" >
    <div v-for="(item,index) in questionData" :key="index" class="question-content">
      <p>{{`${index + 1}、${item.questionTitle} (${item.questionType == 0 ? "单选" : "多选"}${item.questionType == 0 ? item.singleEvery : item.multiEvery}分)`}}</p>
      <ul class="list-content">
        <li v-for="(el,index) in item.trainOptions" :key="index">{{`${el.optionContent}、${el.description}`}}
          <i class="el-icon-check" v-if="el.isTrue == 0 "></i>
        </li>
      </ul>
    </div>
    <div class="submit-wrap">
      <el-row class="vlt-edit-btn">
        <el-button :id="'examQuestion-cancel'" size="medium" @click="cancel">返回</el-button>
      </el-row>
    </div>
  </panel>
</div>
</template>
<script type="text/javascript">
export default {
name: "examQuestion",
data() {
  return {
    questionData: [],
    examId: this.$route.query.examId
  }
},
created() {
  this.getList()
},
methods: {
  getList () {
    const self = this;
    let data = this.examId;
    (async data =>{
      let res = await self.$api.getExamDetail({ data })
      if (res && res.code == 0) {
        console.log(res)
        self.questionData = res.data;
      }
      
    })(data)
  },
  cancel() {this.$router.back()}
},
}
</script>

<style lang="less" scoped>
.content-block{
  .question-content{
    padding: 20px 40px;
    p{
      display: inline-block;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .list-content{
      margin-left: 15px;
      li{
        margin: 15px;
      }
    }
  }
  .submit-wrap{
    margin: 50px 0 20px 200px;
  }
  .correct{
    color: red;
  }
}
</style>
