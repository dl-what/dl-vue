<template>
  <div class="vlt-card">
    <el-form
      label-position="right"
      label-width="90px"
      :model="form"
      :rules="rules"
      :disabled="disabled"
      ref="form"
      class="baseInfo"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="资源采购" name="1">
          <panel title="基本信息" :show="true" style="margin-bottom:15px">
            <div class="vlt-edit-single">
              <div class="vlt-edit-wrap">
                <el-form-item label="申请标题" prop="resourceApplyTitle">
                  <el-input
                    v-model="form.resourceApplyTitle"
                    placeholder="请输入申请标题"
                    maxlength="20"
                    show-word-limit
                  ></el-input>
                </el-form-item>

                <el-form-item label="采购员" prop="purchaseUserName">
                  <el-input
                    v-model="form.purchaseUserName"
                    placeholder="请输入采购员名称"
                    maxlength="20"
                    show-word-limit
                  ></el-input>
                </el-form-item>

                <el-form-item label="到货日期" prop="preReceivDate">
                  <el-date-picker
                    v-model="form.preReceivDate"
                    type="date"
                    placeholder="请选择到货日期"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </div>
          </panel>

          <panel title="采购物品" :show="true" style="margin-bottom:15px">
            <div class="tr">
              <el-button type="primary" size="small" @click="uploadViseible=true">导入</el-button>
            </div>
            <el-dialog
              class="upload-dialog"
              width="40em"
              :visible.sync="uploadViseible"
              title="导入物品列表"
              :close-on-click-modal="false"
            >
              <el-form
                label-position="right"
                label-width="70px">
                <el-form-item label="第一步：">
                  <div class="download-text" @click="downloadTemplate">点击此处下载模板</div>
                </el-form-item>
                <el-form-item label="第二步：">
                  <el-upload
                    ref="upload-exe"
                    class=""
                    drag
                    action
                    accept=".xls, .xlsx"
                    :limit="1"
                    :show-file-list="true"
                    :before-upload="beforeUploadExcel"
                    :http-request="uploadExcel">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">只能上传Excel文件</div>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <div class="btn-wrap" style="text-align:right;padding-right:50px;">
                    <el-button size="medium" type="" @click="uploadViseible=false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="pushExcel">确 定</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-dialog>

            <div class="table-wrap">
              <el-form
                label-position="right"
                label-width="0px"
                :model="tableForm"
                ref="tableForm"
                class="table-form"
                :rules="rules"
                :disabled="disabled"
              >
                <el-table :data="tableForm.tableData" border class="table">
                  <el-table-column type="index" label="序号" fixed width="60px"></el-table-column>
                  <el-table-column label="物品名称" min-width="160px">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.goodId" filterable placeholder="请选择物品名称">
                        <el-option
                          v-for="(item, index) in nameOptions"
                          :key="index"
                          @click.native="selectName(index,scope.row)"
                          :label="item.goodsName"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="物品型号" min-width="160px">
                    <template slot-scope="scope">
                      <el-select
                        v-model="scope.row.modelId"
                        filterable
                        placeholder="请选择物品型号"
                        :disabled="scope.row.goodsType == 3||scope.row.goodsType == 4"
                      >
                        <el-option
                          v-for="(item, index) in scope.row.modelOptions"
                          :key="index"
                          :label="item.deviceModel"
                          :value="item.modelId"
                          @click.native="selectModel(index,scope.row)"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="物品序列号" min-width="200px">
                    <template slot-scope="scope">
                      <el-form-item
                        class="purchase"
                        :prop="'tableData.' + scope.$index + '.goodsSerialNumber'"
                        :rules="[{require:false, validator: $rules.checkNoChinese, title:'序列号',trigger:['change','blur']}]"
                      >
                        <el-input
                          :disabled="scope.row.goodsType == 3||scope.row.goodsType == 4"
                          v-model="tableForm.tableData[scope.$index].goodsSerialNumber"
                          placeholder="请输入序列号"
                          maxlength="20"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column label="物品数量" min-width="160px">
                    <template slot-scope="scope">
                      <el-form-item
                        class="purchase"
                        :prop="'tableData.' + scope.$index + '.num'"
                        :rules="[{require:false, validator: $rules.checkPositive, title:'数量',trigger:['change','blur']}]"
                      >
                        <el-input
                          v-model="tableForm.tableData[scope.$index].num"
                          placeholder="请输入数量"
                          :disabled="scope.row.goodsType<3"
                          maxlength="6"
                        ></el-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unitPrice" label="单价（元）" min-width="100px"></el-table-column>
                  <el-table-column prop="amount" label="金额（元）" min-width="100px"></el-table-column>
                  <el-table-column label="备注" min-width="200px">
                    <template slot-scope="scope">
                      <el-input
                        placeholder="请输入备注"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 3}"
                        v-model="scope.row.remark"
                        maxlength="100"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" min-width="80px">
                    <template v-if="$route.query.type !=1" slot-scope="scope">
                      <i class="el-icon-delete delete" @click="deleteGoods(scope.$index)"></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form>
              <el-button class="addGoods vlt-add-more" @click="addGoods" icon="el-icon-plus">新增物品</el-button>
            </div>
            <div class="vlt-edit-single">
              <div class="vlt-edit-wrap">
                <el-form-item label="合计金额" prop="totalMoney">
                  <el-input v-model="form.totalMoney" placeholder="合计金额" disabled>
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="采购说明">
                  <el-input
                    v-model="form.remark"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请输入采购说明"
                    maxlength="150"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </panel>

          <panel title="其他附件" :show="true" style="margin-bottom:15px">
            <upload-file v-model="form" v-if="isShow" uploadUrl="uploadChannelFiles"></upload-file>
          </panel>

          <div class="submit-wrap">
            <el-row class="vlt-edit-btn" v-if="!disabled">
              <el-button type="primary" size="medium" @click="submit">提交</el-button>
              <el-button type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
              <el-button size="medium" @click="cancel">取消</el-button>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资源采购流程图" name="2" v-if="isValid">
          <img :src="diagramImg" alt />
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script type="text/javascript">
import ajax from "@/utils/ajax.js";
import storage from "@/utils/storage";
import uploadFile from "../components/uploadFiles";

