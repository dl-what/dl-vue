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
          :expand-on-click-node="false"
        ></el-tree>
      </div>
      <div class="department-wrap">
        <el-tree
          node-key="id"
          :data="departmentData"
          :props="setDeparTreeProps"
          show-checkbox
          :check-on-click-node="true"
          @node-click="getDepartmentInfo"
          :default-expanded-keys="num"
          :default-checked-keys="num.slice(1)"
          :default-expand-all="false"
          ref="department"
          :highlight-current="true"
          :expand-on-click-node="false"
        ></el-tree>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close" :id="$route.name + '-' + 'cancel'">取 消</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="getCheck"
        :id="$route.name + '-' + 'enter'"
      >确 定</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from "vuex";

export default {
  name: "",
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
        checkStrictly: false
      },
      num: [1],
      departmentData: []
    };
  },
  computed: {
    ...mapGetters(["insData"])
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getCheck() {
      const self = this;
      let userData = [];
      let checkedList = this.$refs.department.getCheckedKeys();
      checkedList.forEach((item, index) => {
        self.departmentData.forEach(ele => {
          if (ele.id == item) {
            // 把部门id 筛选出来
            // checkedList.splice(index, 1)
          } else {
            ele.children &&
              ele.children.forEach(list => {
                // 用户id
                if (list.userId == item) {
                  userData.push(list);
                }
              });
          }
        });
      });
      self.$emit("change", userData);
      self.close();
    },
    getDepartmentInfo(val, s) {
      console.log(val, s);
    },
    //获取当前点击节点信息 s为当前节点node
    async getnowNodeifo(val, s) {
      console.log(val, s);
      this.checked = s.checked;
      this.val = val;
      this.slelectifo = val.text;
      this.num = [1];
      let data = {
        insId: val.id,
        isShowChild: 0 // 0 为同级， 1为包含子级
      };
      this.getAssigneeUserList(data);
    },
    // 通过部门获取用户
    getAssigneeUserList(data) {
      const self = this;
      (async data => {
        let res = await this.$api.getAssigneeUserList({ data });
        if (res && res.code == 0) {
          console.log(res);
          self.departmentData = res.data;
          self.departmentData &&
            self.departmentData.forEach(item => {
              item.children &&
                item.children.forEach(ele => {
                  ele.id = ele.userId;
                  ele.text = ele.userName;
                });
            });
        }
      })(data);
    }
  }
};
</script>

<style lang="less" scoped>
.user {
  display: flex;
  justify-content: space-between;
  min-height: 58vh;
  max-height: 62vh;
}
.ins-wrap,
.department-wrap {
  flex: 0 0 50%;
}
.dialog-footer {
  padding-top: 20px;
  text-align: right;
}
</style>
