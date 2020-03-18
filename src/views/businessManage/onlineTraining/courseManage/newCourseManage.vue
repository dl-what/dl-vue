<template>
  <div class="vlt-card addSubject">
   
      <panel title="新建课程" :show="true">
         <div class="vlt-edit-single">
        <div class="vlt-edit-wrap">
          <el-form ref="ruleForm" :model="form" :rules="rules" label-position="right" label-width="8em" >
            <el-form-item label="课程名称" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入课程名称" maxlength="50" show-word-limit ></el-input>
            </el-form-item>
            <el-form-item label="课程类型" prop="courseType">
              <el-select v-model="form.courseType" filterable placeholder="请选择课程类型">
                <el-option v-for="item in courseTypeList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课件类型" prop="courseMode">
              <el-select v-model="form.courseMode" filterable placeholder="请选择课件类型" @change="changeFileType" >
                <el-option v-for="item in courseModeList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="课程简介" prop="description">
              <el-input type="textarea" :rows="4" placeholder="请输入课程简介" v-model.trim="form.description" maxlength="120" ></el-input>
            </el-form-item>

            <el-form-item label="培训课件">
              <el-upload
                id="newCourseManage-uplode"
                class="upload-demo"
                drag
                multiple
                action
                :file-list="fileList"
                :show-file-list="true"
                :on-remove="handleRmoveFile"
                :before-upload="beforeUploadFile"
                :http-request="uploadFileOther"
                :accept="fileType"
              >
              <!-- :disabled="isDisUpload" -->
                <!-- accept="movie" -->
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传课件</em>
                </div>
                <div class="el-upload__tip" slot="tip">最多只能上传5个文件，且每个不超过50M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
         </div>
      </panel>
      <panel  title="考试题目" :show="true">
        <div class="panel-table">
          <div class="btn-import">
            <div class="btn-item">
              <el-tooltip  effect="light" content="提示：只能导入以.xls/.xlsx为后缀的文件格式！" placement="top" >
                <el-upload style="display:flex;align-items:flex-end;"
                  action :auto-upload="true" :on-success="handleAvatarSuccess"
                  :show-file-list="false"
                  :http-request="uploadFileImg" accept=".xls, .xlsx" :disabled="isUpload">
                  <el-button id="newCourseManage-import" size="small" type="primary" >导入考试题目</el-button>
                </el-upload>
              </el-tooltip>
            </div>
            <div class="btn-item">
              <el-button id="newCourseManage-download" size="small" type="" @click="downLoadModule">下载导入模板</el-button>
            </div>
          </div>
          <div class="wrapper">
            <el-table :data="selectTableData" border style="width: 100%;">
              <el-table-column prop="index" label="序号" align="center" min-width="120" type="index">
                <template slot-scope="scope">{{scope.$index+1}}</template>
              </el-table-column>
              <el-table-column prop="questionType" label="题目类型" align="center" min-width="120">
                <template slot-scope="scope">{{scope.row.subjectType===1?"单选题":"多选题"}}</template>
              </el-table-column>
              <el-table-column prop="questionNumber" label="题号" align="center" min-width="60"></el-table-column>
              <el-table-column prop="questionTitle" label="题目" align="center" min-width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="optionsContent" label="选项" align="center" min-width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="topicOption">
                    <p
                      v-for="item in scope.row.trainOptions"
                      :key="item.optionsId"
                    >{{item.optionContent+':'+item.description}}  </p>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column label="正确答案" prop="correctAnswer" min-width="140px"></el-table-column> -->
              <el-table-column label="所属课程" prop="courseName" min-width="160px"></el-table-column>
              <!-- <el-table-column label="操作" prop="introduce" min-width="80px">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="qustionDelect(scope.row)"
                    :id="$route.name+'-delect-'+scope.$index"
                  >删除</el-button>
                </template>
              </el-table-column> -->
            </el-table>
            <el-button
              size="medium"
              icon="el-icon-plus"
              class="text-btn add-question vlt-add-more"
              @click="selectTable"
              :id="$route.name + '-' + 'addQuestion'"
            >新增问卷题目</el-button>
          </div>
        </div>
      </panel>
      <div class="submit-wrap">
        <!-- <el-row class="vlt-edit-btn"> -->
          <el-button id="newCourseManage-submit" type="primary" size="medium" @click="submit">提交</el-button>
          <el-button id="newCourseManage-cancel" size="medium" @click="cancel">取消</el-button>
        <!-- </el-row> -->
      </div>
      <quest-list-table :showSelect.sync="showSelect" :subjectData="subjectData" :dataArr="form.questionId" @sendQuestionId="sendQuestionArr"></quest-list-table>
   
  </div>
