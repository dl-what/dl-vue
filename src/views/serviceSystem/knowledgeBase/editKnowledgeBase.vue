<template>
  <div>
    <panel title="编辑知识库" :show="true">
      <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form label-position="right" 
            label-width="130px" 
            :model="form"
            :rules="rules"
            ref="form"
            class="baseInfo">
            <el-form-item label="问题" prop="question.question">
              <el-input v-model="form.question.question" placeholder="请输入" maxlength="50"></el-input> 
            </el-form-item>
            <el-form-item v-for="(item,index) in form.otherQuestions" :key="index"
              :label="`相似问题${index+1}`"
              :prop="'otherQuestions.' + index + '.question'"
              :rules="{
                required: true, message: '相似问题不能为空', trigger: ['change','blur']
              }">
              <div class="flex-wrap">
                <el-input v-model="item.question" placeholder="请输入" maxlength="50"></el-input>
                <el-button class="remove vlt-delete-more" @click="remove(index)">删除</el-button>
              </div>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button size="medium" @click="add" icon="el-icon-plus" class="add-btn vlt-add-more"></el-button>
            </el-form-item>
            <el-form-item label="知识分类" prop="categoryId">
              <el-select filterable v-model="form.categoryId" placeholder="请选择知识分类">
                <el-option v-for="(item,index) in questionType" :key="index" :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="知识状态" prop="status">
              <el-switch
                v-model="form.status"
                :active-text="form.status==0?'启用':'关闭'"
                :inactive-value="1"
                :active-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="答案（机器人）" prop="answer">
              <el-input v-model="form.answer" type="textarea" :autosize="{ minRows: 5, maxRows: 7}" placeholder="请输入" maxlength="300"></el-input> 
            </el-form-item>
            <el-form-item >
              <div class="dialog-footer">
                <el-button type="primary" class="sure" size="medium" @click="sure">确 定</el-button>
                <el-button size="medium" @click="back">取 消</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "editKnowledgeBase",
  components: {
  },
  data() {
    return {
      rules: {
        'question.question': [
          {required: true, message: '问题不能为空', triggle: ['change','blur']}
        ],
        categoryId: [
          {required: true, message: '知识分类不能为空', triggle: ['change','blur']}
        ],
        answer: [
          {required: true, message: '答案不能为空', triggle: ['change','blur']}
        ],
      },
      form: { 
        id: null,
        question: {question: null, isFirst: 1}, // 问题
        answer: null, // 答案
        otherQuestions: [
          {question: null, isFirst: 0, id: null, knowledgeBaseId: null}
        ],
        status: 0, // 状态
        categoryId: null, // 分类id
      },
      questionType: [],
      knowledgeBaseId: null,
    }
  },
  created() {
    let data = { query: null };
    this.queryKnowledgeTypeList(data)
    this.knowledgeBaseId = this.$route.query.id
    this.getKnowledgeDetail(this.knowledgeBaseId)
  },
  methods: {
    sure() {
      const self = this;
      self.$refs.form.validate(valid => {
        if(valid) {
          let data = JSON.parse(JSON.stringify(this.form))
          data.categoryId = data.categoryId*1;
          self.editKnowledge(data);
        }
      })
    },
    back() {
      this.$router.back();
    },
    add() {
      let obj = {question: null, isFirst: 0, id: null, knowledgeBaseId: this.knowledgeBaseId}
      if(this.form.otherQuestions.length < 6) {
        this.form.otherQuestions.push(obj)
      }else{
        this.$message.warning('相似问题不能超过6个')
      }
    },
    remove(index) {
      this.form.otherQuestions.splice(index, 1)
    },
    editKnowledge(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.editKnowledge({data})
				if(res && res.code == 0) {
          self.$message.success('保存成功');
          self.$router.back()
				}
      })(data)
    },
    queryKnowledgeTypeList(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.queryKnowledgeTypeList({data})
				if(res && res.code == 0) {
          res.data.forEach((item) => {
            item.id = String(item.id)
          })
          self.questionType = res.data;
				}
      })(data)
    },
    getKnowledgeDetail(data) {
      const self = this;
      (async (data)=>{
        let res = await self.$api.getKnowledgeDetail({data})
				if(res && res.code == 0) {
          let params = res.data;
          this.form.id = params.id;
          this.form.question = params.question;
          this.form.answer = params.answer;
          this.form.categoryId = String(params.categoryId);
          this.form.otherQuestions = params.otherQuestions;
          this.form.status = params.status;
				}
      })(data)
    },
  },
}
</script>

<style lang="less" scoped>
  .flex-wrap{
    display: flex;
    align-items: center;
    position: relative;
    height: 40px;
    .flag{
      margin: 0 10px;
      flex: none;
    }
    .remove{
      position: absolute;
      top: 0;
      right: -70px;
      z-index: 1;
      padding: 10px 15px;
    }
  }
  .add-btn{
    width: 100%;
  }
  .other-item{
    margin-bottom: 20px;
  }
  .sure{
    margin-right: 10px;
  }
</style>
