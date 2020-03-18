<template>
  <div class="partner-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="合作伙伴新建" name="1">
        <el-steps :active="nextIndex" align-center class="create-partner-steps">
          <el-step title="基础信息" icon="el-icon-edit"></el-step>
          <el-step title="联系信息" icon="el-icon-phone-outline"></el-step>
          <el-step title="财务信息" icon="el-icon-tickets"></el-step>
          <el-step title="附件信息" icon="el-icon-paperclip"></el-step>
        </el-steps>
        <div class="create-pertner-step-bd">
          <base-info-step v-show="nextIndex == 1" ref="baseInfoStep" :editData="editData"></base-info-step>
          <contact-info-step v-show="nextIndex == 2" ref="contactInfoStep" :editData="editData"></contact-info-step>
          <financial-info-step v-show="nextIndex == 3" ref="financialInfoStep" :editData="editData"></financial-info-step>
          <annex-info-step v-show="nextIndex == 4" ref="annexInfoStep" :editData="editData"></annex-info-step>
        </div>
        <div class="create-partner-ft">
          <el-button size="medium" v-if="nextIndex === 1" @click="cancel">取 消</el-button>
          <el-button size="medium" v-else @click="prev">上一步</el-button>
          <el-button size="medium" type="primary" @click="next(nextIndex)" v-if="nextIndex < 4">下一步</el-button>
          <el-button size="medium" type="primary" @click="submit" v-else>提 交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合作伙伴新建流程图" name="2" v-if="isProcessValid">
        <img :src="diagramImg" alt="">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
  import moment from 'moment'
  import baseInfoStep from './components/createPartner/baseInfoStep'
  import contactInfoStep from './components/createPartner/contactInfoStep'
  import financialInfoStep from './components/createPartner/financialInfoStep'
  import annexInfoStep from './components/createPartner/annexInfoStep'
  import ajax from "@/utils/ajax.js"
  
  export default {
    name: 'partnerCreate',
    data() {
      return {
        isProcessValid: false,
        diagramImg: '',
        editData: null,
        id: this.$route.query.id,
        nextIndex: 1,
        activeName: '1'
      };
    },
    computed: {
      isEdit() {
        return this.id ? true : false;
      }
    },
    created() {
      if (this.isEdit) {
        this.getDetail();
      }
      this.validProcess();
    },
    methods: {
      // 获取详情
      async getDetail() {
        const res = await this.$api.getPartnerDetail({
          data: this.$route.query.id
        })
        if (res && res.code === 0) {
          this.editData = res.data;
        }
      },
      // 是否审批流程校验
      validProcess() {
        const self = this;
        let router = this.$route.name;
        let data = {router};
        (async data => {
          let res = await self.$api.validProcess({ data });
          if(res && res.code == 0) {
            self.isProcessValid = res.data.valid;
            self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}`;
          }
        })(data);
      },
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      prev() {
        this.nextIndex--;
        if (this.nextIndex < 1) {
          this.nextIndex = 1;
        }
      },
      nextValidate(compName, cb) {
        this.$refs[compName].$refs.form.validate((valid) => {
          if (valid) {
            this.nextIndex++;
            if (this.nextIndex > 4) {
              this.nextIndex = 4;
            }
          } else {
            return false;
          }
        });
      },
      clearValidate(stepName) {
        this.$refs[stepName].$refs.form.clearValidate();
      },
      next(currentIndex) {
        switch(currentIndex) {
          case 1:
            this.nextValidate('baseInfoStep');
            break;
          case 2:
            this.nextValidate('contactInfoStep');
            break;
          case 3:
            this.nextValidate('financialInfoStep');
            break;
        }
      },
      submit() {
        this.$refs.annexInfoStep.$refs.form.validate(async (valid) => {
          if (valid) {
            const apiName = this.isEdit ? 'editPartner' : 'createPartner';
            const message = this.isEdit ? '编辑成功' : '新增成功';
            const data = {
              ...this.$refs.baseInfoStep.form,
              ...this.$refs.contactInfoStep.form,
              ...this.$refs.financialInfoStep.form,
              ...this.$refs.annexInfoStep.form,
            };
            Object.assign(data, {
              insId: data.insId[data.insId.length - 1],   
              range: data.range[data.range.length - 1],
              signingTime: moment(data.signingTime).format("YYYY-MM-DD HH:mm:ss"),
              dueTime: moment(data.dueTime).format("YYYY-MM-DD HH:mm:ss"),
            })
            if (this.isEdit) {
              data.id = this.id;
            }
            const res = await this.$api[apiName]({
              message,
              data
            })
            if (res && res.code === 0) {
              if(this.isProcessValid) {
                this.$router.push({ name: "myApplication" });
                return;
              }
              this.$router.push({
                name: 'partnerList'
              })
            }
          } else {
            return false;
          }
        });
      },
      cancel() {
        this.clearValidate('baseInfoStep');
        this.clearValidate('contactInfoStep');
        this.clearValidate('financialInfoStep');
        this.clearValidate('annexInfoStep');
        this.$router.back()
      },
    },
    components: {
      baseInfoStep,
      contactInfoStep,
      financialInfoStep,
      annexInfoStep,
    }
  };
</script>

<style lang="less">
@import "./less/index.less";
</style>
