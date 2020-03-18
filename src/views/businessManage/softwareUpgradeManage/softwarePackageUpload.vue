<template>
  <div class="vlt-card">
    <panel :show="true" :title="title">
      <div class="vlt-edit-single package">
        <div class="vlt-edit-wrap">
          <el-form label-position="right" 
            label-width="140px" 
            ref="form"
            :model="form"
            :rules="rules"
            class="soft-form">
            <el-form-item label="软件类型" prop="softType">
              <el-select v-model="form.softType" placeholder="请选择" @change="handleOptions">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="升级方式" prop="packageType">
              <el-select v-model="form.packageType" placeholder="请选择" :disabled="theWayDisabled">
                <el-option
                  v-for="(item) in wayOptins"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传软件" class="upload">
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
            <el-form-item label="软件名称" prop="name">
              <el-input v-model="form.name" :disabled="true" placeholder="自动获取"></el-input> 
            </el-form-item>
            <el-form-item label="版本号" prop="versionCode">
              <el-input v-model="form.versionCode" :disabled="true" placeholder="自动获取"></el-input> 
            </el-form-item>
            <el-form-item label="软件大小" prop="softwareSize">
              <el-input v-model.number="form.softwareSize" :disabled="true" placeholder="自动获取"></el-input> 
            </el-form-item>
            <el-form-item label="链接地址" prop="url">
              <el-input v-model.number="form.url" :disabled="true" placeholder="自动获取"></el-input> 
            </el-form-item>
            <el-form-item label="新版特性" prop="characteristic">
              <el-input v-model="form.characteristic"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入新版特性" maxlength="100"></el-input> 
            </el-form-item>
            <el-form-item label="更新字段" prop="updateField">
              <el-input v-model="form.updateField"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入软件描述" maxlength="100"></el-input> 
            </el-form-item>
            <el-form-item label="软件描述" prop="remark">
              <el-input v-model="form.remark"  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入软件描述" maxlength="100"></el-input> 
            </el-form-item>
            <el-form-item>
              <el-row class="vlt-edit-btn">
                <el-button type="primary" v-prevent="1000" size="medium" @click="submit" :id="$route.name+'-'+'submit'">提交</el-button>
                <el-button size="medium" @click="cancel" :id="$route.name+'-'+'cancel'">取消</el-button>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </panel>
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
      rules: {
        softType: [
          {
            required: true,
            message: "软件类型不能为空",
            trigger: ["change", "blur"]
          }
        ],
        packageType: [
          {
            required: true,
            message: "升级方式不能为空",
            trigger: ["change", "blur"]
          }
        ],
      },
      params: {},
      gameBagPath: [],
      theWayDisabled: null,
      wayOptins: [
        { label: "全量升级", value: 0 },
        { label: "增量升级", value: 1 }
      ],
      options: [
        { label: "投注终端", value: 1 },
        { label: "柜员机软件", value: 2 },
        { label: "维护APP", value: 3 }
      ],
      form: {
        softType:'',
        packageType:'',
        name:'',
        versionCode:'',
        softwareSize:'',
        url:'',
        characteristic:'',
        updateField:'',
        remark:'',
      },
      flag: "",
      MD5: "",
      md5:"",
    };
  },
  watch: {},
  async created() {
    this.title = this.$route.query.type==0?'上传软件包':'编辑软件包';

    if (this.$route.query.id) {
      let data = this.$route.query.id
      let res = await this.$api.querySoftPackageDetail({ data });
      if (res && res.code == 0) {
        console.log("查看结果", res);
      }
      this.md5=res.data.md5
      for(let item in this.form){
        this.form[item]=res.data[item]
      }
      if(res.data.softType==3){
        this.theWayDisabled=true
      }else{
        this.theWayDisabled=false
      }
      // this.upload.forEach(item => {
      //   item.value = res.data[item.prop];
      // });
      // if (res.data.packageType == 0) {
      //   this.upload[0].value = 2;
      // } else {
      //   this.upload[0].value = res.data.packageType;
      // }

      // this.upload[1].value = res.data.softType;
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
        this.form.name= res.data.fileName;
        // this.upload[2].value=res.data.versionName
        this.form.versionCode = res.data.versionCode;
        this.form.softwareSize = res.data.versionSize;
        this.form.url = res.data.filePath;
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
    // changeForm(val) {
    //   this.params = val;
    //   console.log("999", this.params);  
    //   if (this.title === "上传软件包") {
    //     if (this.params.softType == 3) {
    //       // this.upload[0].disabled = true;
    //     } else if (this.params.softType == 1 || this.params.softType == 2) {
    //       // this.upload[0].disabled = false;
    //     }
    //     // if (this.params.packageType == 2) {
    //     //   // this.params.packageType = 0;
    //     // }
    //   } else if (this.title === "编辑软件包") {
    //     if (this.params.softType == 3) {
    //       // this.params.packageType = 0;
    //     }
    //     if (this.params.packageType == 2) {
    //       // this.params.packageType = 0;
    //     }
    //   }
    // },
    handleOptions(){
       if (this.form.softType == 1 || this.form.softType == 2) {
          this.theWayDisabled = false;
          // this.form.packageType=""
        }else if (this.form.softType == 3) {
          this.theWayDisabled = true;
          this.form.packageType=0
        } 
    },
    async submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
      if (this.title === "编辑软件包") {
        this.form.id = this.$route.query.id;
        this.form.md5 = this.MD5||this.md5;
        let data = this.form;
        let res = await this.$api.softPackageEdit({ data });
        console.log(111);
        if (res && res.code == 0) {
          this.$message.success("修改成功");
          this.$router.push({ path: "./softwarePackage" });
        } else {
          // self.$message.warning(res.msg)
        }
      } else if (this.title === "上传软件包") {
        if (this.form.softType == 3) {
          this.form.packageType = 0;
        }
        this.form.md5 = this.MD5;
        let data = this.form;
        let res = await this.$api.addSoftPackage({ data });
        console.log("data", data);
        if (res && res.code == 0) {
          this.$message.success("新增成功");
          this.$router.push({ path: "./softwarePackage" });
        } else {
          // self.$message.warning(res.msg)
        }
      }
        }
      })
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
// .upload {
//   width: 90px;
//   margin-left: 55px;
// }
.package{
  padding-top: 10px;
}
.vlt-edit-btn.el-row {
  margin-left: 0px;
}
.vlt-card{
  padding: 16px;
}
</style>
