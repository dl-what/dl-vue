<template>
  <div class="partner-container">
    <panel class="info-panel" title="基本信息" :show="true">
      <base-info :infoList="baseInfoList"></base-info>
    </panel>
    <panel class="info-panel" title="联系信息" :show="true">
      <base-info :infoList="contactsInfoList">
        <li class="info-item">
          <span class="title">证件照片：</span>
          <p class="content"><span class="preview" @click="showPreview = true">查看</span></p>
        </li>
      </base-info>
      <img-preview :showDialog.sync="showPreview" :list="certificatePicList" title="证件照片"></img-preview>
    </panel>
    <panel class="info-panel" title="财务信息" :show="true">
      <base-info :infoList="financialInfoList"></base-info>
    </panel>
    <panel class="info-panel" title="附件信息" :show="true">
      <base-info :infoList="annexInfoList"></base-info>
      <div style="padding: 15px;">
        <el-table :data="tableData" border>
          <el-table-column label="序号" width="80" type="index" fixed></el-table-column>
          <el-table-column label="附件名称" prop="fileName" min-width="140px"></el-table-column>
          <el-table-column label="创建人" prop="corporateName" min-width="140px"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" min-width="140px"></el-table-column>
          <el-table-column label="操作" min-width="80px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="$download(1, scope.row.url)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </panel>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'partnerDetail',
  data() {
    return {
      showPreview: false,
      tableData: [],
      certificatePicList: [],
      baseInfoList: [
        {title: "合作伙伴编号", value: "", prop: "partnerNumber" },
        {title: "所属机构", value: "", prop: "insName" },
        {title: "公司名称", value: "", prop: "corporateName" },
        {title: "合作伙伴等级", value: "", prop: "levelName" },
        {title: "行业类型", value: "", prop: "industryType" },
        {title: "电话号码", value: "", prop: "phone" },
        {title: "传真号码", value: "", prop: "fax" },
        {title: "公司网址", value: "", prop: "companyWebsite" },
        {title: "所属区域", value: "", prop: "range" },
        {title: "详细地址", value: "", prop: "address" },
        {title: "公司简介", value: "", prop: "companyIntroduction" }
      ],
      contactsInfoList:[
        {title: "联系人", value: "", prop: "contacts" },
        {title: "性别", value: "", prop: "sex" },
        {title: "公司职位", value: "", prop: "position" },
        {title: "手机号码", value: "", prop: "cellphone" },
        {title: "电子邮箱", value: "", prop: "email" },
        {title: "身份证号", value: "", prop: "idNumber" },
      ],
      financialInfoList: [
        {title: "开户银行", value: "", prop: "depositBank" },
        {title: "银行账户", value: "", prop: "bankAccount" },
        {title: "发票抬头", value: "", prop: "invoice" },
        {title: "税号", value: "", prop: "taxNumber" },
        {title: "单位地址", value: "", prop: "financialAddress" },
        {title: "手机号码", value: "", prop: "financialCellphone" },
      ],
      annexInfoList: [
        {title: "签约时间", value: "", prop: "signingTime" },
        {title: "到期时间", value: "", prop: "dueTime" },
      ],
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    // 获取详情
    async getDetail() {
      const res = await this.$api.getPartnerDetail({
        data: this.$route.query.id
      })
      if (res && res.code === 0) {
        this.setInfoList(res.data, 'baseInfoList');
        this.setInfoList(res.data, 'contactsInfoList');
        this.setInfoList(res.data, 'financialInfoList');
        this.setInfoList(res.data, 'annexInfoList');
        if (res.data.certificateAddress) {
          this.certificatePicList = res.data.certificateAddress.split(','); 
        }
        if (res.data.contractAddress) {
          const corporateName = this.$storage.get('userInfo').userName;
          const list = res.data.contractAddress.split(',');
          list.forEach(path => {
            this.tableData.push({
              fileName: path.split('/').pop(),
              corporateName,
              createTime: res.data.createTime,
              url: path
            })
          })
        }
      }
    },
    // 设置面板数据
    setInfoList(detail, infoListName) {
      this[infoListName].forEach(item => {
        const val = detail[item.prop];
        this.$set(item, 'value', val);
        if (item.prop === 'sex') {
          this.$set(item, 'value', {1: '男', 2: '女'}[val]);
        }
      })
    },
  }
}
</script>


<style lang="less" scoped>
@import "./less/index.less";
.preview{
  color: #409EFF;
  cursor: pointer;
}
/deep/.el-carousel__arrow{
  background-color: #666;
}
/deep/.el-carousel__item.is-animating{
  transition: transform 0s ease-in-out 0s;
}
/deep/.info-item{
  p{
    a{
      color: #999;
      text-decoration: none;
      display: block;
      padding-bottom: 5px;
      &:hover{
        color: #409EFF;
      }
    }
  }
}
</style>
