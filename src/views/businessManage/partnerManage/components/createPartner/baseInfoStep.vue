<template>
  <div class="step-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="12em">
      <el-form-item label="所属机构" prop="insId">
        <el-cascader
          v-model="form.insId"
          :options="insDataList"
          :props="{
            label: 'text',
            value: 'id',
            children: 'children',
            checkStrictly: true
          }"
          placeholder="请选择所属机构"
          clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="合作伙伴编号" prop="partnerNumber">
        <el-input v-model="form.partnerNumber" placeholder="请输入合作伙伴编号" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="合作伙伴等级" prop="partnerLevelId">
        <el-select v-model="form.partnerLevelId" placeholder="请选择合作伙伴等级">
          <el-option :label="item.gradeName" :value="item.id" v-for="(item, index) in levelList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="公司名称" prop="corporateName">
        <el-input v-model="form.corporateName" placeholder="请输入公司名称" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="行业类型">
        <el-input v-model="form.industryType" placeholder="请输入行业类型" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="座机号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入座机号码，示例XXXX-XXXXXXX"  maxlength="13" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="传真号码">
        <el-input v-model="form.fax" placeholder="请输入传真号码" maxlength="13" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="公司网址">
        <el-input v-model="form.companyWebsite" placeholder="请输入公司网址" maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="公司地址" prop="range">
        <el-cascader
          ref="addressCascader"
          v-model="form.range"
          :props="{
            label: 'text',
            value: 'code',
            children: 'children'
          }"
          @change="selectAdrChange"
          :options="addressList"
          placeholder="请选择省/市/区"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="address">
        <el-input v-model="form.address" placeholder="请输入详细地址" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="公司简介">
        <el-input type="textarea" v-model="form.companyIntroduction" placeholder="请输入公司简介" maxlength="150"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import storage from '@/utils/storage'
  import {treeReselection} from '@/utils/treeSelection'
  import rules from '@/utils/rules'
  export default {
    name: 'step',
    props: {
      editData: {
        default: null
      }
    },
    data() {
      return {
        insId: storage.get('userInfo').insId,
        insDataList: [],
        addressList: [],
        levelList: [],
        form: {
          insId: '',
          partnerNumber: '',
          partnerLevelId: '',
          corporateName: '',
          industryType: '',
          phone: '',
          fax: '',
          companyWebsite: '',
          range: '',
          address: '',
          companyIntroduction: '',
        },
        rules: {
          insId: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请选择所属机构'}
          ],
          partnerNumber: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入合作伙伴编号'}
          ],
          partnerLevelId: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请选择合作伙伴等级'}
          ],
          corporateName: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入公司名称'}
          ],
          phone: [
            { required: true, validator: rules.checkMobile, trigger: ['blur', 'change'], title: '座机号码'}
          ],
          range: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请选择公司所在省市区'}
          ],
          address: [
            { required: true, validator: rules.checkEmpty, trigger: ['blur', 'change'], message: '请输入公司详细地址'}
          ],
        }
      };
    },
    watch: {
      editData(data) {
        if (data) {
          Object.keys(this.form).forEach(prop => {
            this.form[prop] = data[prop];
          })
        }
      },
    },
    created() {
      this.getInsDataList();
      this.getAddressList();
      this.getLevelList();
    },
    methods: {
      // 获取机构列表
      async getInsDataList() {
        const res = await this.$api.getInsDataList();
        if (res && res.code === 0) {
          const list = res.data;
          const topItem = list[0];
          // 过滤中福彩
          if (topItem && topItem.id == 1) {
            this.insDataList = topItem.children || [];
          } else {
            this.insDataList = list || [];
          }
          if (this.editData) {
            // 机构回填级联
            this.form.insId = treeReselection({
              treeData: this.insDataList,
              keyValue: this.form.insId
            }).map(item => item.id);
          }
        }
      },
      // 获取省市区列表
      async getAddressList() {
        const res = await this.$api.getChannelAddress({
          data: {
            insId: 1,
            type: 0
          }
        });
        if (res && res.code === 0) {
          this.addressList = res.data[0].children || [];
          if (this.editData) {
            // 地址回填级联
            this.form.range = this.$formMethods.getInsArray(
              this.form.range, 
              'code', 
              this.addressList,
              'code'
            ).reverse();
          }
        }
      },
      // 获取合作伙伴等级列表
      async getLevelList() {
        const res = await this.$api.getPartnerLevelList({
          data: {
            page: 1,
            pageSize: 100,
            param: {
              insId: this.insId
            }
          }
        })
        if (res && res.code === 0) {
          this.levelList = res.data.records || [];
        }
      },
      // 地址选择change
      selectAdrChange(val) {
        console.log('selected-adr', val);
      }

    }
  };
</script>

<style lang="less" scoped>
  .el-upload__tip{
    margin-top: 10px;
  }
</style>
