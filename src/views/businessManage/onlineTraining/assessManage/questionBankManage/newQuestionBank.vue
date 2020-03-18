<template>
<!-- 新建题目 -->
<div class="vlt-card new-question-bank">
  <panel title="新建题目" :show="true" style="margin-bottom:15px">
    <div class="vlt-edit-single">
      <div class="vlt-edit-wrap">
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="8em" class="demo-ruleForm">
          <el-form-item label="题目类型" prop="questionType" :rules="rules.questionType">
            <el-select v-model="form.questionType" placeholder="请选择题目类型" clearable value-key="label">
              <el-option label="单选" value="0"></el-option>
              <el-option label="多选" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属课程" prop="courseId" :rules="rules.courseId">
            <el-select v-model="form.courseId" placeholder="请选择所属课程" clearable>
              <el-option v-for="(item,index) in courseOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="indent-input" label="题目" prop="questionTitle" :rules="rules.questionTitle">
            <el-input v-model="form.questionTitle" placeholder="请输入题目" type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="250"></el-input>
          </el-form-item>
          <el-form-item class="indent-input" :label="'选项'+changeNumber(Number(j)+1)" prop="trainOptions" v-for="(item,j) in form.trainOptions" :key="j">
            <div>
              <el-form-item :prop="`trainOptions.${j}.description`" :rules="trainOptions.description">
                <el-input  v-model="item.description" placeholder='请输入选项内容' type="textarea" :autosize="{ minRows: 2, maxRows: 6}" maxlength="250" ></el-input>
                <el-button v-if="j!=0&&j!==1"  class="delete-option vlt-delete-more" @click="delOptions(j,item.optionContent)">删除</el-button>
              </el-form-item>
            </div>
          </el-form-item>
          <!-- <div v-for="(item,index) in options" :key="index">
            <el-form-item :label="item.title"  :prop="item.option" :rules="options.option">
              <el-input v-model="item.option" placeholder="请输入选项"></el-input>
            </el-form-item>
            <el-form-item v-if="index > 1">
              <button class="delete-option" @click="delOptions(index)">
              <i class="el-icon-delete"></i> 删除选项
              </button>
            </el-form-item>
          </div> -->
          <el-form-item>
            <el-button size="medium" class="add-option vlt-add-more" @click="addOptions">
            <i class="el-icon-plus"></i> 添加选项
            </el-button>
          </el-form-item>
          <el-form-item label="正确答案" prop="correctAnswer" :rules="rules.correctAnswer">
            <el-select v-model="form.correctAnswer" placeholder="请选择正确答案" clearable :multiple="form.questionType == 1" v-if="update">
              <el-option v-for="(item,index) in answerOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button :id="'newQuestionBank-submit'" type="primary" size="small" @click="submit">提 交</el-button>
              <el-button :id="'newQuestionBank-cancel'" size="small" @click="cancel">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </panel>
</div>
</template>

