<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column label="序号" type="index" fixed width="55"></el-table-column>
      <el-table-column prop="softwareName" label="软件名称" min-width="300px"></el-table-column>
      <el-table-column prop="deployCode" label="配置编码" min-width="100px"></el-table-column>
      <el-table-column prop="versionNumber" label="版本号" min-width="120px"></el-table-column>
      <el-table-column prop="versionStatusName" label="版本状态" min-width="120px"></el-table-column>
      <el-table-column prop="softwareSize" label="软件大小" min-width="120px"></el-table-column>
      <!-- <el-table-column prop="newFeatures" label="新版特性" min-width="160px"></el-table-column>
      <el-table-column prop="softwareDesc" label="软件描述" min-width="160px"></el-table-column> -->
      <el-table-column label="创建时间" min-width="160px">
        <template slot-scope="scope">
          {{$moment(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="160px">
        <template slot-scope="scope">
          {{$moment(scope.row.updateTime).format("YYYY-MM-DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="100px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            v-prevent="2000"
            @click="detail(scope.row)"
            :id="$route.name+'-'+'detail'+scope.$index"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="版本配置详情" :visible.sync="isShow" width="75%" :close-on-click-modal="false">
      <preview :params="params"></preview>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import Preview from './preview'

export default {
  name: "",
  components: {
    Preview
  },
  props: {
    tableData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      isShow: false,
      params: {
        gameId: null,
        deployCode: null,
      },
    }
  },
  created() {

  },
  methods: {
    detail(val) {
      this.isShow = true;
      this.params.gameId = val.gameId
      this.params.deployCode = val.deployCode
    }
  },
}
</script>

<style lang="less" scoped>

</style>
