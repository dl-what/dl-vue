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
        <el-tab-pane label="资源报废" name="1">
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
                <el-form-item label="报废仓库" prop="outWarehouseId">
                  <el-select filterable v-model.number="form.outWarehouseId" placeholder="请选择出库仓库">
                    <el-option
                      v-for="(item,index) in warehouseData"
                      :key="index"
                      :label="item.label"
                      @click.native="changeSelect(item)"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </panel>
          <panel title="报废物品" :show="true" style="margin-bottom:15px">
            <div v-if="false" class="tr">
              <el-button type="primary" size="small" @click="uploadViseible=true">导入</el-button>
            </div>
            <el-dialog
              class="upload-dialog"
              width="40em"
              :visible.sync="uploadViseible"
              title="导入物品列表"
              :close-on-click-modal="false"
            >
              <el-form label-position="right" label-width="70px">
                <el-form-item label="第一步：">
                  <div class="down-template" @click="downloadTemplate">点击此处下载模板</div>
                </el-form-item>
                <el-form-item label="第二步：">
                  <el-upload
                    ref="upload-exe"
                    class="upload-box"
                    drag
                    action
                    accept=".xls, .xlsx"
                    :limit="1"
                    :show-file-list="true"
                    :before-upload="beforeUploadExcel"
                    :http-request="uploadExcel"
                  >
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
                    <el-button size="medium" type @click="uploadViseible=false">取 消</el-button>
                    <el-button size="medium" type="primary" @click="pushExcel">确 定</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-dialog>

            <div class="table-wrap">
              <el-table :data="tableData" border class="table">
                <el-table-column type="index" label="序号" fixed width="60px"></el-table-column>

                <el-table-column label="物品名称" min-width="160px">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.goodId" filterable placeholder="请选择">
                      <el-option
                        v-for="(item, index) in nameOptions"
                        :key="index"
                        @click.native="selectName(item,scope.row)"
                        :label="item.goodsName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="物品型号" min-width="160px">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.modelId" filterable placeholder="请选择">
                      <el-option
                        v-for="(item, index) in scope.row.modelOptions"
                        :key="index"
                        @click.native="selectModel(item, scope.row)"
                        :label="item.deviceModel"
                        :value="item.modelId"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="物品序列号" min-width="200px">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.goodsSerialNumber" filterable placeholder="请选择">
                      <el-option
                        v-for="(item, index) in scope.row.SerialOptions"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="物品数量" min-width="160px">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.num" :disabled="true"></el-input>
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
              <el-button class="addGoods vlt-add-more" @click="addGoods" icon="el-icon-plus">新增物品</el-button>
            </div>
            <div class="vlt-edit-single">
              <div class="vlt-edit-wrap">
                <el-form-item label="合计金额" prop="totalMoney">
                  <el-input v-model="form.totalMoney" placeholder="合计金额" disabled>
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="报废说明">
                  <el-input
                    v-model="form.remark"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 10}"
                    placeholder="请输入报废说明"
                    maxlength="150"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </panel>
          <panel title="其他附件" :show="true" style="margin-bottom:15px">
            <upload-file v-model="form" uploadUrl="uploadChannelFiles" v-if="isShow"></upload-file>
          </panel>
          <div class="submit-wrap">
            <el-row class="vlt-edit-btn" v-if="!disabled">
              <el-button type="primary" size="medium" @click="submit">提交</el-button>
              <el-button type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
              <el-button size="medium" @click="cancel">取消</el-button>
            </el-row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资源报废流程图" name="2" v-if="isValid">
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
  name: "resourceScrap",
  components: {
    uploadFile
  },
  data() {
    return {
      isValid: false,
      isShow: false, // 用于回填 需要控制 不然子组件生命周期监听不到
      diagramImg: "",
      disabled: false,
      nameOptions: [],
      tableData: [],
      activeName: "1",
      rules: {
        resourceApplyTitle: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "申请标题",
            trigger: ["change", "blur"]
          }
        ],
        outWarehouseId: [
          {
            required: true,
            message: "请选择报废仓库",
            trigger: ["change", "blur"]
          }
        ]
      },
      form: {
        attachId: "", // 上传地址
        // ownChannelId: "", // 渠道id
        createBy: storage.get("userInfo").userId,
        createByName: storage.get("userInfo").userName,
        outWarehouseId: "",
        outWarehouseName: "",
        ownUserId: storage.get("userInfo").userId,
        ownUserName: storage.get("userInfo").userName,
        // preScrapDate: "", // 报废时间
        remark: "",
        resourceApplyTitle: "",
        totalMoney: "",
        warehouseGoodsInfoList: []
      },
      warehouseData: [], // 出/入库 下拉框数据
      attachId: [],
      excelList: [],
      uploadViseible: false,
      actBusinessInsId: null
    };
  },
  watch: {
    tableData: {
      // 深度监听 监听对象，数组的变化
      handler(newValue, oldValue) {
        newValue.forEach((item, index) => {
          item.amount = (item.unitPrice * item.num).toFixed(2);
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
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get("userInfo").insId;
    // 是否审批流程校验
    this.validProcess();
    //获取仓库信息
    this.getWarehouse();
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
      let router = this.$route.name;
      let data = {
        router,
        actBusinessInsId: this.actBusinessInsId
      };
      (async data => {
        let res = await self.$api.validProcess({ data });
        if (res && res.code == 0) {
          self.isValid = res.data.valid;
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${this.actBusinessInsId}`;
        }
      })(data);
    },
    //获取出入库仓库信息
    async getWarehouse() {
      const self = this;
      let param = {};
      let res = await this.$api.getScrapWarehouseIdList();
      if (res && res.code == 0) {
        for (let item of res.data) {
          item = { label: item.warName, value: item.id };
          self.warehouseData.push(item);
        }
      }
    },
    // 选择出入库下拉框
    changeSelect(val, flag) {
      this.tableData = [];
      // this.form.outWarehouseName = val.label;
      this.getScrapWarehouseGoodsList(val.value);
    },
    async getScrapWarehouseGoodsList(WarehouseId) {
      let res = await this.$api.getScrapWarehouseGoodsList({
        data: WarehouseId
      });
      if (res && res.code === 0) {
        console.log(res);
        this.nameOptions = res.data.map(item => {
          if (item.goodsType === 1) {
            return item;
          }
        });
      }
    },

    //选择物品
    selectName(val, row) {
      row.num = 1;
      row.modelId = null;
      row.goodsSerialNumber = null;
      row.goodName = val.goodsName;
      row.goodsType = val.goodsType;
      row.modelOptions = val.modelInfoVoList;
    },
    //选择型号
    selectModel(val, row) {
      row.goodsSerialNumber = null;
      row.modelId = val.modelId;
      row.SerialOptions = val.goodsSerialNumberList;
      row.unitPrice = (val.unitPrice / 100).toFixed(2);
    },
    // 调拨
    getChannelScrap(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelScrap({ data });
        if (res && res.code == 0) {
          self.$message.success("提交成功");
          self.$router.back();
        }
      })(data);
    },
    // 提交
    submit() {
      const self = this;

      self.$refs.form.validate(valide => {
        if (valide) {
          //提交参数
          let data = JSON.parse(JSON.stringify(self.form));
          self.warehouseData.forEach(item => {
            if (item.value === data.outWarehouseId) {
              data.outWarehouseName = item.label;
            }
          });
          let warehouseGoodsInfoList = JSON.parse(
            JSON.stringify(self.tableData)
          );
          for (let item of warehouseGoodsInfoList) {
            item.unitPrice = self.$common.accMul(item.unitPrice, 100);
            item.num = item.num * 1;
            item.amount = self.$common.accMul(item.amount, 100);
            delete item.modelOptions;
            delete item.SerialOptions;
            delete item.id;
          }
          data.warehouseGoodsInfoList = warehouseGoodsInfoList;
          data.totalMoney = self.$common.accMul(data.totalMoney, 100);
          //回填需要
          let validTableData = JSON.parse(JSON.stringify(self.tableData));
          validTableData.forEach(item => {
            item.unitPrice = self.$common.accMul(item.unitPrice, 100);
            item.num = item.num * 1;
            item.amount = self.$common.accMul(item.amount, 100);
          });
          let validData = {
            ...self.form,
            warehouseGoodsInfoList: validTableData
          };
          validData.outWarehouseName = data.outWarehouseName;
          validData.totalMoney = self.$common.accMul(validData.totalMoney, 100);
          if (self.isValid) {
            let str = JSON.stringify(validData);
            data.actBusiness = {
              router: self.$route.name,
              title: data.resourceApplyTitle,
              id: self.$route.query.id,
              data: str,
              actBusinessInsId: this.actBusinessInsId
            };
            if (!self.$route.query.id) {
              delete data.actBusiness.id;
            }
          } else {
            delete data.title;
          }
          console.log("提交的参数", data);
          self.getChannelScrap(data);
        }
      });
    },
    cancel() {
      this.$router.push({ path: "./channelDeal" });
    },
    save() {
      const self = this;
      let data = JSON.parse(JSON.stringify(self.form));
      self.warehouseData &&
        self.warehouseData.forEach(item => {
          if (item.value === data.outWarehouseId) {
            data.outWarehouseName = item.label;
          }
        });
      if (!self.form.resourceApplyTitle) {
        this.$message.warning("申请标题不能为空");
        return;
      }
      let warehouseGoodsInfoList = JSON.parse(JSON.stringify(self.tableData));
      data.warehouseGoodsInfoList = warehouseGoodsInfoList;
      data.warehouseGoodsInfoList.forEach(item => {
        item.unitPrice = self.$common.accMul(item.unitPrice, 100);
        item.num = item.num * 1;
        item.amount = self.$common.accMul(item.amount, 100);
      });

      let params = {
        router: self.$route.name,
        title: data.resourceApplyTitle,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data),
        actBusinessInsId: this.actBusinessInsId
      };
      if (!self.$route.query.id) {
        // 新建 不需要带上
        delete params.id;
      }
      console.log("暂存的参数", params);
      self.saveDraft(params);
    },
    // 暂存
    saveDraft(data) {
      const self = this;
      (async data => {
        let res = await self.$api.saveDraft({ data });
        if (res && res.code == 0) {
          console.log("res", res.data);
          self.$message.success("保存成功");
          self.$router.back();
        }
      })(data);
    },
    // 回填表单数据详情
    getTaskData(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getTaskData({ data });
        if (res && res.code == 0) {
          let data = JSON.parse(res.data.data);
          self.init(data);
        }
      })(data);
    },
    init(data) {
      console.log(data);
      const self = this;
      self.getScrapWarehouseGoodsList(data.outWarehouseId);
      if (self.$route.query.type == 1) {
        self.form.outWarehouseId = data.outWarehouseName;
      } else {
        self.form.outWarehouseId = data.outWarehouseId;
      }
      data.warehouseGoodsInfoList.forEach(item => {
        item.unitPrice = (item.unitPrice / 100).toFixed(2);
        item.amount = (item.amount / 100).toFixed(2);
      });
      self.form.resourceApplyTitle = data.resourceApplyTitle;
      self.form.remark = data.remark;
      self.tableData = data.warehouseGoodsInfoList;
      self.form.attachId = data.attachId;
      self.isShow = true;
    },

    //添加、删除物品
    deleteGoods(index) {
      this.tableData.splice(index, 1);
    },

    addGoods() {
      let obj = {
        id: null,
        goodName: null,
        modelId: null,

        goodsType: null,
        goodsSerialNumber: null,
        num: null,
        unitPrice: null,
        amount: null,
        remark: null
      };
      this.$set(this.tableData, this.tableData.length, obj);
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
    //导入文件
    async uploadExcel(files) {
      let formData = new FormData();
      formData.append("file", files.file);
      const res = await this.$api.importExcel({
        timeout: 99999999999999,
        message: "上传成功",
        data: formData,
        onUploadProgress(evt) {
          let percent = ((evt.loaded / evt.total) * 100) | 0;
          files.onProgress({ percent: percent });
          // console.log("上传进度事件:", evt);
        }
      });
      if (res && res.code == 0) {
        // console.log("res", res.data);
        this.excelList = JSON.parse(JSON.stringify(res.data));
      } else {
        return false;
      }
    },
    //插入到物品列表
    pushExcel() {
      if (!this.excelList.length) {
        this.$message.warning("请先上传物品清单");
        return;
      }
      if (this.tableData.length) {
        this.$confirm("此操作将会覆盖当前物品列表，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.tableData = this.excelList;
            this.$refs["upload-exe"].clearFiles();
            this.uploadViseible = false;
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });

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
        this.tableData = this.excelList;
        this.$refs["upload-exe"].clearFiles();
        this.uploadViseible = false;
      }

      // console.log(this.excelList);
    },
    beforeUploadExcel(files) {
      const isLt2M = files.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传附件大小不能超过 2MB!");
      }
      return isLt2M;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
</style>
