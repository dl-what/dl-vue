<template>
  <div class="vlt-card">
    <panel :show="true" title="用户信息">
      <base-info :infoList="destail"></base-info>
    </panel>
  </div>
</template>


<script>
import moment from "moment";
export default {
  name: "userDetails",
  data() {
    return {
      destail: [
        { title: "姓名", value: "", prop: "userName" },
        { title: "手机号码", value: "", prop: "mobile" },
        { title: "邮箱", value: "", prop: "email" },
        {
          title: "所属机构",
          value: "",
          prop: "insInfoVo"
        },
        {
          title: "用户账号",
          value: "",
          prop: "account"
        },
        {
          title: "部门",
          value: "",
          prop: "deptInfoList"
        },
        {
          title: "所属机构编码",
          value: "",
          prop: "insCode"
        },
        {
          title: "用户状态",
          value: "",
          prop: "userStatus"
        },
        {
          title: "创建人",
          value: "",
          prop: "createByName"
        },
        {
          title: "创建时间",
          value: "",
          prop: "createTime"
        },
        {
          title: "用户角色",
          value: "",
          prop: "roleInfoList"
        },
        {
          title: "最近登录次数",
          value: "",
          prop: "loginCount"
        },
        {
          title: "更新人",
          value: "",
          prop: "updateByName"
        },
        {
          title: "更新时间",
          value: "",
          prop: "updateTime"
        },
        {
          title: "最近登录时间",
          value: "",
          prop: "loginTime"
        },
        {
          title: "最近登录IP",
          value: "",
          prop: "loginIp"
        }
      ]
    };
  },
  async created() {
    const self = this;
    let id = this.$route.query.id;
    let reslt = await this.$api.getUserDestils({ data: id });
    if (reslt && reslt.code === 0) {
      let data = JSON.parse(JSON.stringify(reslt.data));
      if (data.userLoginLogVo) {
        data = {
          ...data.userLoginLogVo,
          ...data
        };
      } else {
        data = {
          ...data
        };
      }
      let arr = Object.keys(data);
      this.destail.forEach(item => {
        if (
          item.prop != "loginTime" &&
          item.prop != "loginIp" &&
          item.prop != "loginCount"
        ) {
          item.value = data[item.prop] || "";
        }

        if (item.prop == "userStatus") {
          item.value = self.change(data[item.prop]);
        } else if (item.prop === "roleInfoList") {
          item.value = self.dataTreating(data[item.prop], "roleName");
        } else if (item.prop === "insInfoVo") {
          if (data[item.prop]) {
            item.value = data[item.prop]["insName"] || "";
          }
        } else if (item.prop === "deptInfoList") {
          item.value = self.dataTreating(data[item.prop], "departmentName");
        } else if (
          (item.prop === "updateTime" && data[item.prop] != null) ||
          (item.prop === "createTime" && data[item.prop] != null)
        ) {
          item.value = moment(data[item.prop]).format("YYYY-MM-DD HH:mm:ss");
        } else if (item.prop === "insCode" && data["insInfoVo"]) {
          item.value = data["insInfoVo"]["insCode"];
        } else if (item.prop === "loginTime") {
          item.value = data[item.prop]
            ? moment(data[item.prop]).format("YYYY-MM-DD HH:mm:ss")
            : "此用户最近未登录！";
        } else if (item.prop === "loginIp") {
          item.value = data[item.prop] ? data[item.prop] : "此用户最近未登录！";
        } else if (item.prop === "loginCount") {
          item.value = data[item.prop] ? data[item.prop] : "此用户最近未登录！";
        }
      });
    }
  },
  methods: {
    change(val) {
      let options = {
        0: "启用",
        1: "禁用"
      };
      return options[val];
    },
    dataTreating(val, name) {
      let n = "";
      if (val != null && val.length > 0) {
        for (var i = 0; i < val.length; i++) {
          n += val[i][name] + ",";
        }
      }
      return n.substring(0, n.length - 1);
    }
  }
};
</script>

<style lang="less">
</style>