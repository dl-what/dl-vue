<template>
  <div class="vlt-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="销售权限" name="1">
        <panel title="销售权限" :show="true" style="margin-bottom:15px">
          <div class="vlt-edit-single">
            <div class="vlt-edit-wrap">
              <el-form
                label-position="right"
                label-width="90px"
                :model="form"
                ref="form"
                :disabled="disabled"
                class="device-form"
                :rules="rules"
              >
                <el-form-item label="申请标题" prop="title" v-if="isValid">
                  <el-input v-model="form.title" placeholder="请输入标题" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="修改方式" prop="type">
                  <el-select v-model="form.type" placeholder="请选择修改方式">
                    <el-option label="渠道编号" :value="0"></el-option>
                    <el-option label="渠道区域" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="渠道编号" v-if="form.type=='0'" prop="channelNo">
                  <el-select v-model="form.channelNo" filterable placeholder="请选择渠道编号">
                    <el-option
                      v-for="(item,index) in channelData"
                      :key="index"
                      @click.native="selectChannelNo(item)"
                      :label="item.channelNo"
                      :value="item.channelNo"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="渠道编号" prop="channelNo" v-if="form.type=='0'">
                  <el-input @blur="selectChannelNo" v-model="form.channelNo" maxlength="10" show-word-limit placeholder="请输入渠道编号"></el-input>
                </el-form-item>
                <el-form-item label="渠道区域" v-if="form.type=='1'" prop="insId">
                  <el-cascader
                    v-model="form.insId"
                    :options="areaData"
                    :props="setProps"
                    @change="queryGameRight"
                    placeholder="请选择渠道区域"
                  ></el-cascader>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-table :data="tableData" border class="table" disabled>
            <el-table-column type="index" label="序号" width="55px"></el-table-column>
            <el-table-column label="游戏名称" prop="gameName" min-width="140px"></el-table-column>
            <el-table-column label="投注权限" min-width="120px">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.throwRight"
                  :active-text="scope.row.throwRight==1?'允许':'禁止'"
                  :inactive-value="0"
                  :active-value="1"
                  :disabled="disabled"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="兑奖权限" min-width="120px">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.cashRight"
                  :active-text="scope.row.cashRight==1?'允许':'禁止'"
                  :inactive-value="0"
                  :active-value="1"
                  :disabled="disabled"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="销售时间" min-width="280px">
              <template slot-scope="scope">
                <el-time-picker
                  is-range
                  :disabled="scope.row.throwRight=='0'||disabled"
                  v-model="scope.row.time"
                  range-separator="——"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  class="time"
                ></el-time-picker>
              </template>
            </el-table-column>
            <el-table-column label="生效时间" min-width="250px">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.effectTime"
                  :picker-options="pickerOptions"
                  type="datetime"
                  align="right"
                  placeholder="选择日期时间"
                  class="datetime"
                ></el-date-picker>
              </template>
            </el-table-column>
          </el-table>
        </panel>
        <panel title="其他附件" :show="true" style="margin-bottom:15px">
          <upload-file v-if="isShow" v-model="form" uploadUrl="uploadChannelFiles"></upload-file>
        </panel>
        <div class="submit-wrap">
          <el-row class="vlt-edit-btn" v-if="!disabled">
            <el-button type="primary" size="medium" @click="submit">提交</el-button>
            <el-button type="danger" plain size="medium" @click="save" v-if="isValid">暂存</el-button>
            <el-button size="medium" @click="cancel">取消</el-button>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="销售权限流程图" name="2" v-if="isValid">
        <img :src="diagramImg" alt />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/javascript">
import moment from "moment";
import uploadFile from "../components/uploadFiles";
import ajax from "@/utils/ajax.js";

