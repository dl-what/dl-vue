<template>
  <div class="" v-loading="loading" ref="DivHandle">
    {{appDetail1}}
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">

        <!--<ButtonGroup>-->
        <ImportFile :btnStyle="'border-radius: 0 ;'"
                    v-if="Auth(300015)"
                    :conf="conf"
                    @uploadResult="uploadResult"
                    :showAreaSelect="true"
                    :recordObj="recordObj"
                    :downloadObj="downloadObj"
                    :type="['xlsx']"
                    :exportTitle="'导入站点列表信息'"
                    :tabPaneLabel="'站点导入'"
                    :uploadApiCode="300015">
          <Button v-if="true" type="primary" icon="el-icon-edit">导入
          </Button>
        </ImportFile>
        <Print
           :btnStyle="'border-radius: 0px '"
           :tableHeader="tableHeader"
           :printTitle="'站点列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0' "
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'station'"
           :fileSaveName="'站点列表'"
           :btnName="'导出'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <QueryForm ref="query_form"
                   :queryApiCode="searchApi"
                   :itemList="itemList"
                   @tableData="getTableData"
                   @totalCount="getTotalCount"
                   @getCheckBoxList="getCheckBoxList">
        </QueryForm>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <!--<Table stripe :data="tableData"  border style="width: 100%" v-if="tableHeight">-->
        <Table stripe :data="tableData" border style="width: 100%" v-if="tableHeight" @sort-change="sortByProp">
          <TableColumn label="序号" width="50" align="center" fixed>
            <!--minWidth="60" maxWidth="90"-->
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="站点编号" prop="stationCode" width="100" sortable="custom">
            <template slot-scope="scope">
              <Button @click="$router.push('/manage/sitesListDetail/' + scope.row.stationID)" type="text">
                {{scope.row.stationCode}}
              </Button>
            </template>
          </TableColumn>
          <TableColumn label="业主姓名" prop="nameX" minWidth="100"></TableColumn>
          <TableColumn label="手机号码" prop="mobile" minWidth="100"></TableColumn>
          <!--<TableColumn label="经营模式" prop="operateModeName" minWidth="130" ></TableColumn>-->
          <TableColumn label="所属区域" prop="regionName" minWidth="200"></TableColumn>
          <TableColumn label="建站日期" prop="setUpTime" min-width="100" sortable="custom">
            <template slot-scope="scope">
              <span>{{scope.row.setUpTime | ToDate}}</span>
            </template>
          </TableColumn>
          <!--<TableColumn label="房产性质" prop="houseType" minWidth="100">-->
          <!--<template slot-scope="scope">-->
          <!--{{ scope.row.houseType | getTxt }}-->
          <!--</template>-->
          <!--</TableColumn>-->
          <TableColumn label="站点维护管理员" prop="repairName" minWidth="100"></TableColumn>
          <TableColumn label="状态" prop="status" minWidth="60">
            <template slot-scope="scope">
              {{ scope.row.stationStatus | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="操作" width="100" fixed="right" align="center">
            <template slot-scope="scope">
              <Button @click="$router.push('/manage/sitesListModify/' + scope.row.stationID)" v-if="Auth(300003)"
                      type="text" typeOptions>
                修改
              </Button>
              <Button @click="$router.push('/manage/sitesListDetail/' + scope.row.stationID)" type="text" typeOptions>
                查看
              </Button>
            </template>
          </TableColumn>
        </Table>

      </div>

    </TablePage>

  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'

export default {
  name: 'SitesList',
  data: function () {
    return {
      trueFalseOptions: [
        {text: '全部', value: ''},
        {text: '是', value: true},
        {text: '否', value: false}
      ],
      recordObj: {apiCode: 200105, sysModule: 'station', tableName: 'station'},
      downloadObj: {hostBizObj: 'station', hostBizId: 'templete_xlsx', sysModule: 'station'},
      searchForm: {
        page: 1,
        isValid: '',
        operateKuai3: '',
        operateLuckyLottery: ''
      },
      loading: false,
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      stationCode: '',
      deleteId: '', // 删除的id
      dialogVisible: false, // 删除弹窗flag
      xieyidate: '', // 协议时间
      jianzhandate: '', // 建站时间
      checkboxList: [],
      operateModeList: [], // 经营模式数组
      exportObj: {
        apiCode: 300016,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '站点列表'
        }
      },
      tableHeader: [
        {
          text: '站点编号',
          value: 'stationCode'
        },
        {
          text: '负责人',
          value: 'nameX'
        },
        {
          text: '移动电话',
          value: 'mobile'
        },
        {
          text: '经营模式',
          value: 'operateModeName'
        },
        {
          text: '所属区域',
          value: 'regionName'
        },
        {
          text: '设立时间',
          value: 'setUpTime'
        },
        {
          text: '房产性质',
          value: 'houseType'
        },
        {
          text: '状态',
          value: 'stationStatus'
        }
      ],
      totalCount: 0,
      tableHeight: 0,
      tableData: [],
      searchApi: {
        apiCode: 300002,
        bizType: 'station',
        sysModule: ''
      },
      confirmSearch: {
        page: 1,
        isValid: '',
        operateKuai3: '',
        operateLuckyLottery: ''
      },
      itemList: [
        {
          label: '站点编号',
          value: 'stationCode',
          type: 'stationCode',
          disable: false
        },
        {
          label: '建站时间',
          value: 'signUpDate',
          type: 'datePicker',
          disable: false,
          format: 'daterange'
        },
        {
          label: '所属区域',
          value: 'regionCode',
          type: 'areacascader',
          stage: 3,
          disable: false,
          // 是否可以选择任何一级(默认false, 只能选择最后一级, 如果是true的话, stage可以不填)
          select_any_level_flag: true,
          // 是否显示完整的路径, 默认true, 将其赋值为false, 则仅显示最后一级
          // show_all_levels: true,
          // 是否把所有级别的选择结果全部返回, 默认false, 只返回最后一级的regionCode
          ruturnAllLevelResultFlag: true
        },
        {
          label: '站点状态',
          value: 'stationStatus',
          type: 'select',
          options: [],
          disable: false
        },
        {
          label: '站点星级',
          value: 'stationStar',
          type: 'Star',
          disable: false
        },
        // {
        //   label: '经营模式',
        //   value: 'operateModeId',
        //   type: 'select',
        //   options: [],
        //   disable: false
        // },
        {
          label: '业主姓名',
          value: 'stationOwner',
          type: 'text',
          disable: false
        },
        {
          label: '手机号码',
          value: 'mobile',
          type: 'text',
          disable: false
        },
        {
          label: '是否为有效站点',
          value: 'isValid',
          type: 'select',
          options: [
            {text: '全部', value: ''},
            {text: '是', value: true},
            {text: '否', value: false}
          ],
          disable: false
        },
        {
          label: '快三游戏',
          value: 'operateKuai3',
          type: 'select',
          options: [
            {text: '全部', value: null},
            {text: '是', value: true},
            {text: '否', value: false}
          ],
          disable: false
        },
        {
          label: '快乐十分',
          value: 'operateKuaiLeShiFen',
          type: 'select',
          options: [
            {text: '全部', value: null},
            {text: '是', value: true},
            {text: '否', value: false}
          ],
          disable: false
        }
      ]
    }
  },
  computed: {
    ...mapState({
      appDetail1: 'appDetail'
    })
  },
  methods: {
    /* 获取列表信息 */
    getTableData(val) {
      this.tableData = val
    },
    /* 获取列表分页信息 */
    getTotalCount(val) {
      this.totalCount = val
    },
    /* 获取列表导出信息 */
    getCheckBoxList(val) {
      this.checkboxList = val
    },
    /* 获取数字字典（站点状态） */
    getStatusList() {
      this.itemList.forEach((v, i) => {
        if (v.value === 'stationStatus') {
          this.$set(this.itemList[i], 'options', this.$store.state.station_enumDic.StationEnum$statusEnum)
        }
      })
    },
    /* 获取数字字典（经营模式） */
    getOperateModeList() {
      this.itemList.forEach((v, i) => {
        if (v.value === 'operateModeId') {
          v.options = this.$store.state.station_enumDic.operateMode
        }
      })
    },
    // 表头排序
    sortByProp(choice) {
      console.log(choice)
      let obj = this.searchForm
      let sort = choice.order
      let sidx = choice.prop
      if (choice.order !== null) {
        // 将prop值的驼峰转为下划线并全部转小写
        obj.sidx = sidx.replace(/([A-Z])/g, '_$1').toLowerCase()
        if (sort === 'ascending') {
          // 升序
          obj.sort = 'asc'
        } else if (sort === 'descending') {
          // 降序
          obj.sort = 'desc'
        }
      } else {
        obj.sidx = ''
        obj.sort = ''
      }
      console.log(this.$refs['query_form'])
      this.$refs['query_form'].search({
        sort: obj.sort,
        sidx: obj.sidx,
        page: 1
      })
    },
    ...mapMutations({
      SET_APPDETAIL: 'SET_APPDETAIL'
    }),
    uploadResult(file) {
      console.log('我是上传结果', file)
    },
    // 协议日期
    xieyiDateEvent(date) {
      console.log(date)
      this.searchForm.contractSignBeginTime = date[0]
      this.searchForm.contractSignEndTime = date[1]
    }
  },
  mounted() {
    this.getStatusList()
    this.getOperateModeList()
    this.tableHeight = this.tableHeightCal('el-main', 160)
    this.operateModeList = this.$store.state.station_enumDic.operateMode
    // this.init()
  }
}
</script>

<style lang="scss">
</style>
