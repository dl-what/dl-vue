<template>
  <div>
    <el-form label-position="right" 
      label-width="140px" 
      :model="form"
      :rules="rules"
      ref="form"
      :disabled="type!='0'"
      class="baseInfo">
      <!-- <el-form-item label="角色名称" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择">
          <el-option v-for="(items,index) in roleData" :key="index" :label="items.label"
            @wclick.native="changeSelect(items)"
            :value="items.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="姓名" prop="accountName">
        <el-input v-model="form.accountName" placeholder="请输入姓名" maxlength="15" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group @change="changeRadio" v-model="form.sex">
          <el-radio 
            v-for="(list,index) in sexData"
            :key="index"
            :label="list.value">{{list.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model.number="form.phone" placeholder="请输入手机号码" maxlength="11" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="身份证号" prop="channelIdentity">
        <el-input v-model="form.channelIdentity" @blur="getAge" placeholder="请输入身份证号码" maxlength="18" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="form.age" disabled placeholder="自动获取" maxlength="3" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="联系地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入联系地址" maxlength="50" show-word-limit></el-input> 
      </el-form-item>
      <el-form-item label="证件照片" class="photo">
        <div>
          <div v-for="(item,index) in cardImg" :key="index" class="el-upload-list">
            <img class="el-upload-list__item-thumbnail" :src="item" alt="" style="height: 150px;width: 150px; padding: 3px">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="preview(item)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span class="el-upload-delete" @click="imgRemove(cardImg,index)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
          <el-upload
            action=""
            class="upload-wrap"
            list-type="picture-card"
            :auto-upload="true"
            accept=".png,.jpg,.jpeg"
            :show-file-list="false"
            :on-remove="imgRemove"
            :before-upload="beforeUploadFile"
            :http-request="uploadCardImg">
              <i slot="default" class="el-icon-plus"></i>
          </el-upload>
        </div>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/javascript">

export default {
  name: "",
  model: {
    prop: 'form',
    event: 'returnBack'
  },
  props: {
    form: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      rules: {
        roleId: [
          { required: true, message: '角色类型不能为空', trigger: ['change','blur'] }
        ],
        accountName: [
          { required: true, validator: this.$rules.checkName, title: '姓名', trigger: ['change','blur'] }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: ['change','blur'] }
        ],
        age: [
          { required: true, validator: this.$rules.checkPositive, title: '年龄', trigger: ['change','blur'] }
        ],
        address: [
          { required: true, message: '联系地址不能为空', trigger: ['change','blur'] }
        ],
        phone: [
          { required: true, validator: this.$rules.checkPhone, trigger: ['change','blur'] }
        ],
        channelIdentity: [
          { required: true, validator: this.$rules.checkIdCard, trigger: ['change','blur'] }
        ],
      },
      roleData:[],
      sexData: [{label:'男', value:'男'},{label:'女',value:'女'}],
      cardImg: [],
      dialogImageUrl: '',
      dialogVisible: false,
      type: this.$route.query.type,
    }
  },
  watch: {
    cardImg: {
      handler(value) {
        if(value.length>0) {
          console.log(this.cardImg)
          this.form.photo = this.cardImg.join(',')
        }else{
          this.form.photo = '';
        }
      },
      deep: true,
    }
  },
  created() {
    this.getManagerRole()
    // 回填
    let array = this.form&&this.form.photo&&this.form.photo.split(',')
    array&&array.forEach((item)=>{
      // let obj = {};
      // obj.name = item.split('/')[item.split('/').length-1];
      // obj.url = item;
      this.cardImg.push(item)
    })
  },
  methods: {
    getAge() {
      if(this.form.channelIdentity.length>10) {
        this.form.age = new Date().getFullYear() - this.form.channelIdentity.slice(6, 10)
      }
    },
    changeRadio() {

    },
    changeSelect() {

    },
    beforeUploadFile() {

    },
    // 证照上传
    async uploadCardImg(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      const res = await this.$api.uploadChannelFiles({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          console.log("上传进度事件:", evt);
        }
      })
      if(res&&res.code==0) {
        // this.cardImg.push(res.data.filePath)
        if (this.cardImg.length > 6) {
          // this.cardImg.splice(-1, 1);
          this.$message.error("证件照片数量不能超过7个");
          return;
        }
        console.log('uploadFile', res);
        this.cardImg.push(res.data.filePath)
      }
    },
    imgRemove(data,index) {
      data.splice(index,1)
    },
    preview(imgUrl) {
      this.dialogImageUrl = imgUrl;
      this.dialogVisible = true;
    },
    // 角色名称 下拉框
    getManagerRole() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.getManagerRole({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let arr = [];
          let obj = {};
          obj.label = res.data.roleName;
          obj.value = res.data.id;
          arr.push(obj);
          self.form.roleId = res.data.id;
          self.roleData = arr;
        } else {
          // self.$message.warning(res.msg)
        }
      })(data);
    },
    handleRemove() {

    },
    // 校验
    validate(callback) {
      // this.$emit('change', this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('校验通过')
          // this.$emit('asset')
          callback('true')
        }else{
          console.log('校验不通过')
          callback('false');
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.title-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-upload-list{
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  margin: 0 8px 8px 0;
  display: inline-block;
}
.el-upload-list__item-actions{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0,0,0,.5);
  transition: opacity .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-upload-list__item-actions:hover {
    opacity: 1;
}
.el-upload-list{
  transition: all .5s cubic-bezier(.55,0,.1,1);
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  position: relative;
}
.upload-wrap{
  width: 148px;
  height: 148px;
  display: inline-block;
  overflow: hidden;
  margin: 0 8px 8px 0;
}
.el-upload-list__item-preview,
.el-upload-delete{
  margin: 0 15px;
  cursor: pointer;
}
</style>
