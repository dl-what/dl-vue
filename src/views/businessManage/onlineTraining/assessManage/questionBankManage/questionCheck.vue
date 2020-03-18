<template>
<div class="vlt-card">
  <panel title="基础信息" :show="true" style="margin-bottom:15px">
    <!-- <div class="vlt-edit-single"> -->
      <!-- <div class="vlt-edit-wrap">
        <el-form :model="ruleForm" :r-ules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="题目类型" prop="questionType" :rules="rules.questionType">
            <el-select v-model="ruleForm.region" placeholder="请选择题目类型" clearable disabled>
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属课程" prop="course" :rules="rules.course">
            <el-select v-model="ruleForm.course" placeholder="请选择所属课程" clearable disabled>
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目" prop="topic" :rules="rules.topic">
            <el-input v-model="ruleForm.topic" placeholder="请输入题目" disabled></el-input>
          </el-form-item>
          <div v-for="(item,index) in options" :key="index">
            <el-form-item label="选项一"  prop="options" :rules="rules.options">
              <el-input v-model="item.option1" placeholder="请输入选项" disabled></el-input>
            </el-form-item>
          </div>
          <el-form-item label="正确答案" prop="answer" :rules="rules.answer">
            <el-select v-model="ruleForm.answer" placeholder="请选择正确答案" clearable disabled>
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" size="small" @click="save">提 交</el-button>
              <el-button size="small" @click="cancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </div> -->
    <!-- </div> -->
    <base-info :infoList="infoList"></base-info>
  </panel>
</div>
</template>

<script type="text/javascript">
export default {
name: "questionCheck",
data() {
  return {
    rules: {
      questionType: [{ required: true, message: '请选择题目类型', trigger: ['change','blur'] }],
      course: [{ required: true, message: '请选择所属课程', trigger: ['change','blur'] }],
      topic: [{ required: true, message: '请输入题目', trigger: ['change','blur'] }],
      options: [{ required: true, message: '请输入选项', trigger: ['change','blur'] }],
      answer: [{ required: true, message: '请选择正确答案', trigger: ['change','blur'] }]
    },
    infoList:[
      {title: '题目类型', value: '', prop: 'questionType'},
      {title: '所属课程', value: '', prop: 'courseName'},
      {title: '题目', value: '', prop: 'questionTitle'},
      {title: '正确答案', value: '', prop: 'correctAnswer'}
    ],
    ruleForm: {
      questionType:'',
      course:"",
      topic: "",
      answer:''
    },
  }
},
created() {
  this.getDetail()
},
methods: {
  async getDetail() {
    const self = this;
    let obj = {
      0: "单选",
      1: "多选"
    };
    let list = {A: "选项一", B: "选项二", C: "选项三", D: "选项四", E: "选项五", F:"选项六", G:"选项七", H: "选项八", i: "选项九", j:"选项十"}
    let title = ["选项一","选项二","选项三","选项四","选项五","选项六","选项七","选项八","选项九","选项十",]
    let data = self.$route.query.id
    let res = await self.$api.trainQuestionDetail({data})
    if (res && res.code == 0) {
      console.log(res)
      let arr = res.data.trainOptions
      self.infoList.forEach((item,index) =>{
        item.value = res.data[item.prop]
        if (item.prop == 'questionType') {
          item.value = obj[res.data.questionType]
        }
        if (item.prop == 'correctAnswer') {
          let arr = res.data.correctAnswer.split(',')
          if (arr.length == 1) {
            item.value = list[res.data.correctAnswer]
          }
          if (arr.length > 1) {
            let answer = []
            for (let i = 0;i < arr.length;i++) {
              console.log(arr[i])
              answer.push(list[arr[i]])
            }
            item.value = answer
          }
        }
      })
      arr.map((item, index) =>{
        self.infoList.push({title: title[index], value: item.description, prop: 'description'})
      })
      
    }
  },
  cancel() {
  },
},
}
</script>

<style lang="less" scoped>
// .el-form-item__content{
  
//   .add-rule{
//     width: 100px;
//     height: 30px;
//     position: absolute;
//     top: -52px;left: 410px;
// 		background: white;
// 		border: 1px dashed rgb(214, 212, 212);
// 		cursor: pointer;
//   }
// }

</style>
