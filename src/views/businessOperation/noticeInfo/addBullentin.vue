<template>
  <div class="vlt-card add-bullentin">
    <panel :show="true" title="新增公告">
      <el-form
        :model="baseForm"
        ref="baseForm"
        label-width="140px"
        :rules="rules"
        class="vlt-edit-single"
        style="margin-top:20px"
      >
        <el-form-item prop="noticeName" label="公告名称">
          <el-input
            maxlength="30"
            show-word-limit
            v-model="baseForm.noticeName"
            placeholder="请输入公告名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="noticeType" label="公告类型">
          <el-select v-model="baseForm.noticeType" placeholder="请选择公告类型" @change="noticeTypeChange">
            <el-option
              v-for="(item, index) in noticeType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="noticeShow" label="公告展示">
          <el-select
            v-model="baseForm.noticeShow"
            @change="noticeShowChange"
            placeholder="请选择公告展示类型"
          >
            <el-option
              v-for="(item, index) in noticeShow"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="templateArr"
          label="公告模板"
          v-if="baseForm.noticeShow===2"
          :key="baseForm.noticeShow"
        >
          <el-select
            v-model="baseForm.templateArr"
            multiple
            @change="templateArrChange"
            placeholder="请选择公告模板"
          >
            <el-option
              v-for="(item, index) in templateId"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="templateId" label="公告模板" v-if="baseForm.noticeShow!==2">
          <el-select v-model="baseForm.templateId" @change="templateChange" placeholder="请选择公告模板">
            <el-option
              v-for="(item, index) in templateId"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="time" label="公告周期">
          <el-date-picker
            v-model="baseForm.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="dateFn"
          ></el-date-picker>
        </el-form-item>

        <el-form-item prop="managerialType" label="管理层级">
          <el-select
            v-model="baseForm.managerialType"
            @change="managerialChange"
            placeholder="请选择管理层级"
          >
            <el-option
              v-for="(item, index) in managerialType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          prop="noticeIns"
          label="所属机构"
          v-if="baseForm.managerialType==2||baseForm.managerialType==3"
        >
          <el-select v-model="baseForm.noticeIns" filterable multiple placeholder="请选择机构">
            <el-option
              v-for="(item, index) in noticeIns"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="noticeChannel" label="公告对象" v-if="baseForm.managerialType==4">
          <el-select v-model="baseForm.noticeChannel" filterable multiple placeholder="请选择渠道大厅">
            <el-option
              v-for="(item, index) in noticeChannel"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div v-show="contentType===1">
        <el-form
          label-position="left"
          :model="timeForm"
          :rules="rules"
          label-width="80px"
          ref="timeForm"
        >
          <el-form-item
            class="time-form"
            v-for="(item,index) in timeForm.timeData"
            :key="index"
            label="播放时间"
            :rules="tiemRule.timeItem"
            :prop="`timeData.${index}.timeItem`"
          >
            <el-time-picker v-model="item.timeItem" placeholder="选择时间"></el-time-picker>
            <el-button
              v-if="index!==0"
              class="delete-text vlt-delete-more"
              @click="deleteTime(index)"
            >删除</el-button>
          </el-form-item>
        </el-form>
        <el-button
          size="medium"
          class="addtime-btn vlt-add-more"
          @click="addTime"
          icon="el-icon-plus"
        >新 增</el-button>
      </div>
      <div v-show="contentType!==1&&baseForm.noticeType!==1">
        <span class="layout-title">公告编排</span>
        <notice-bar
          class="notice-bar"
          :timeRange="['10:00', '22:00']"
          :list="bullentinList"
          :duration="runningTime"
          ref="noticeBar"
          v-on:noticeClick="noticeClick"
        ></notice-bar>
        <el-dialog title="公告编排信息" :visible.sync="dialogVisible" width="70%">
          <el-table :data="dialogList" v-if="dialogShow===1">
            <el-table-column type="index" width="60px" label="序号"></el-table-column>
            <el-table-column prop="noticeName" label="公告名称"></el-table-column>
            <el-table-column prop="templateName" label="公告模板"></el-table-column>
            <el-table-column prop="managerialType" label="管理层级"></el-table-column>
            <el-table-column prop="noticeInsName" label="所属机构"></el-table-column>
            <el-table-column prop="period" label="公告周期" width="200px">
              <template slot-scope="scope">
                <span>{{scope.row.periodStartTime}}~{{scope.row.periodEndTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="publishStatus" label="发布状态"></el-table-column>
            <el-table-column prop="noticeChannel" label="公告对象"></el-table-column>
            <el-table-column label="操作" align="center" width="200px">
              <template slot-scope="scope">
                <el-button
                  :id="$route.name + '-' + 'detail' + scope.$index"
                  type="primary"
                  size="mini"
                  @click="detail(scope.row.id)"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <bullentin-detail :id="detailId" v-if="dialogShow===2"></bullentin-detail>
        </el-dialog>
      </div>
      <div class="control-btn">
        <el-button
          :id="$route.name + '-' + 'submit' "
          size="small"
          type="primary"
          @click="submit"
        >提交</el-button>
        <el-button :id="$route.name + '-' + 'cancel' " size="small" @click="cancel">取消</el-button>
      </div>
    </panel>
  </div>
</template>

<script type="text/javascript">
import noticeBar from "./components/noticeBar";
import bullentinDetail from "./bulletinDetail";

export default {
  name: "addBullentin",
  data() {
    return {
      contentType: null,
      rules: {
        noticeName: [
          {
            required: true,
            validator: this.$rules.checkName,
            title: "公告名称",
            trigger: ["change", "blur"]
          }
        ],
        noticeType: [
          {
            required: true,
            message: "请选择内容类型",
            trigger: ["change", "blur"]
          }
        ],
        noticeShow: [
          {
            required: true,
            message: "请选择公告类型",
            trigger: ["change", "blur"]
          }
        ],
        templateId: [
          {
            required: true,
            message: "请选择公告模板",
            trigger: ["change", "blur"]
          }
        ],
        templateArr: [
          {
            required: true,
            message: "请选择公告模板",
            trigger: ["change", "blur"]
          }
        ],
        time: [
          {
            required: true,
            message: "请选择公告周期",
            trigger: ["change", "blur"]
          }
        ],
        managerialType: [
          {
            required: true,
            message: "请选择管理层级",
            trigger: ["change", "blur"]
          }
        ],
        noticeIns: [
          { required: true, message: "请选择机构", trigger: ["change", "blur"] }
        ],
        noticeChannel: [
          {
            required: true,
            message: "请选择公告对象",
            trigger: ["change", "blur"]
          }
        ]
      },
      dateFn: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      baseForm: {
        noticeName: null,
        noticeType: null,
        templateId: null,
        templateArr: [],
        time: null,
        noticeShow: null,
        managerialType: null,
        noticeIns: null,
        noticeChannel: null
      },
      noticeType: [{ label: "缺省", value: 1 }, { label: "插播", value: 2 }],
      templateId: [],
      //模板数据--获取节目时长
      templateData: [],
      //公告展示
      noticeShow: [
        { label: "主屏展示", value: 1 },
        { label: "副屏展示", value: 2 },
        { label: "柜员机", value: 3 }
      ],
      //管理层级
      managerialType: [
        { label: "全国", value: 1 },
        { label: "省级", value: 2 },
        { label: "地市", value: 3 },
        { label: "大厅", value: 4 }
      ],
      noticeIns: [],
      noticeChannel: [],
      //播放时间
      timeForm: { timeData: [{ timeItem: "" }] },
      tiemRule: {
        timeItem: [
          { required: true, message: "请选择播放时间", trigger: "change" }
        ]
      },
      //公告编排信息
      dialogVisible: false,
      dialogShow: null,
      dialogList: [],
      detailId: null,
      runningTime: null,
      bullentinList: []
    };
  },
  watch: {
    baseForm: {
      handler(newValue, oldValue) {
        if (
          newValue.noticeType === 2 ||
          newValue.noticeShow ||
          newValue.time ||
          newValue.managerialType === 1
        ) {
          this.queryNoticeArrange();
        }
        if (newValue.noticeIns && newValue.noticeIns.length) {
          this.queryNoticeArrange();
        }
        if (newValue.noticeChannel && newValue.noticeChannel.length) {
          this.queryNoticeArrange();
        }
      },
      deep: true
    }
  },
  created() {
    console.log(this.$storage.get("userInfo").insId);
    if (this.$storage.get("userInfo").type == 0) {
      this.managerialType = [
        { label: "全国", value: 1 },
        { label: "省级", value: 2 },
        { label: "地市", value: 3 },
        { label: "大厅", value: 4 }
      ];
    }
    if (this.$storage.get("userInfo").type == 1) {
      this.managerialType = [
        { label: "省级", value: 2 },
        { label: "地市", value: 3 },
        { label: "大厅", value: 4 }
      ];
    }
    if (this.$storage.get("userInfo").type == 2) {
      this.managerialType = [
        { label: "地市", value: 3 },
        { label: "大厅", value: 4 }
      ];
    }
  },

  methods: {
    //根据展示类型查询公告模板
    async noticeShowChange(noticeShow) {
      this.baseForm.templateId = "";
      this.baseForm.templateArr = [];
      if (noticeShow === 2) {
        this.contentType = null;
      }

      let res = await this.$api.queryTemplate({
        data: {
          channelType: 2,
          noticeShow: noticeShow
        }
      });
      // console.log(res.data);
      if (res && res.code === 0) {
        this.templateData = res.data;
        this.templateId = res.data.map(item => {
          return {
            label: item.templateName,
            value: item.templateId
          };
        });
      }
    },
    //插播，缺省
    noticeTypeChange(val) {
      if (val === 1) {
        this.noticeShow = [{ label: "副屏展示", value: 2 }];
        this.baseForm.noticeShow = "";
      } else {
        this.noticeShow = [
          { label: "主屏展示", value: 1 },
          { label: "副屏展示", value: 2 },
          { label: "柜员机", value: 3 }
        ];
        this.baseForm.noticeShow = "";
      }
    },
    //获取所选模板播放时长
    templateArrChange(val) {
      let long = 0;
      for (let i = 0; i < this.baseForm.templateArr.length; i++) {
        this.templateData.forEach(item => {
          if (item.templateId === val[i]) {
            long += item.runningTime;
          }
        });
      }
      this.runningTime = long;
    },
    templateChange(val) {
      this.templateData.forEach(item => {
        if (item.templateId === val) {
          if (item.contentForm !== 1) {
            this.contentType = null;
            this.runningTime = item.runningTime;
          } else {
            this.runningTime = null;
            this.contentType = 1;
          }
        }
      });
    },
    //文字模板播放时间点设置
    addTime() {
      let obj = { timeItem: "" };
      this.timeForm.timeData.push(obj);
    },
    deleteTime(index) {
      this.timeForm.timeData.splice(index, 1);
    },

    //层级切换获取机构或大厅数据
    managerialChange(val) {
      this.baseForm.noticeIns = null;
      this.baseForm.noticeChannel = null;
      if (val !== 1) {
        (async data => {
          let res = await this.$api.queryNoticeMmanagerial({ data: val });
          if (res && res.code === 0) {
            if (val == 2 || val == 3) {
              this.noticeIns = res.data.map(item => {
                return { label: item.name, value: item.id };
              });
            }
            if (val == 4) {
              this.noticeChannel = res.data.map(item => {
                return { label: item.code, value: item.code };
              });
            }
          }
        })(val);
      }
    },

    //获取编排数据
    async queryNoticeArrange(param) {
      if (
        this.baseForm.time &&
        this.baseForm.noticeShow &&
        this.baseForm.managerialType &&
        this.contentType !== 1 &&
        this.baseForm.noticeType === 2
      ) {
        let data = {
          noticeType: 2,
          managerialType: this.baseForm.managerialType,
          noticeShow: this.baseForm.noticeShow,
          startTime: this.$moment(this.baseForm.time[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          endTime: this.$moment(this.baseForm.time[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        };
        if (param) {
          data.noticeStartTime = param.start;
          data.noticeEndTime = param.end;
        }

        switch (this.baseForm.managerialType) {
          case 2:
            if (this.baseForm.noticeIns && this.baseForm.noticeIns.length) {
              data.insList = this.baseForm.noticeIns;
            } else {
              return;
            }
            break;
          case 3:
            if (this.baseForm.noticeIns && this.baseForm.noticeIns.length) {
              data.insList = this.baseForm.noticeIns;
            } else {
              return;
            }
            break;
          case 4:
            if (
              this.baseForm.noticeChannel &&
              this.baseForm.noticeChannel.length
            ) {
              data.channelList = this.baseForm.noticeChannel;
            } else {
              return;
            }
            break;
        }
        let res = await this.$api.queryNoticeArrange({ data });
        if (res && res.code === 0) {
          if (param) {
            res.data.forEach(item => {
              item.managerialType = this.changeType(item.managerialType);
              item.publishStatus = this.changeState(item.publishStatus);
              item.periodStartTime = this.$moment(item.periodStartTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              item.periodEndTime = this.$moment(item.periodEndTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              item.templateName = item.templateList
                .map(val => {
                  return val.templateName;
                })
                .join(" , ");
              if (item.noticeInsName) {
                item.noticeInsName = item.noticeInsName;
              }
              if (item.noticeChannel) {
                item.noticeChannel = item.noticeChannel.slice(
                  1,
                  item.noticeChannel.length - 1
                );
              }
            });
            if (res.data !== null) {
              res.data.forEach(item => {
                item.periodStartTime = this.$moment(
                  item.periodStartTime
                ).format("YYYY-MM-DD");
                item.periodEndTime = this.$moment(item.periodEndTime).format(
                  "YYYY-MM-DD"
                );
              });
              this.dialogList = res.data;
            } else {
              this.dialogList = [];
            }
            console.log("时间段内数据", res.data);
          } else {
            if (res.data !== null) {
              this.bullentinList = res.data;
            } else {
              this.bullentinList = [];
            }
            console.log("周期内所有编排", this.bullentinList);
          }
        }
      }
    },

    submit() {
      this.$refs.baseForm.validate(valid => {
        if (valid) {
          let data = {
            ...this.baseForm,
            contentForm: this.contentType,
            periodStartTime: new Date(this.baseForm.time[0]).getTime(),
            periodEndTime: new Date(this.baseForm.time[1]).getTime()
          };
          delete data.noticeIns;
          delete data.noticeChannel;
          if (this.baseForm.noticeIns && this.baseForm.noticeIns.length) {
            data.noticeIns = this.baseForm.noticeIns.join(",");
            delete data.noticeChannel;
          }
          if (
            this.baseForm.noticeChannel &&
            this.baseForm.noticeChannel.length
          ) {
            data.noticeChannel = this.baseForm.noticeChannel.join(",");
            delete data.noticeIns;
          }
          if (this.baseForm.managerialType === 1) {
            data.noticeIns = "1";
          }
          data.templateList = [{ templateId: this.baseForm.templateId }];
          if (this.baseForm.noticeShow === 2) {
            data.templateList = this.baseForm.templateArr.map(item => {
              return { templateId: item };
            });
          }
          delete data.templateId;
          delete data.templateArr;
          delete data.time;
          if (this.contentType !== 1 && this.baseForm.noticeType === 2) {
            let arr = this.$refs.noticeBar.insertNoticeList;
            if (arr.length) {
              arr = arr.map(item => {
                if (
                  item.noticeStartTime.length === 5 &&
                  item.noticeEndTime.length === 5
                ) {
                  delete item.duration;
                  delete item.style;
                  return item;
                }
              });

              data = {
                ...data,
                noticeProgramList: arr
              };
            } else {
              this.$message.error("请选择插入时间");
              return;
            }
          } else {
            this.$refs.timeForm.validate(valid => {
              if (valid) {
                let noticeProgramList = this.timeForm.timeData.map(item => {
                  return {
                    noticeStartTime: this.$moment(item.timeItem).format(
                      "HH:mm:ss"
                    )
                  };
                });

                data = {
                  ...data,
                  noticeProgramList
                };
              } else {
                return false;
              }
            });
          }

          console.log(data);
          (async data => {
            let res = await this.$api.addNoticePublish({
              message: "提交成功",
              data
            });
            if (res && res.code === 0) {
              setTimeout(() => {
                this.$router.push({ path: "bulletinList" });
              }, 500);
            } else {
              this.$refs.noticeBar.insertNoticeList = [];
            }
          })(data);
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$router.back();
    },
    //获取指定时段内编排数据
    noticeClick(val) {
      let param = {
        start: val.noticeStartTime,
        end: val.noticeEndTime
      };
      console.log(param);
      this.queryNoticeArrange(param);
      this.dialogVisible = true;
      this.dialogShow = 1;
    },
    detail(id) {
      this.detailId = id;
      this.dialogShow = 2;
    },
    changeType(val) {
      let options = {
        1: "全国",
        2: "省级",
        3: "地市",
        4: "大厅"
      };
      return options[val];
    },
    changeState(val) {
      let options = {
        1: "待公告",
        2: "已公告",
        3: "已停用",
        4: "已过期"
      };

      return options[val];
    }
  },
  components: { noticeBar, bullentinDetail }
};
</script>

<style lang="less" scoped>
@import "./less/index";
</style>
