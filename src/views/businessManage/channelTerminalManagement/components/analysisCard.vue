<template>
  <div class="info-show">
    <el-row> 
      <el-tabs v-model="showList" @tab-click="changeBtn"  >
        <el-tab-pane label="查看图形" name="first" :id="routeName + '-graphics'">
          <!-- 列表形式 -->
          <el-row  class="card-list" >
            <div v-if="list.records!=undefined&&list.records.length>0">
              <el-row  :gutter="30">
                <el-col  v-for="item in list.records" :key="item.id" :span="8">
                  <div class="col-box">
                    <span class="number">{{item.ranking}}</span>
                    <div class="info-list">
                      <img :src="item.avatar" alt class="avatar" />
                      <div class="info">
                        <p class="name">{{item.goodsName}}</p>
                        <p class="tel" v-if="item.tel">
                          <i class="icon el-icon-phone"></i>
                          {{item.tel}}
                        </p>
                        <p class="add" v-if="item.address">
                          <i class="icon el-icon-location-outline"></i>
                          {{item.address}}
                        </p>
                        <p class="model" v-if="item.deviceModel">
                          {{routeName == 'equipmentFailure' ? '设备型号：' : '配件型号：'}}{{item.deviceModel}}
                        </p>
                        <p class="device" v-if="item.faultDeviceRankingVO">{{routeName == 'equipmentFailure' ? '关联配件：' : '关联设备：'}} {{item.faultDeviceRankingVO.faultDeviceName}}</p>
                        <p class="device" v-if="item.faultDeviceRankingVO">{{routeName == 'equipmentFailure' ? '' : '设备型号：'}} {{item.faultDeviceRankingVO.faultDeviceModel}}</p>
                      </div>
                    </div>
                    <div class="col-desc">
                      <div v-if="item.failure" class="failure">
                        <p class="desc-number">{{item.failure.faultRate | filterNumber}} <i>%</i></p>
                        <p class="desc-item">{{item.failure.name}}</p>
                      </div>
                      <el-row class="desc-list">
                        <el-col v-for="item in item.descList" :key="item.id" >
                          <p class="desc-number">{{item.number}}</p>
                          <p class="desc-item">{{item.name}}</p>
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <div style="display:block">
                <table-paging
                  position="right"
                  :total="list.total"
                  :currentPage="requestData.page"
                  :pageSize="requestData.pageSize"
                  @handleSizeChange="handleSizeChange"
                  @handleCurrentChange="handleCurrentChange"
                ></table-paging>
              </div>
            </div>
            <p v-else class="no-mess">暂无数据</p>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="查看列表" name="second" :id="routeName + '-list'">
          <!-- 表格形式 -->
          <el-row  class="card-table">
            <el-table :data="tableDatas.records" border style="width: 100%" class="table-box">
              <el-table-column label="序号" width="80" fixed>
                <template slot-scope="scope">
                {{tableDatas.size*(tableDatas.current-1)+(scope.$index+1)}}
                </template>
              </el-table-column>
              <el-table-column
                v-for="(item,key) in tableDatas.tableKey"
                :key="key"
                :prop="item.value"
                :label="item.label"
                :width="item.width"
                :type="item.type"
              ></el-table-column>
            </el-table>
            <table-paging
              position="right"
              :total="tableDatas.total"
              :currentPage="requestData.page"
              :pageSize="requestData.pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"
            ></table-paging>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "analysisCard",
  props: {
    list: {
      type: Object,
      default: {
        records:[]
      }
    },
    tableDatas: {
      type: Object,
      default: {}
    },
    page: {
      type: Number
    },
    routeName: {
      type: String
    }
  },
  data() {
    return {
      showList: 'first',
      btnName: "查看列表",
      requestData: {
        page: 1,
        pageSize: 20
      }
    };
  },
  watch: {
    tableDatas: {
      handler (newVal, oldVal) {
        // console.log('kkk',newVal);
      },
      deep: true,
      immediate: true
    },
    page: {
      handler (newVal, oldVal) {
        // console.log('page',newVal);
        this.handleCurrentChange(newVal);
      },
      deep: true,
    }
  },
  filters: {
    filterNumber(val) {
      let vals = (Number(val) * 100).toFixed(2);
      return vals
    },
  },
  components: {},
  methods: {
    changeBtn() {
      // this.showList = !this.showList;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.requestData.pageSize = val;
      this.requestData.page = 1;
      this.$emit('size', val);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.requestData.page = val;
      this.$emit('page', val);
    }
  }
};
</script>

<style lang="less" scoped>
.info-show {
  .card-table {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
.card-list {
  margin: 20px 0;
  &:last-child {
    margin-bottom: 0;
  }
  .no-mess {
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #909399;
  }
  .el-col.el-col-8 {
    padding-bottom: 30px;
    .col-box {
      position: relative;
      padding: 15px;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      transition: .2s ease;
      &:hover {
        box-shadow: 0 0 10px #dddee1;
      }
      span.number {
        position: absolute;
        top: 15px;
        right: 15px;
        display: block;
        border-radius: 4px;
        background: #409eff;
        color: #fff;
        width: 40px;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      .info-list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        .avatar {
          display: block;
          width: 80px;
          height: 80px;
          margin-right: 20px;
          border: 1px solid #e6e6e6;
          box-shadow: 0 0 10px #dddee1;
        }
        .info {
          flex: 1;
          .name {
            color: #108ee9;
            font-size: 16px;
            line-height: 2;
          }
          .tel,
          .add {
            line-height: 1.5;
            .icon {
              padding-right: 5px;
            }
          }
          &> p {
            line-height: 1.5;
          }
        }
      }
      .col-desc {
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #e6e6e6;
        width: 100%;

        .desc-number {
          font-size: 28px;
          font-weight: 700;
          color: #999999;
        }
        .desc-item {
          color: #333333;
        }
        .failure {
          width: 100%;
          text-align: center;
          .desc-number {
            position: relative;
            font-size: 36px;
            color: #333;
            &>i {
              font-size: 28px;
              position: absolute;
              bottom: 0;
              padding-left: 5px;
              font-style: normal;
            }
          }
        }
        .desc-list {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 20px 0;
          .el-col {
            text-align: center;
            border-right: 1px solid #e6e6e6;
            padding-left: 10px;
            padding-right: 10px;
            &:last-child {
              border-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>