</template>

<script type="text/javascript">
import questListTable from './components/questListTable';
export default {
  name: "newCourseManage",
  data() {
    return {
      form: {
        name: "",
        url: "",
        questionId: []
      },
      channelList: [],
      fileList: [],
      files: [],
      courseTypeList: [],
      courseModeList: [
        { value: 1, label: "视频", format: ".mp4,.MP4,.avi,.AVI,.MOV,.mov" },
        { value: 2, label: "音频", format: ".WAV,.MP3,.WMA,.wap,.mp3,.wma" },
        {
          value: 3,
          label: "图片",
          format: ".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
        },
        { value: 4, label: "pdf", format: ".pdf,.PDF" }
      ],
      isDisUpload: true,
      subjectOptios: [],
      value: [],
      rules: {
        name: [ { required: true, validator: this.$rules.checkName, title:  "课程名称", trigger: ["change", "blur"] } ],
        courseType: [ { required: true, message: "课程类型不能为空", trigger: ["change", "blur"] } ],
        courseMode: [ { required: true, message: "课件类型不能为空", trigger: ["change", "blur"] } ],
        // questionId: [{ required: true, message: '考试题目不能为空', trigger: ["change","blur"] }],
        // range: [{ required: true, message: '发布范围不能为空', trigger:["change","blur"] }],
        description: [ { required: true, message: "课程简介不能为空", trigger: ["change", "blur"] } ]
      },
      insId: 0,
      fileType: null,
      courseModeTypeList: {
        movie: [],
        music: [],
        pic: [],
        pdf: []
      },
      questionIdArr: [],
      isRepeat: false,
      questionList: [],
      isUpload: false,
      showSelect: false,
      subjectData: [],
      selectTableData: []
    };
  },
  components: {questListTable},
  created() {
    this.getList();
    this.insId = this.$storage.get("userInfo").insId;
    if (this.insId) {
      this.getQueryTrainTypeList(this.insId);
    }
    let params = {
      page: 1,
      pageSize: 2000,
      param: {}
    };
    this.getQueryTrainQuestionList(params);
  },
  methods: {

    // 判断课程列表 条数 ，如果没有则 不让导入 题目
    getList() {
      const data =  {
        page: 1,
        pageSize: 20,
        param: {
          insId: this.$storage.get('userInfo').insId
        }
      };
      const _this = this;
      (async data => {
        let res = await _this.$api.trainCourseList({ data });
        console.log(res);
        if (res && res.code == 0) {
          if (res.data != null) {
              _this.isUpload = res.data.records.length ? false : true;
          }
        }
      })(data);
    },

    changeChannelSelect(val) {
      console.log(val);
    },
    // 查询课程类型列表
    getQueryTrainTypeList(insId) {
      const _this = this;
      const data = {
        insId
      };
      (async data => {
        let res = await _this.$api.getQueryTrainTypeList({ data });
        if (res && res.code === 0) {
          console.log(res);
          res.data &&
            res.data.forEach(item => {
              _this.courseTypeList.push({
                value: item.id,
                label: item.courseType
              });
            });
        }
      })(data);
    },
    // 获取题目下拉列表
    getQueryTrainQuestionList(data) {
      const _this = this;
      _this.subjectOptios = [];
      (async data => {
        let res = await _this.$api.getQuestionList({ data });
        if (res && res.code === 0) {
          console.log(res);
          res.data.records && res.data.records.forEach(item => {
              _this.subjectOptios.push({
                value: item.id,
                label: item.questionTitle
              });
            });
        }
      })(data);
    },
    selectTable () {
      this.showSelect = true;
    },
    sendQuestionArr (arr) {
      console.log(arr);
      this.selectTableData = [];
      this.form.questionId = [];
      arr.forEach((element, index) => {
        if (element.id) {
          this.selectTableData.push(element)
          this.form.questionId.push(element.id);
        } else {
          // if (this.subjectOptios.indexOf(element.id) > -1) {
          //   this.selectTableData.push(element)
          // }
          this.form.questionId.push(element);
        }
      });
      // this.form.questionId = arr;
      console.log('传过来的值', this.form.questionId, this.selectTableData);
      // this.selectTableData = arr;
    },
    qustionDelect (row){
      this.selectTableData.forEach((item, index, arr) => {
        if (row.id == item.id) {
          arr.splice(index, 1);
          this.form.questionId.splice(index, 1);
        }
      });
      console.log(row);
    },
    changeSelect () {
      console.log(1);
    },
    changeFileType(type) {
      this.oType = type;
      this.fileType = this.courseModeList[type - 1].format;
      console.log(this.fileType);
      console.log(
        this.courseModeTypeList,
        Object.keys(this.courseModeTypeList)[this.oType]
      );
      this.isDisUpload = false;
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file, "上传成功的勾子");
    },
    async uploadFileImg(files) {
      console.log(files, "自定义上传勾子");
      let formData = new FormData();
      formData.append("file", files.file);
      console.log(formData, files.file);
      const res = await this.$api.trainQuestionImportExcel({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code == 0) {
        console.log("uploadFile", res, res.data);
        if (res.data) {
          this.$message.success("题库上传成功");
          this.getQueryTrainQuestionList({});
          console.log(this.isUpload, this.questionList, this.questionIdArr);
        }
      } else {
        this.fileRemove(files.file);
      }
    },

    uploadLimit(files, fileList) {
      console.log(files, fileList);
    },
    beforeUploadFile(file) {
      // console.log(this.form.courseMode, this.fileType);
      if (this.fileType == null && !this.form.courseMode) {
        this.$message.warning('请先选择需要上传的课件类型！');
        return false;
      } else {
        const isLt20M = file.size / 1024 / 1024 < 50;
        if (!isLt20M) {
          this.$message.error("上传附件大小不能超过 50MB!");
        }
        return isLt20M;
      }
    },

    async uploadFileOther(files) {
      const _this = this;
      let formData = new FormData();

      console.log("files", files.file.size / 1024);
      formData.append("uploadFile", files.file);
      formData.append("type", 1);
      // uploadChannelFiles
      const res = await _this.$api.uploadTrainCourseFile({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0;
          files.onProgress({ percent: percent });
        }
      });
      console.log("uploadFile", res, _this.fileList);
      if (res && res.code == 0) {
        // 判断是否存在
        _this.isRepeat = false;
        _this.fileList.forEach((item, index) => {
          if (files.file.name == item.name) {
            _this.isRepeat = true;
          }
        });
        
        // push进fileList
        let obj = {};
        obj.name = res.data.fileName;
        obj.url = res.data.filePath;
        _this.fileList.push(obj);
        if (_this.fileList.length > 5) {
          _this.fileList.splice(-1, 1);
          _this.$message.error("上传附件数量不能超过5个");
          return;
        }
        if (_this.isRepeat) {
          _this.fileList.splice(-1, 1);
          _this.$message.error("附件已存在，不能重复上传");
        } else {
          let array = [];
          _this.fileList.forEach(item => {
            array.push(item.url);
          });
          _this.form.url= array.join(",");
            
          // _this.courseModeTypeList[
          //   Object.keys(_this.courseModeTypeList)[_this.oType - 1]
          // ].push(obj.url);

          // _this.form.url = _this.courseModeTypeList[
          //   Object.keys(_this.courseModeTypeList)[_this.oType - 1]
          // ].join(",");

          _this.$message.success("上传成功");
        }

        console.log('----', _this.fileList,_this.fileList.length);
      
        console.log(_this.courseModeTypeList);
      }  else {
        this.fileRemove(files.file);
      }
    },
    //下载导入模板
    async downLoadModule() {
      let result = await this.$api.exportExamTemplate({
        // data,
        responseType: "blob"
      });
      var blob = new Blob([result.blob], {
        type: "application/vnd.ms-excel;charset=utf-8"
      });
      var url = window.URL.createObjectURL(blob);
      var aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = url;
      aLink.setAttribute("download", "导入题库模板.xls");
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      console.log(result);
      //console.log("res", result);
    },
    handleRmoveFile(file) {
      console.log(file);
      this.fileList.forEach((item, index) => {
        if (item.name == file.name) {
          this.fileList.splice(index, 1);
        }
      });
      let array = [];
      this.fileList.forEach(item => {
        array.push(item.url);
      });
      this.form.url= array.join(",");
    },    

   
    submit() {
      const _this = this;
      _this.$refs.ruleForm.validate(valid => {
        console.log(valid);
        if (valid) {
          if (_this.form.url == '') {
            this.$message({
              message: '请上传培训课件！',
              type: 'warning'
            });
            return false;
          }
          let data = JSON.parse(JSON.stringify(_this.form));

          data.insId = _this.$storage.get("userInfo").insId;
          data.courseTypeId = _this.form.courseType;
          delete data.courseType;
          data.questionId = [
            ...new Set([..._this.form.questionId])
          ].join(",");
          console.log("request", data);

          (async data => {
            let res = await _this.$api.trainCourseCreate({
              message: "提交成功",
              data
            });
            if (res && res.code == 0) {
              console.log(res);
              _this.cancel();
            }
          })(data);
        }
      });
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.btn-import {
  // position: absolute;
  // top: 0px;
  // left: 420px;
  margin: 0 0 20px 0;
  width: 400px
}
.submit-wrap{
  margin-top: 40px;
  text-indent: 100px;
}
.btn-item {
  display: inline-block;
  margin-right: 20px;
}

</style>
<style lang="less">
.select-option-item {
  max-width: 560px;
  left: 0;
  white-space: normal;
}
.addSubject {
  .subject-select {
    .el-form-item__content {
      width: 400px;
      .el-select__tags {
        max-height: 200px;
        overflow-y: scroll;
      }
      .el-tag {
        max-width: 380px;
        white-space: normal;
        min-height: 24px;
        height: auto;
        .el-tag__close {
          display: none;  
        }
      }
      .el-upload-list {
        position: absolute;
        right: -200px;
        top: -5px;
      }
    }
  
  }
  .panel-table {
    padding: 20px;
  }
  .vlt-add-more {
    display: block;
    margin:  20px auto;
  } 
  .topicOption  p{
    display: inline-block;
    margin-right: 10px;
  }
}
.addSubject-select-down {
  display: none;
  &.el-select-dropdown{
    max-width: 580px;
  }
  .el-select-dropdown__item{
      display: inline-block;
  }
  .el-select-dropdown__item span {
      min-width: 205px;
      // display: inline-block;
  }
}


// .el-select-dropdown {
 
// }
// .el-select-dropdown__item{
//   max-width: 560px;
//   left: 0;
//   span {
//     max-width: 580px;
//     white-space: normal;
//   }
// }
</style>
