<template>
  <div class="vlt-card">
    <div class="vlt-edit-single">
      <h2 class="title">{{title}}</h2>
      <div class="vlt-edit-wrap">
        <el-form label-position="right" label-width="90px" :model="form" ref="form">
          <el-form-item label="上传文件" class="upload">
            <el-upload
              class="upload-demo"
              action=""
              accept=".apk,.gz"
              :limit="1"
              :file-list="gameBagPath"
              :show-file-list="true"
              :on-remove="gameBagRemove"
              :http-request="uploadFile"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <base-form
          :formData="upload"
          labelWidth="140px"
          ref="baseForm"
          :rules="rules"
          direction="right"
          @change="changeForm"
        ></base-form>
      </div>
    </div>
    <el-row class="vlt-edit-btn">
      <el-button type="primary" v-prevent="1000" size="medium" @click="submit" :id="$route.name+'-'+'submit'">提交</el-button>
      <el-button size="medium" @click="cancel" :id="$route.name+'-'+'cancel'">取消</el-button>
    </el-row>
  </div>
</template>

<script type="text/javascript">
import { async } from "q";
import { delimiter } from 'path';
export default {
  name: "",
  data() {
    return {
      title: "",
      rules: {},
      params: {},
      gameBagPath: [],
      upload: [
        {
          title: "升级类型",
          type: "select",
          prop: "packageType",
          value: "",
          disabled: false,
          options: [
            { label: "全量升级", value: 2 },
            { label: "增量升级", value: 1 }
          ]
        },
        {
          title: "软件类型",
          type: "select",
          prop: "softType",
          value: "",
          options: [
            { label: "投注终端", value: 1 },
            { label: "柜员机软件", value: 2 },
            { label: "维护APP", value: 3 }
          ]
        },
        {
          title: "软件名称",
          type: "input",
          prop: "name",
          disabled: true,
          value: "",
          placeholder: ""
        },
        // {
        //   title: "版本名称",
        //   type: "input",
        //   prop: "versionName",
        //   value: "",
        //   placeholder: "",
        //   disabled: true,
        // },
        {
          title: "版本号",
          type: "input",
          prop: "versionCode",
          value: "",
          placeholder: "",
          disabled: true
        },
        {
          title: "软件大小",
          type: "input-unit",
          prop: "softwareSize",
          value: "",
          // unit: "M",
          disabled: true,
          placeholder: "",
          disabled: true
        },
        // {
        //   title: "md5值",
        //   type: "input",
        //   prop: "md5",
        //   value: "",
        //   placeholder: ""
        // },
        {
          title: "链接地址",
          type: "input",
          prop: "url",
          value: "",
          placeholder: "",
          disabled: true
        },
        {
          title: "新版特性",
          type: "textarea",
          prop: "characteristic",
          value: "",
          maxlength: "100"
        },
        {
          title: "更新字段",
          type: "textarea",
          prop: "updateField",
          value: "",
          maxlength: "100"
        },
        {
          title: "软件描述",
          type: "textarea",
          prop: "remark",
          value: "",
          maxlength: "100"
        }
      ],
      form: {},
      flag: "",
      MD5: "",
      md5:"",
    };
  },
  watch: {},
  async created() {
    this.title = this.$route.query.title;

    if (this.$route.query.id) {
      let data = this.$route.query.id
      let res = await this.$api.querySoftPackageDetail({ data });
      if (res && res.code == 0) {
        console.log("查看结果", res);
      }
      // console.log("ifo是", this.$route.query.ifo);
      // let arr2 = Object.keys(this.$route.query.ifo);
      this.md5=res.data.md5
      this.upload.forEach(item => {
        item.value = res.data[item.prop];
        // console.log("item是", item);
      });
      if (res.data.packageType == 0) {
        this.upload[0].value = 2;
      } else {
        this.upload[0].value = res.data.packageType;
      }

      this.upload[1].value = res.data.softType;
    }
  },
  methods: {
    // 上传
    async uploadFile(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      // formData.append("type", 2);
      const res = await this.$api.softPackageUploading({ //softPackageUploading
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0; //调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          files.onProgress({ percent: percent });
        }
      });
      console.log("上传", res);
      if (res && res.code == 0) {
        this.$message.success("上传成功");
        console.log("222", this.gameBagPath);
        this.gameBagPath.push(res.data.filePath);
        // this.upload.forEach(item=>{
        // })
        this.upload[2].value = res.data.fileName;
        // this.upload[2].value=res.data.versionName
        this.upload[3].value = res.data.versionCode;
        this.upload[4].value = res.data.versionSize;
        this.upload[5].value = res.data.filePath;
        this.MD5 = res.data.fileMd5;
      }
    },
    gameBagRemove(file) {
      //上传移除
      this.gameBagPath.forEach((item, index) => {
        if (item.indexOf(file.name) > -1) {
          this.gameBagPath.splice(index, 1);
        }
      });
    },
    changeForm(val) {
      this.params = val;
      console.log("999", this.params);  
      if (this.title === "上传软件包") {
        if (this.params.softType == 3) {
          this.upload[0].disabled = true;
        } else if (this.params.softType == 1 || this.params.softType == 2) {
          this.upload[0].disabled = false;
        }
        if (this.params.packageType == 2) {
          this.params.packageType = 0;
        }
      } else if (this.title === "编辑软件包") {
        if (this.params.softType == 3) {
          this.params.packageType = 0;
        }
        if (this.params.packageType == 2) {
          this.params.packageType = 0;
        }
      }
    },
    // softPackageEdit(data) {  //编辑
    //     (async data => {
    //       let res = await this.$api.softPackageEdit({ data });
    //       console.log(111)
    //       if (res && res.code == 0) {
    //         this.$message.success("修改成功");
    //         this.$router.push({ path: "./softwarePackage" });
    //       } else {
    //         // self.$message.warning(res.msg)
    //       }
    //     })(data);
    // },
    async submit() {
      if (this.title === "编辑软件包") {
        this.params.id = this.$route.query.id;
        this.params.md5 = this.md5;
        let data = this.params;
        let res = await this.$api.softPackageEdit({ data });
        console.log(111);
        if (res && res.code == 0) {
          this.$message.success("修改成功");
          this.$router.push({ path: "./softwarePackage" });
        } else {
          // self.$message.warning(res.msg)
        }
      } else if (this.title === "上传软件包") {
        if (this.params.softType == 3) {
          this.params.packageType = 0;
        }
        this.params.md5 = this.MD5;
        let data = this.params;
        let res = await this.$api.addSoftPackage({ data });
        console.log("data", data);
        if (res && res.code == 0) {
          this.$message.success("新增成功");
          this.$router.push({ path: "./softwarePackage" });
        } else {
          // self.$message.warning(res.msg)
        }
      }
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
// .upload-demo{
//     margin-left:50px
//   }
.upload {
  width: 90px;
  margin-left: 55px;
}
.vlt-edit-btn.el-row {
  margin-left: 160px;
}
</style>
