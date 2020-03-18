<!-- 配件故障-->
<template>
  <div class="vlt-card">
    <search-bar
      ref="searchForm"
      class="search-bar-demo"
      @search="search"
      :options="searchOptions"
      :total="totals"
      labelWidth="6em"
      @change="changeSearch"
    ></search-bar>
    <analysisCard :routeName="routeName" :list="serviceList"  :tableDatas="datas"  @size="size" @page="page"></analysisCard>
  </div>
</template>

<script type="text/javascript">
import analysisCard from "@/views/businessManage/channelTerminalManagement/components/analysisCard";
export default {
  name: "accessoryFault",
  data() {
    return {
      routeName: 'accessoryFault',
      // 搜索组件配置
      searchOptions: [
        {
          type: "select",
          prop: "goodsId",
          value: "",
          title: "配件名称",
          placeholder: "请选择",
          options: []
        },
        {
          type: "select",
          prop: "modelId",
          value: "",
          title: "配件型号",
          placeholder: "请选择",
          options: []
        },
        {
          type: "select",
          prop: "rankingType",
          value: "",
          title: "排行",
          placeholder: "配件故障率排行",
          options: [
            {
              label: "配件故障率排行",
              value: 1
            },
            {
              label: "配件维修次数排行",
              value: 2
            }
          ]
        }
      ],
      serviceList: {
        type: "1",
        records: [],
        dataList: [{
          ranking: 0,
          avatar: '',
          goodsName: '',
          failure: {
            failureRate: '',
            name: ''
          },
          descList: []
        }]
      },
      datas: {
        tableData: [],
        tableKey: [
          // {
          //   label: "序号",
          //   value: "id",
          //   width: '',
          //   type: 'index'
          // },
          {
            label: "配件名称",
            value: "goodsName",
            width: ''
          },
          {
            label: "配件型号",
            value: "deviceModel",
            width: ''
          },
          {
            label: "维修次数",
            value: "serviceCount",
            width: ''
          },
          {
            label: "故障率（%）",
            value: "faultRate",
            width: ''
          }
        ]
      },
      requestData: {
        page: 1,
        pageSize: 20,
        param: {
          rankingType: 2
        }
      },
      totals: 0,
      modelTreesList: [],
      newGoodsId: '',
      insId: ''
    };
  },
  components: {
    analysisCard
  }, 
  created () {
    this.insId = this.$storage.get('userInfo').insId;
    if (this.insId) {
      this.requestData.param.insId = this.insId;
      this.getList (this.requestData);
    }
    // 获取设备下拉 和设备型号下拉
    this.getModelTrees (2);
 },
 methods: {
    // 配件故障排行
    getList (data) {
      const _this = this;
      (async (data) => {
        let res = await _this.$api.getQueryFittingFaultRankingList({data});
        if (res&&res.code == 0) {
          if (res.data != null) {
            _this.totals = res.data.total
            Object.assign(_this.datas, res.data);
            Object.assign(_this.serviceList, res.data);
            // console.log(res);
            _this.serviceList.records&&_this.serviceList.records.forEach(item=> {
              if (item.files != '' && item.files != null) {
                item.avatar = item.files.split(',')[0];
              } else {
                item.avatar= '';
              }
              item.failure = {faultRate: item.faultRate,name: '故障率'}
              item.descList = [
                {
                  number: item.reserve,
                  name: '配件数量'
                },
                {
                  number: item.serviceCount,
                  name:'维修次数'
                }
              ]
            })
             _this.datas.records&&_this.datas.records.forEach(item => {
              item.faultRate = `${(Number(item.faultRate) * 100).toFixed(2)} %`;
            });
          }
        }
      })(data)
    },
    // 2 获取配件列表
    getModelTrees (goodsType) {
      const _this= this;
      (async (id) => {
        const data = {
          goodsType: id
        }
        let res = await _this.$api.getModelTrees({data});
        if (res&&res.code == 0) {
          if (res.data != null && res.data.length) {
            _this.modelTreesList = res.data;
            let options = [];
            _this.modelTreesList.forEach(item => {
              options.push({
                label: item.goodsName,
                value: item.id
              })
            })
            _this.$set(_this.searchOptions[0], 'options', options)
          }
        }
        // console.log(res);
      })(goodsType)
    },
    changeSearch (form, oldForm) {
      console.log(form,oldForm);
      if (form.goodsId != this.newGoodsId) {
        console.log(form.goodsId, this.modelTreesList);
        let changeSelect = [];
        this.modelTreesList.forEach( item => {
          if (item.id == form.goodsId) {
            changeSelect = item.modelInfoVoList;
          }
        })
        if (changeSelect.length) {
          let options = [];
          changeSelect.forEach(item => {
            options.push({
              label: item.deviceModel,
              value: item.modelId
            })
          })
          this.$set(this.searchOptions[1], 'options', options)
        } else {
          this.$set(this.searchOptions[1], 'options', [])
        }
        this.$set(this.$refs.searchForm.form, this.searchOptions[1].prop, '');
        this.newGoodsId = form.goodsId;
      }
    },
    search(form) {
      console.log(form);
      form.rankingType = Number(form.rankingType);
      this.requestData.param = {
        insId: this.insId,
        ...form
      }
      this.requestData.page = 1;
      console.log(this.requestData);
      this.getList (this.requestData);
    },
    size(val) {
      // console.log('----', val);
      this.requestData.pageSize = val;
      this.requestData.page = 1;
      this.getList (this.requestData);
    },
    page(val) {
      // console.log('----', val);
      this.requestData.page = val;
      this.getList (this.requestData);
    },
  }
};
</script>

<style lang="less" scoped>
</style>
