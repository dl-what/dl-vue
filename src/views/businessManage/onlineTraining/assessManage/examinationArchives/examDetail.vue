<template>
<div class="vlt-card exam-detail">
  <panel title="考试题目 (勾选的为正确答案，红色为用户选择的答案)" :show="true" >
    <div v-for="(item,index) in questionData" :key="index" class="question-content">
      <p>{{`${index + 1}、${item.questionTitle} (${item.questionType == 0 ? "单选" : "多选"}${item.questionType == 0 ? item.singleEvery : item.multiEvery}分)`}}</p>
      <ul class="list-content">
        <li v-for="(el,index) in item.trainOptions" :key="index" :class=" item.userOptions&&(item.userOptions).indexOf(el.id) != -1 ? 'correctAnswer':''">{{`${el.optionContent}、${el.description}`}}
          <i class="el-icon-check" v-if="el.isTrue == 0 "></i>
        </li>
      </ul>
    </div>
  </panel>
</div>
</template>
<script type="text/javascript">
export default {
name: "examDetail",
data() {
  return {
    questionData: [],
    question: {
      userId: this.$route.query.userId,
      examId: this.$route.query.examId,
      trainId: this.$route.query.trainId
    }
  }
},
created() {
  this.getExamDetail()
},  
methods: {
  getExamDetail() {
    const self = this;
    let data = this.question;
    (async data => {
      let res = await self.$api.examUserDetail({ data })
      console.log(res)
      if (res && res.code == 0 ) {
        self.questionData = res.data;
        // let arr = res.data.map((item, index) => {
        //   return {
        //     text: `${index + 1}、${item.questionTitle} (${this.getQuestionType(item.questionType)}${item.questionType == 0 ? item.singleEvery : item.multiEvery}分)`
        //   }
        // });
        // let arr = [];
        // let list = [];
        // res.data.forEach((item, index) => {
        //   let obj = {}
        //   obj.text = `${index + 1}、${item.questionTitle} (${this.getQuestionType(item.questionType)}${item.questionType == 0 ? item.singleEvery : item.multiEvery}分)`
        //   item.trainOptions.forEach((el, i) =>{
        //     console.log(item)
        //     let option = {}
        //     option.titel = `${el.optionContent}、${el.description}`
        //     option.isTrue = el.isTrue
        //     list.push(option)
        //   })
        //   obj.options = list
        //   arr.push(obj)
        // });
        // console.log(arr)

      }
    })(data)
  },
  getQuestionType(val) {
    let obj = {
      0: "单选",
      1: "多选"
    }
    return obj[val]
  }
},
}
</script>

<style lang="less" scoped>
.exam-detail{
  
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
  .correctAnswer{
    color: red;
  }
}
</style>
