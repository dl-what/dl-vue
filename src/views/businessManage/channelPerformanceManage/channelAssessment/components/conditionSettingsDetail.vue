<template>
  <div class="vlt-card condition-detail">
    <div v-if="showType == 1">
      <div v-for="(ele, i) in dataList" :key="i" class="condition-list">
          <!-- {{ele}} -->
            <p class="panel-item-title">条件{{i + 1}}</p>
          <el-row>
            <el-col class="condition-items" :span="14">
              <div  class="condition-item">
                <dl v-for="(item, index) in ele.conditionSetList" :key="index">
                  <dt>条件设置：</dt>
                  <dd>{{item.conditionName}}</dd>
                  <dd>{{conditionTypeArrs[item.conditionType]}}</dd>
                  <dd>{{item.relation}}</dd>
                  <dd v-if="item.conditionTypeName">{{item.conditionTypeName}}</dd>
                  <dd v-if="item.conditionSetValue">{{item.conditionSetValue}}</dd>
                  <dd v-if="item.conditionSetValue2">{{item.conditionSetValue2}}</dd>
                </dl>
                <dl>
                  <dt>条件分值：</dt>
                  <dt>{{ele.conditionScore}}</dt>
                </dl>
              </div>
            </el-col>
            <el-col class="btn-wrap"  :span="8">
              <el-radio-group v-model="ele.conditionSetList[0].chCondRelation" @change="mode()" size="small">
                <el-radio-button :disabled="true" label="0">并且</el-radio-button>
                <el-radio-button :disabled="true" label="1">或者</el-radio-button>
              </el-radio-group>
              <!-- <el-button size="mini"  :type="String(ele.conditionSetList[0].chCondRelation) == '0' ?'primary': ''">并且</el-button>
              <el-button size="mini" :type="String(ele.conditionSetList[0].chCondRelation) == '1' ?'primary': ''">或者</el-button> -->
            </el-col>
          </el-row>
      </div>
    </div>
    <div v-if="showType == 2">
      <div v-for="(ele, i) in conditionDatas" :key="i" class="condition-list">
            <p class="panel-item-title">条件{{i + 1}}</p>
          <el-row>
            <el-col class="condition-items" :span="20">
              <div  class="condition-item">
                <dl>
                  <dt>条件名称：</dt>
                  <dd>{{ele.conditionValue}}</dd>
                </dl>
                <dl>
                  <dt>条件分值：</dt>
                  <dt>{{ele.conditionScore}}</dt>
                </dl>
              </div>
            </el-col>
          </el-row>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "",
  props: {
    conditionDatas: {
      type: Array
    },
    targetType: {
      type: Number
    }
  },
  data() {
    return {
      showType: 0,
      dataList: [],
      conditionTypeArrs: ['字符型', '数值型', '时间型', '真假型' ],
      chCondRelationArr: ['并且', '或者', '无联系'],
    };
  },
  watch: {
    targetType: {
      handler(newVal, oldVal) {
        console.log(newVal);
        this.showType = newVal;
      },
      deep: true
    },
    conditionDatas: {
      handler(newVal, oldVal) {
        console.log('拿过来的值', newVal);
        this.dataList = newVal;
        this.initData(this.dataList);
      },
      deep: true,
      immediate: true
    }
  },
  components: {},
  methods: {
    initData (dataList) {
      dataList&&dataList.forEach((item, index) => {
        item.conditionSetList&&item.conditionSetList.forEach ((ele, i, arr) => {
          // console.log(ele.conditionType);
          if (String(ele.conditionType)) {
            this.conditionConfigQueryType(String(ele.conditionType), ele.relation, index, i );
          }

          if (ele.conditionType == 0) {
              let obj = {
                conditionId: ele.conditionId,
                conditionType: ele.conditionType
              };
            this.conditionTypeConfigListAll(obj, ele.conditionTypeId,  index, i);
          }
        })
      })
    },
    conditionConfigQueryType(id, relation,  parindex, index ) {
      const _this = this;
      (async (id) => {
        const res = await _this.$api.conditionConfigQueryType({ data: id });
        if (res && res.code === 0) {
          res.data&&res.data.forEach (item => {
            if (relation == item.value) {
              // console.log(item.label);
              _this.$set(_this.dataList[parindex].conditionSetList[index], 'relation', item.label);
            }
          }) 
        }
      })(id)
    },
    // 条件因素类型对应配置表条件查询
    conditionTypeConfigListAll(obj, conditionTypeId, parindex, index) {
      // console.log('conditionTypeConfigListAll',obj, conditionTypeId, parindex, index );
      const _this = this;
      (async (data) => {
        // console.log(data, conditionTypeId, parindex, index);
        const res = await _this.$api.conditionTypeConfigListAll({ data });
        if (res && res.code === 0) {
          // console.log('----',res, conditionTypeId);
          res.data&&res.data.forEach(item => {
            if (conditionTypeId == item.value){
              _this.$set(_this.dataList[parindex].conditionSetList[index], 'conditionTypeName', item.label);
            }
          })
        }
      })(obj)
    }
  },
};
</script>

<style lang="less" scoped>
.condition-detail {
  padding-bottom: 40px;
  .condition-list {
    margin-left: 20px;
    margin-top: 20px;
    .panel-item-title {
      font-size: 16px;
    }
    dl {
      &>dd, &>dt {
        display: inline-block;
        margin: 20px 10px 0;
      }
      &>dt {
        color: #606266;
        margin-right: 10px;
      }
      &>dd {
        color: #999999;
      }
    }
    .condition-items, .btn-wrap {
      display: inline-block;
      vertical-align: middle;
    }
    .btn-wrap {
      margin-top: 30px;
      // margin-left: 40px;
      .el-button {
      }
      .el-radio-button__orig-radio:checked+.el-radio-button__inner  {
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;
        -webkit-box-shadow: -1px 0 0 0 #409EFF;
        box-shadow: -1px 0 0 0 #409EFF;
      }
    }
  }
}
</style>
<style lang="less">
  .condition-detail {
    .el-radio-button__orig-radio:checked+.el-radio-button__inner  {
      color: #FFF;
      background-color: #409EFF;
      border-color: #409EFF;
      -webkit-box-shadow: -1px 0 0 0 #409EFF;
      box-shadow: -1px 0 0 0 #409EFF;
    }
  }
      
</style>