<script type="text/javascript">
export default {
name: "newQuestionBank",
data() {
return {
  update: true,
  rules: {
    questionType: [{ required: true, message: '请选择题目类型', trigger: ['change','blur'] }],
    courseId: [{ required: true, message: '请选择所属课程', trigger: ['change','blur'] }],
    questionTitle: [{ required: true, validator: this.$rules.checkName, title: '题目', trigger: ['change','blur'] }],
    trainOptions: [{ required: true, validator: this.$rules.checkName, title: '选项', trigger: ['change','blur'] }],
    correctAnswer: [{ required: true, message: '请选择正确答案', trigger: ['change','blur'] }]
  },
  // options: {
  //   option: [{ required: true, message: '请输入选项', trigger: ['change','blur'] }],
  // },
  trainOptions:{
      description:[{ required: true, validator: this.$rules.checkName, title:'选项内容', trigger: ['change','blur'] }],
  },
  form: {
    questionType:'',
    courseId:"",
    questionTitle: "",
    correctAnswer:"",
    trainOptions: [
      {description: "", optionContent: "A"},
      {description: "", optionContent: "B"},
    ],
  },
  answerOptions: [
    {label: "选项一", value: "A"},
    {label: "选项二", value: "B"},
  ],    // 正确答案
  courseOptions: [],    //  所属课程
  options: [
    {option:"79879879",title: "选项一"},
    {option:"79879879",title: "选项二"}
  ],
  params: {
    insId : this.$storage.get("userInfo").insId
  } 
}
},
watch: {
  'form.questionType'() {
    this.update = false
    setTimeout(()=>{
      this.update = true
    },50)
  }
},
created() {
  this.getCourseName()
},
methods: {
  submit() {
    const self = this;
    
    self.$refs["ruleForm"].validate(async valid =>{
      if (valid) {
        let data = JSON.parse(JSON.stringify(self.form))
        if (self.form.trainOptions.length < 2) {
          self.$message.warning("选项不能少于两条")
          return
        }
        if (data.questionType == 1) {
          data.correctAnswer = data.correctAnswer&&data.correctAnswer.join(',')
        }
        console.log(data)
        let res = await self.$api.trainQuestionCreate({ message:"新建成功",data })
        if (res && res.code == 0) {
          self.$router.back()
        }
      }
    })
  },
  cancel() {this.$router.back()},
  // 增加选项 
  addOptions() {
    let list = ["选项三","选项四","选项五","选项六","选项七","选项八","选项九","选项十",]
    let arr = ["C", "D", "E", "F", "G", "H", "i", "j"]
    // 正确答案
    let option = {label: list[this.answerOptions.length - 2], value: arr[this.answerOptions.length - 2]}

    let obj = {description: "", optionContent: arr[this.form.trainOptions.length - 2]}
    if (this.form.trainOptions.length < 10) {
      this.form.trainOptions.push(obj)
      this.answerOptions.push(option)
    }else{
      this.$message({type: 'warning',message: '不能再增加选项了，谢谢！'})
    }
  },
  // 删除选项
  delOptions(index, val) {
    this.form.trainOptions.splice(index, 1);
    this.answerOptions.splice(index, 1);
    this.form.correctAnswer = "";
    let list = ["选项一","选项二","选项三","选项四","选项五","选项六","选项七","选项八","选项九","选项十",]
    let arr = ["A","B","C", "D", "E", "F", "G", "H", "i", "j"]
    this.form.trainOptions.forEach((item, index)=>{
      item.optionContent = arr[index] 
    })
    this.answerOptions.forEach((item, index)=>{
      item.label = list[index] 
      item.value = arr[index]
    })
    // console.log(index)
    // if (this.form.questionType == 1) {
    //   let index = this.form.correctAnswer.indexOf(index)
    //   this.form.correctAnswer.splice(index,1)
    // }
    
    // if (this.form.questionType == 0&&val == this.form.correctAnswer) {
    //   this.form.correctAnswer = ""
    // }
  },
  // 获取所属课程下拉列表数据
  getCourseName() {
    const self = this;
    let data = self.params;
    (async data =>{
      let res = await self.$api.queryTrainCourseDownList({ data })
      console.log(res)
      if (res && res.code == 0) {
        let arr = res.data.map(item =>{
          return {label: item.name, value: item.id}
        })
        self.courseOptions = arr
      }
    })(data)
  },
  changeNumber(val){
    let option = {
      1:'一',
      2:'二',
      3:'三',
      4:'四',
      5:'五',
      6:'六',
      7:'七',
      8:'八',
      9:'九',
      10:'十'
    }
    return option[val]
  },
},
}
</script>

<style lang="less" scoped>
.el-form-item__content{
  .delete-option{
    // width: 100px;
    // height: 40px;
    position: absolute;
    top: 0px;
    left: 410px;
    // border-radius: 3px;
		// background: white;
		// border: 1px dashed rgb(214, 212, 212);
    // cursor: pointer;
  }
  .add-option{
    width: 400px;
		height: 40px;
		// background: white;
		// border: 1px dashed rgb(223, 212, 212);
		// cursor: pointer;
  }
}

</style>
<style lang="less">
  .new-question-bank {
    .indent-input {
      .el-input__inner {
        padding-right: 55px;
      }
    }
  }
</style>