export default {
  name: "",
  components: {
    uploadFile
  },
  data() {
    return {
      pickerOptions: this.beginDate(),
      disabled: false,
      isValid: false,
      isShow: false,
      diagramImg: "",
      activeName: "1",
      form: {
        title: null,
        type: 0,
        channelNo: null,
        insId: null,
        filePath: null,
        //接收子组件传过来的文件路径
        attachId: null
      },
      rules: {
        title: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "申请标题",
            trigger: ["change", "blur"]
          }
        ],
        type: [
          {
            required: true,
            message: "请选择修改方式",
            trigger: ["blur", "change"]
          }
        ],
        channelNo: [
          {
            required: true, validator: this.$rules.checkChannelTenCode, title: "渠道编号", trigger: ["change", "blur"]
          }
        ],
        insId: [
          {
            required: true,
            message: "请选择渠道区域",
            trigger: ["blur", "change"]
          }
        ]
      },
      tableData: [],
      areaData: [],
      channelData: [],
      setProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: true
      },
      gameOtherPath: [],
      actBusinessInsId: null,
      channelId: null,
      isInit: false,
    };
  },
  created() {
    // 控制表单禁用
    if (this.$route.query.type) {
      this.disabled = this.$route.query.type == 1 ? true : false;
    }

    this.getInsData();
    let data = this.$storage.get("userInfo").insId;
    this.getChannelInfoModifyList({});
    // this.getAllGameList();
    // 初始化请求用户id
    this.actBusinessInsId = this.$storage.get("userInfo").insId;
    this.validProcess();

    if (this.$route.query.id) {
      // 获取表单数据详情
      let data = this.$route.query.id;
      this.isInit = true;
      this.getTaskData(data);
    } else {
      this.isInit = false;
      this.isShow = true;
    }
  },
  watch: {
    "form.type"(val) {
      if (this.form.type == 0 && this.form.channelNo) {
        if(!this.isInit) {
          this.queryGameRight();
        }
      }
      if (this.form.type == 1 && this.form.insId) {
        if(!this.isInit) {
          this.queryGameRight();
        }
      }
    }
  },
  methods: {
    beginDate(){
      let self = this
      return {
        disabledDate(time)  {
          return time.getTime() < Date.now() - 8.64e7 // 过去时间不可选
        },
        selectableRange: `${this.$moment(Date.now()).format('HH:mm:ss')}-23:59:59`
      }
    },
    // 修改方式-渠道编号（公共）
    getChannelByQry(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelByQry({ data });
        if (res && res.code == 0) {
          self.isInit = false;
          // self.form.channelNo = res.data.channelNo;
          // self.actBusinessInsId = res.insId;
          self.channelId = res.data.channelId;
          self.queryGameRight();
        }
      })(data);
    },
    selectChannelNo() {
      this.actBusinessInsId =  this.$storage.get("userInfo").insId;
      if(this.form.channelNo&&this.form.channelNo.length==10&&/^[0-9]*$/.test(this.form.channelNo)) {
        let data = {
          insId: this.actBusinessInsId,
          channelNo: this.form.channelNo,
        }
        this.getChannelByQry(data)
      }else{
        this.$message.warning('渠道编号不正确')
      }
    },
    // 回填初始化
    init(data) {
      console.log("回填数据", data);
      const self = this;
      self.form.type = data.type;
      self.form.title = data.title;
      if (self.form.type == 1) {
        // 渠道区域
        self.form.insId = data.insId;
      } else {
        // 渠道编号
        self.form.channelNo = data.channelNo;
      }
      self.form.attachId = data.filePath;

      data.gameRights.forEach(item => {
        if (item.sellBeginTime && item.sellEndTime) {
          let now = this.$moment(new Date()).format("YYYY-MM-DD");
          // this.$set(item, 'time', [`${now} ${item.sellBeginTime}`, `${now} ${item.sellEndTime}`])
          item.time = [
            `${now} ${item.sellBeginTime}`,
            `${now} ${item.sellEndTime}`
          ];
        }
        // item.effectTime = item.effectTime?this.$moment(item.effectTime).format('YYYY-MM-DD HH:mm:ss'):''
      });
      self.tableData = data.gameRights;
      self.isShow = true;
      console.log(self.tableData);
    },
    // 表单数据详情
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
          self.diagramImg = `${ajax.baseURL}/act/business/diagram/${self.$route.name}/${self.actBusinessInsId}`;
        }
      })(data);
    },
    async getAllGameList() {
      let res = await this.$api.getAllGameList();
      if (res && res.code === 0) {
        this.tableData = res.data;
        // for (let item of this.tableData) {
        //   item.cashRight = true;
        //   item.throwRight = true;
        // }
      }
    },
    //获取渠道游戏权限列表
    async queryGameRight() {
      let data = JSON.parse(JSON.stringify(this.form));
      if (Array.isArray(this.form.insId)) {
        data.insId = this.form.insId[this.form.insId.length - 1];
        this.actBusinessInsId = this.form.insId[this.form.insId.length - 1];
      }
      
      this.validProcess();
      if (data.type == 0) {
        delete data.insId;
      } else {
        delete data.channelNo;
      }
      let res = await this.$api.queryGameRight({ data });
      if (res && res.code === 0) {
        res.data.forEach(item => {
          if (item.sellBeginTime && item.sellEndTime) {
            let now = this.$moment(new Date()).format("YYYY-MM-DD");
            item.time = [
              `${now} ${item.sellBeginTime}`,
              `${now} ${item.sellEndTime}`
            ];
          }
        });
        this.tableData = res.data;
      }
    },
    //获取渠道列表-下拉框
    getChannelInfoModifyList(data) {
      const self = this;
      (async data => {
        let res = await self.$api.getChannelInfoModifyList({ data });
        if (res && res.code == 0) {
          this.channelData = res.data;
          console.log("渠道数据", this.channelData);
        }
      })(data);
    },
    //获取区域树
    getInsData() {
      const self = this;
      const data = {};
      (async data => {
        let res = await self.$api.QueryUserAndInsTree({ data });
        if (res && res.code == 0) {
          if (res.data && res.data[0] && res.data[0].parentId == 0) {
            this.areaData = res.data[0].children;
          } else {
            this.areaData = res.data;
          }
        }
      })(data);
    },
    save() {
      const self = this;
      self.form.filePath = self.form.attachId;
      delete self.form.attachId;
      let data = JSON.parse(JSON.stringify(self.form));
      if (!self.form.title) {
        this.$message.warning("申请标题不能为空");
        return;
      }
      if (Array.isArray(data.insId)) {
        data.insId = data.insId[data.insId.length - 1];
      }
      data.type = Number(data.type);
      data.gameRights = JSON.parse(JSON.stringify(self.tableData));
      data.gameRights.forEach(item => {
        if (data.type == 1) {
          // 按区域查询 没有gameId 需要转
          item.gameId = item.id;
        }
        if (item.time) {
          item.sellBeginTime = item.time[0];
          item.sellEndTime = item.time[1];
          item.sellBeginTime = moment(item.sellBeginTime).format("HH:mm:ss");
          item.sellEndTime = moment(item.sellEndTime).format("HH:mm:ss");
          item.effectTime = moment(item.effectTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          delete item.time;
        }
      });

      let params = {
        router: self.$route.name,
        title: self.form.title,
        id: self.$route.query.id, // 从我的申请-编辑 需要带上id
        data: JSON.stringify(data),
        actBusinessInsId: this.actBusinessInsId,
        channelId: this.channelId
      };

      if (!self.$route.query.id) {
        // 新建 不需要带上
        delete data.id;
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
    submit() {
      const self = this;
      self.form.filePath = self.form.attachId;
      delete self.form.attachId;
      let data = JSON.parse(JSON.stringify(self.form));
       if (Array.isArray(data.insId)) {
        data.insId = data.insId[data.insId.length - 1];
      }
      let checkEffect = false;
      self.tableData.forEach(item => {
        if (item.throwRight == 1 && !item.effectTime) {
          checkEffect = true;
        }
        if (item.throwRight == 1 && !item.time) {
          checkEffect = true;
        }
      });
      if (checkEffect) {
        this.$message.warning("生效时间且销售时间不能为空");
        return;
      }
      self.$refs.form.validate(valide => {
        if (valide) {
          data.type = Number(data.type);
          let isSellTime = false;
          data.gameRights = JSON.parse(JSON.stringify(self.tableData));
          data.gameRights.forEach(item => {
            if (data.type == 1) {
              // 按区域查询 没有gameId 需要转
              item.gameId = item.id;
            }
            if (item.time) {
              item.sellBeginTime = item.time[0];
              item.sellEndTime = item.time[1];
              item.sellBeginTime = moment(item.sellBeginTime).format(
                "HH:mm:ss"
              );
              item.sellEndTime = moment(item.sellEndTime).format("HH:mm:ss");
              delete item.time;
              // 判断销售起止时间是否合理
              let beginTime;
              let beginArray = item.sellBeginTime.split(':');
              beginTime = beginArray[0]*3600 + beginArray[1]*60 + beginArray[2]*1
              let endTime;
              let endArray = item.sellEndTime.split(':');
              endTime = endArray[0]*3600 + endArray[1]*60 + endArray[2]*1
              if(beginTime-endTime>0) {
                isSellTime = true;
              }
            }
            item.effectTime =
              item.effectTime && new Date(item.effectTime).getTime();
          });
          if (isSellTime) {
            this.$message.warning("销售时间范围设置不合理，开始时间不能大于结束时间");
            return;
          }
          if (self.isValid) {
            // 走流程de参数
            let str = JSON.stringify(data);
            data.actBusiness = {
              router: self.$route.name,
              title: self.form.title,
              id: self.$route.query.id, // 从我的申请-编辑 需要带上id
              data: str,
              actBusinessInsId: this.actBusinessInsId,
              channelId: this.channelId
            };
            if (!self.$route.query.id) {
              // 直接创建 不需要带上id
              delete data.actBusiness.id;
            }
          } else {
            // 不走流程 不用标题
          }

          self.updateGameRight(data);
        }
      });
    },
    // 更新销售权限
    updateGameRight(data) {
      const self = this;
      (async data => {
        let res = await self.$api.updateGameRight({ data, timeout:60000});
        if (res && res.code == 0) {
          self.$message.success("提交成功");
          self.$router.back();
        }
      })(data);
    },
    cancel() {
      this.$router.go(-1);
    },
    handleClick() {}
  }
};
</script>

<style lang="less" scoped>
@import "../less/index.less";
.submit-wrap {
  text-align: right;
  padding: 10px 0;
}
.vlt-card {
  margin-bottom: 10px;
}
.table {
  width: 100%;
}
.soft-form {
  margin-top: 15px;
}
.time {
  width: 80%;
  min-width: 250px;
}
.datetime {
  width: 80%;
  min-width: 220px;
}
</style>
