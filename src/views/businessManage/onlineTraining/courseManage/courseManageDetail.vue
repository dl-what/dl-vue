<template>
  <div class="vlt-card course-manage-info">
    <panel title="课程类型详情"  :show="true" >
      <base-info :infoList="infoList"></base-info>
    </panel>
    <panel title="考试题目列表"  :show="true" > 
      <div class="questions">

        <el-table :data="subList" border>
          <el-table-column label="序号" fixed type="index" width="60px"></el-table-column>
          <el-table-column label="题目类型" prop="questionType" min-width="80px">
            <template slot-scope="scope">
              {{getQuestionType(scope.row.questionType)}}
            </template>
          </el-table-column>
          <el-table-column label="题号" prop="questionNumber" min-width="60px"></el-table-column>
          <el-table-column label="题目" prop="questionTitle" min-width="160px" show-overflow-tooltip></el-table-column>
          <el-table-column label="选项" prop="trainOptions" min-width="260px" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="topicOption">
                <p v-for="(item,i) in scope.row.trainOptions" :key="i">{{item.optionContent+'.'+item.description}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="正确答案" prop="correctAnswer" min-width="140px"></el-table-column>
          <el-table-column label="所属课程" prop="courseName" min-width="160px"></el-table-column>
        </el-table>
        <!-- <p class="list" v-for="(item, index) in subList" :key="index">
          题目{{index + 1}}： {{item.label}}
        </p> -->
        
      </div>
    </panel>
    <panel title="培训课件"  :show="true">
      <!-- <base-info :infoList="infoList3"></base-info> -->
      <div class="class-list">
        <p class="list" v-for="(item, index) in classList" :key="index">
          {{item.name}}  <el-link type="primary" @click="downLoad(item.url)">下载</el-link>
        </p>
      </div>
    </panel>
    <!-- <div class="submit-wrap">
      <el-row class="vlt-edit-btn">
        <el-button size="small" @click="cancel">返回</el-button>
      </el-row>
    </div> -->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  data() {
    return {
      fileList: [],
      form: [],
      infoList: [
        { title: "课程名称", value: "", prop: "name" },
        { title: "课程类型", value: "", prop: "courseTypeName" },
        { title: "课件类型", value: "", prop: "courseModeDesc" },
        // { title: "发布范围", value: "", prop: "range" },
        { title: "课程简介", value: "", prop: "description" }
      ],
      infoList2: [
        // { title: "考试题目", value: "", prop: "questionId" },
      ],
      infoList3: [
        { title: "培训课件", value: "", prop: "url" },
      ],
      courseTypeList: [],
      subjectOptios: [],
      subList: [],
      classList: []
    };
  },
  components: {},
  created() {
    (async () => {
    
      let id = this.$route.query.id;
      if (id) {
        this.getDetail(id);
      }
    })()
    
  },
  methods: {
    getDetail(id) {
      const _this = this;
      (async id => {
        const data = { id: id };
        const res = await _this.$api.queryTrainCourseInfo({ data });
        console.log("data", res);
        if (res && res.code === 0) {
          if (data) {
            _this.infoList.forEach(item => {
              item.value = res.data[item.prop];
            });
            
            if (res.data.questionId) {             
              _this.getQueryTrainQuestionList(res.data.questionId);
            }

            _this.courseTypeList.forEach(item => {
              if (item.value == res.data.courseTypeId) {
                _this.$set(_this.infoList[1], 'value', item.label)
              }
            })

             _this.getQueryTrainTypeList(res.data.url);
          }
        }
      })(id);
    },

    // 查询课程类型列表
    getQueryTrainTypeList (url) {
      const _this = this;
      let dataArr = [];
      this.insId = this.$storage.get('userInfo').insId;
        if (this.insId) {
        const data = {
          insId: this.insId
        };
        (async data => {
          let res = await _this.$api.getQueryTrainTypeList({data});
          if (res && res.code === 0) {
            console.log(res);
            res.data&&res.data.forEach(item => {
              dataArr.push({
                value: item.id,
                label: item.courseType
              })
            });
            console.log(url);
            let array  = url !=null ? url.split(',') : [];
              array&&array.forEach((item)=>{
                let obj = {};
                obj.name = item.split('/')[item.split('/').length-1];
                obj.url = item;
                _this.classList.push(obj)
              });
          }
        })(data)
      }
    },
    // 获取题目下拉列表
    getQueryTrainQuestionList(str){
      const _this = this;
      let dataArr = [];
      (async () => {
        const data = {
          page: 1,
          pageSize: 10000,
          param: {
            questionId: str
          }
        };
        let res = await _this.$api.getQuestionList({data});
        if (res && res.code === 0) {
          // console.log('136---',res);
          if (res.data) {
            _this.subList =  res.data.records ? res.data.records : [] ;

            // console.log(_this.subList);
          }
        }
      })()
    },
    getQuestionType(val) {
      let obj = {
        0: "单选题",
        1: "多选题"
      }
      return obj[val]
    },
    downLoad(url){
      this.$download(1, url)
    },
    async downLoads(val){
      let formData = new FormData();
      formData.append('filePath', val);
      const res = await this.$api.activityEvaluationDownloading({
        data: formData,
        responseType: "blob"
      });
      var blob = new Blob([res], {
        type: "application/msword;application/vnd.openxmlformats-officedocument.wordprocessingml.document;image/jpeg;image/png;application/x-rar-compressed;application/vnd.ms-excel;application/zip;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", val.split('/')[val.split('/').length-1]);
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(res);
    },
    // cancel() {
    //   this.$router.back();
    // }
  }
};
</script>

<style lang="less">

.vlt-edit-btn {
  text-align: right;
  padding-right: 100px;
  margin-top: 20px;
}
.questions{
  padding: 10px;
}
.questions,.class-list {
  padding-bottom: 20px;
  .list {
    margin-left: 20px;
    margin-top: 20px;
    .el-link {
      margin-left: 40px;
    }
  }
}
.topicOption  p{
  display: inline-block;
  margin-right: 10px;
}
// .course-manage-info {
//   .info {
//     margin-top: 20px;
//   }
//   .files {
//     &-wrap {
//       width: 360px;
//     }
//     &-item {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       &-content {
//         flex: 1;
//         padding: 0 16px 0 0;
//         white-space: nowrap;
//         overflow: hidden;
//         text-overflow: ellipsis;
//         cursor: default;
//       }
//       &-icon {
//         margin-right: 7px;
//         color: #909399;
//       }
//     }
//     &-item:hover {
//       background-color: #f5f7fa;
//       // color:#409EFF;
//     }
//   }
// }
</style>
