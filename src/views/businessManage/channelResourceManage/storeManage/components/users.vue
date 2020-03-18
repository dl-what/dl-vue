<template>
  <div>
    <div class="user">
      <div class="ins-wrap">
        <el-tree
          node-key="id"
          :data="insData"
          :props="setTreeProps"
          check-strictly
          :check-on-click-node="true"
          @node-click="getnowNodeifo"
          :default-expanded-keys="num"
          :default-checked-keys="num.slice(1)"
          :default-expand-all="false"
          ref="ins"
          accordion
          :highlight-current="true"
          :expand-on-click-node="false">
        </el-tree>
      </div>
      <div class="department-wrap">
        <el-tree
          node-key="id"
          :data="departmentData"
          :props="setDeparTreeProps"
          check-strictly
          :check-on-click-node="true"
          @node-click="getDepartmentInfo"
          :default-expanded-keys="num"
          :default-checked-keys="num.slice(1)"
          :default-expand-all="false"
          ref="department"
          :highlight-current="true"
          :expand-on-click-node="false">
        </el-tree>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">取 消</el-button>
      <el-button type="primary" size="medium" @click="getCheck">确 定</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import {mapGetters} from 'vuex'

export default {
  name: "",
  props: {
    insId: ''
  },
  data() {
    return {
      setTreeProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: true
      },
      setDeparTreeProps: {
        label: "text",
        value: "id",
        children: "children",
        checkStrictly: false,
      },
      num: [1],
      departmentData: [],
      userData: [],
      checkInsId: null,
      filterData: [],
      insData: [],
      // adminName: null
    }
  },
  computed: {
    // ...mapGetters(['insData'])
  },
  created() {
    let data = this.insId;
    this.getInsData(data)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    getCheck() {
      const self = this;
      if(this.userData.length > 0) {
        let checkedList = this.$refs.department.getCheckedKeys()
        // let insArray = this.$formMethods.getInsArray(this.checkInsId, "id", this.insData, "type");
        // this.userData[0].warType = insArray[0] + 1;
        console.log(this.userData)
        // this.userData[0].checkInsId = this.checkInsId;
        // this.userData[0].text = this.adminName
        self.$emit('change', this.userData)
        self.close();
      }else{
        this.$message.warning('请选择用户')
      }
    },
    getDepartmentInfo(val, s) {
      console.log(val, s)
      if(!val.userId) {
        this.$message.warning('请选择用户')
      } else {
        this.userData = [val];
      }
    },
    //获取当前点击节点信息 s为当前节点node
    async getnowNodeifo(val, s) {
      console.log(val, s);
      this.checked = s.checked;
      this.val = val;
      this.slelectifo = val.text;
      this.num = [1];
      this.checkInsId = val.id;
      let data = {
        insId: val.id,
        isShowChild: 0, // 0 为同级， 1为包含子级
      }
      this.getAssigneeUserList(data)
    },
    // 通过部门获取用户
    getAssigneeUserList(data) {
      const self = this;
      (async data => {
        let res = await this.$api.getAssigneeUserList({data});
        if(res&&res.code==0){
          console.log(res)
          self.departmentData = res.data;
          self.departmentData&&self.departmentData.forEach((item)=>{
            item.children&&item.children.forEach((ele)=>{
              ele.id = ele.userId;
              ele.text = ele.userName;
            })
          })
        }
      })(data)
    },
     // 获取所属机构列表数据
  getInsData(data){
    const self = this;
    (async data =>{
      let res = await self.$api.getUserTree({ data });
      console.log("机构数据",res)
      if (res && res.code == 0){
        let newData = res.data
        // self.filter(newData, 2)
        // self.insData = this.filterData
        self.insData = newData;
      }
    })(data)
  },
  filter(data, type) {
    const self = this;
    data&&data.forEach((item)=>{
      if(item.type == type) {
        item.children = null;
      }else{
        self.filter(item.children, type)
      }
    })
    this.filterData = data;
    console.log(data)
  },
  },
}
</script>

<style lang="less" scoped>
.user{
  display: flex;
  justify-content: space-between;
  min-height: 330px;
}
.ins-wrap,
.department-wrap{
  flex: 0 0 50%;
}
.dialog-footer{
  padding-top: 20px;
  text-align: right;
}
</style>