export default {
  name: "resourcePurchase",
  components: {
    uploadFile
  },
  data() {
    return {
      disabled: false,
      isValid: false,
      isShow: false, // 用于回填 附件
      diagramImg: null,
      insId: this.$storage.get("userInfo").insId,
      activeName: "1",
      nameOptions: [],
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      rules: {
        resourceApplyTitle: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "申请标题",
            trigger: ["change", "blur"]
          }
        ],
        purchaseUserName: [
          {
            required: true,
            message: "请输入采购员名称",
            trigger: ["change", "blur"]
          }
        ],
        preReceivDate: [
          {
            required: true,
            message: "请选择到货日期",
            trigger: ["change", "blur"]
          }
        ]
      },
      form: {
        resourceApplyTitle: null,
        purchaseUserName: null,
        preReceivDate: null,
        attachId: null,
        createBy: this.$storage.get("userInfo").userId,
        createByName: this.$storage.get("userInfo").userName,
        ownUserId: this.$storage.get("userInfo").userId,
        ownUserName: this.$storage.get("userInfo").userName,
        remark: null,
        totalMoney: null,
        warehouseGoodsInfoList: []
      },
      tableForm: {
        tableData: []
      },
      checkSerial: false,
      excelList: [],
      uploadViseible: false
    };
  },
  watch: {
    "tableForm.tableData": {
      // 深度监听 监听对象，数组的变化
      handler(newValue, oldValue) {
        let obj = {};
        newValue.forEach((item, index) => {
          item.amount = (item.unitPrice * item.num).toFixed(2);
          // 序列号 去重
          if (!obj[item.goodsSerialNumber]) {
            obj[item.goodsSerialNumber] = item.goodsSerialNumber;
            this.checkSerial = false;
          } else {
            this.$message.warning("序列号不能相同");
            this.checkSerial = true;
          }
        });
        let num = 0;
        for (let i = 0; i < newValue.length; i++) {
          num = num + newValue[i].amount * 1;
        }
        this.form.totalMoney = num.toFixed(2);

        let params = JSON.parse(JSON.stringify(newValue));
      },

      deep: true
    }
  },
  created() {
    // 控制表单是否禁用
    this.disabled = this.$route.query.type == "1" ? true : false;
    this.validProcess();
    this.getModelTree();
    if (this.$route.query.id) {
      let data = this.$route.query.id;
      this.getTaskData(data);
    } else {
      this.isShow = true;
    }
  },
  methods: {
    // 是否审批流程校验
    validProcess() {
      const self = this;
      let data = { router: this.$route.name, actBusinessInsId: this.insId };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.insId}`;
        }
      })(data);
    },
    // 回填表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          let data = JSON.parse(res.data.data);
          self.init(data);
        }
      })(data);
    },
    init(data) {
      console.log("资源采购", data);
      const self = this;
      data.warehouseGoodsInfoList.forEach(item => {
        item.unitPrice = (item.unitPrice / 100).toFixed(2);
        item.amount = (item.amount / 100).toFixed(2);
      });
      self.tableForm.tableData = data.warehouseGoodsInfoList;
      self.form.resourceApplyTitle = data.resourceApplyTitle;
      self.form.purchaseUserName = data.purchaseUserName;
      self.form.preReceivDate = data.preReceivDate;
      self.form.remark = data.remark;
      self.form.attachId = data.attachId;
      this.isShow = true;
    },
    // 获取所有物品
    async getModelTree() {
      let res = await this.$api.getModelTree();
      if (res && res.code == 0) {
        this.nameOptions = res.data;
      }
    },

    // 选择物品
    selectName(index, row) {
      row.num = 1;
      row.modelId = null;
      row.goodsSerialNumber = null;
      row.goodsName = this.nameOptions[index].goodsName;
      row.goodsType = this.nameOptions[index].goodsType;
      for (let item of this.nameOptions) {
        if (item.goodsType === 1 || item.goodsType === 2) {
          row.modelOptions = this.nameOptions[index].modelInfoVoList;
        } else if (item.goodsType === 3 || item.goodsType === 4) {
          row.unitPrice = (this.nameOptions[index].unitPrice / 100).toFixed(2);
        }
      }
    },
    //选择物品型号
    selectModel(index, row) {
      row.goodsSerialNumber = "";
      row.unitPrice = (row.modelOptions[index].unitPrice / 100).toFixed(2);
    },
    //采购
    channelResPurcApply(data) {
      const self = this;
      (async data => {
        let res = await self.$api.channelResPurcApply({
          message: "提交成功",
          data
        });
        if (res && res.code == 0) {
          self.$router.back();
        }
      })(data);
    },
    // 提交
    submit() {
      const self = this;
      let data = JSON.parse(JSON.stringify(self.form));
      data.preReceivDate = self
        .$moment(data.preReceivDate)
        .format("YYYY-MM-DD HH:mm:ss");
      let checkTable;
      self.$refs.tableForm.validate(valide => {
        checkTable = valide;
      });
      let checkForm;
      self.$refs.form.validate(valide => {
        checkForm = valide;
      });
      if (checkTable && checkForm) {
        let warehouseGoodsInfoList = JSON.parse(
          JSON.stringify(self.tableForm.tableData)
        );
        // 回填数据
        let validTableData = JSON.parse(
          JSON.stringify(self.tableForm.tableData)
        );
        validTableData.forEach(item => {
          item.unitPrice = self.$common.accMul(item.unitPrice, 100);
          item.num = item.num * 1;
          item.amount = self.$common.accMul(item.amount, 100);
        });

        if (self.checkSerial) {
          this.$message.warning("序列号不能重复");
          return;
        }
        for (let item of warehouseGoodsInfoList) {
          item.unitPrice = self.$common.accMul(item.unitPrice, 100);
          item.num = item.num * 1;
          item.amount = self.$common.accMul(item.amount, 100);
          delete item.modelOptions;
        }
        data.warehouseGoodsInfoList = warehouseGoodsInfoList;

        data.totalMoney = self.$common.accMul(data.totalMoney, 100);

        let validData = {
          ...self.form,
          warehouseGoodsInfoList: validTableData
        };
        validData.totalMoney = self.$common.accMul(validData.totalMoney, 100);
        validData.preReceivDate = self
          .$moment(validData.preReceivDate)
          .format("YYYY-MM-DD HH:mm:ss");
        if (self.isValid) {
          let str = JSON.stringify(validData);
          data.actBusiness = {
            actBusinessInsId: this.insId,
            router: "resourcePurchase",
            title: data.resourceApplyTitle,
            id: self.$route.query.id,
            data: str
          };
          if (!self.$route.query.id) {
            delete data.actBusiness.id;
          }
        }
        // debugger
        console.log("提交的参数", data);
        self.channelResPurcApply(data);
      } else {
        this.$message.warning("校验不通过");
      }
    },

    save() {
      const self = this;
      let data = JSON.parse(JSON.stringify(self.form));
      if (data.preReceivDate) {
        data.preReceivDate = self
          .$moment(data.preReceivDate)
          .format("YYYY-MM-DD HH:mm:ss");
      }
      if (!self.form.resourceApplyTitle) {
        this.$message.warning("申请标题不能为空");
        return;
      }

      data.warehouseGoodsInfoList = JSON.parse(
        JSON.stringify(self.tableForm.tableData)
      );
      data.warehouseGoodsInfoList.forEach(item => {
        item.unitPrice = self.$common.accMul(item.unitPrice, 100);
        item.num = item.num * 1;
        item.amount = self.$common.accMul(item.amount, 100);
      });
      let params = {
        actBusinessInsId: this.insId,
        router: "resourcePurchase",
        title: data.resourceApplyTitle,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data)
      };
      if (!self.$route.query.id) {
        delete params.id;
      }
      console.log("暂存的参数", params);
      self.saveDraft(params);
    },
    // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ message: "保存成功", data });
        if (res && res.code === 0) {
          self.$router.back();
        }
      })(data);
    },

    cancel() {
      this.$router.push({ path: "channelDeal" });
    },
    //添加、删除物品
    deleteGoods(index) {
      this.tableForm.tableData.splice(index, 1);
    },
    addGoods() {
      let obj = {
        goodName: null,
        modelId: null,
        goodsSerialNumber: null,
        goodsType: null,
        num: null,
        unitPrice: null,
        amount: null,
        remark: null,
        modelOptions: []
      };
      this.$set(this.tableForm.tableData, this.tableForm.tableData.length, obj);
    },

    //物品导入
    //下载模板
    async downloadTemplate() {
      let res = await this.$api.resPurcTemplateDown({ responseType: "blob" });
      let temp = res.headers["content-disposition"];
      const fileName = temp.split("=").reverse()[0];
      const reader = new FileReader();
      reader.readAsDataURL(res.blob);
      reader.onload = e => {
        const a = document.createElement("a");
        a.download = decodeURI(fileName);
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    },
    beforeUploadExcel(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传附件大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //导入文件
    async uploadExcel(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      const res = await this.$api.importExcel({
        timeout: 99999999999999,
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0;
          files.onProgress({ percent: percent });
          // console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code == 0) {
        this.$message.success("上传成功");
        console.log("res", res.data);
        this.excelList = JSON.parse(JSON.stringify(res.data));
      }
    },
    //插入到物品列表
    pushExcel() {
      if (!this.excelList.length) {
        this.$message.warning("请先上传物品清单");
        return;
      }
      if (this.tableForm.tableData.length) {
        this.$confirm("此操作将会覆盖当前物品列表，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.tableForm.tableData = this.excelList;
            this.$refs["upload-exe"].clearFiles();
            this.uploadViseible = false;
          })
          .catch(() => {
            this.$message({
              type: "warning",
              message: "已取消"
            });
          });
          console.log(this.excelList);
        this.excelList.forEach(item => {
          if (item.goodsType === 1 || item.goodsType === 2) {
            for (let val of this.nameOptions) {
              if (item.goodsName == val.goodsName) {
                item.modelOptions = val.modelInfoVoList;
              }
            }
          }
        });
      } else {
        this.tableForm.tableData = this.excelList;
        this.$refs["upload-exe"].clearFiles();
        this.uploadViseible = false;
      }
      // console.log(this.excelList);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
.purchase {
  margin-bottom: 0;
}
.download-text{
  color: #409EFF;
  cursor: pointer;
}
</style>
