<template>
  <div class="sideMenu-container">
    <el-row class="tac">
      <el-col class="menu-group">
        <el-menu
          ref="elMenu"
          :default-active="$route.query.activeName || $route.meta.parentName || $route.name"
          @open="handleOpen"
          @close="handleClose"
          :collapse="isCollapse"
          :unique-opened="true"
        >
          <li class="menu-logo">
            <span class="ct">
              <span class="logo-box">
                <i class="iconfont icon-B-fulicaipiao"></i>
              </span>
              <span class="name">视频彩票运营管理平台</span>
            </span>
          </li>
          <li class="menu-wrapper">
            <menu-tree :menuData="menuList"></menu-tree>
          </li>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import menuTree from './menuTree'
import storage from '@/utils/storage'
import {mapGetters} from 'vuex'
// import menuList from '@/libs/menu/'

export default {
  name: "sideMenu",
  data() {
    return {
      isCollapse: false,
      menuList: null,
      title: "VLT管理系统"
    };
  },
  computed: {
    ...mapGetters(["entry", "routerTags", 'menuData'])
  },
  created() {
    this.getList();
  },
  mounted() {
    const self = this;
    self.eventBus.$on("menuCollapse", value => {
      self.isCollapse = value;
    });
  },
  methods: {
    // 获取菜单列表
    getMenuList() {
      const self = this;
      let data = [];
      this.menuData&&this.menuData[0].children.forEach(item => {
        if(item.extendAttach==self.entry.extendAttach) {
          data = item.children;
        }
      });
      this.menuList = JSON.parse(JSON.stringify(data))
      // 菜单过滤
      let n=0;
      (function filter(treeData) {
        
        for (let i = 0, len = treeData.length; i < len; i++) {
          // 最顶层菜单添加class
          if (n === 0) {
            treeData.map(item => {item.className = 'top-menu-item'});
          }
          let children = treeData[i].children || [];
          if (!children && children.length == 0) {
            return;
          }
          n++;
          // 删除图标(最上级以下全部清除)
          if (n > 0) {
            children.map(item => {delete item.iconCls});
          }
          // 过滤按钮、已冻结菜单
          treeData[i].children = children.filter(item => {
            if (item.type !== 4 && item.status === 1) {
              return true;
            }
          });
          filter(children);
        }
      })(self.menuList);
    },
    // 获取菜单列表
    async getList() {
      const self = this;
      const res = await self.$api.getUserAndModule({
        data: {
          type: 2,
          sysCode: self.entry.extendAttach
        }
      });
      if (res && res.code == 0) {
        let n = 0;
        self.menuList = res.data[0].children;
        // 菜单过滤
        (function filter(treeData) {
          
          for (let i = 0, len = treeData.length; i < len; i++) {
            // 最顶层菜单添加class
            if (n === 0) {
              treeData.map(item => {item.className = 'top-menu-item'});
            }
            let children = treeData[i].children || [];
            if (!children && children.length == 0) {
              return;
            }
            n++;
            // 删除图标(最上级以下全部清除)
            if (n > 0) {
              children.map(item => {delete item.iconCls});
            }
            // 过滤按钮、已冻结菜单
            treeData[i].children = children.filter(item => {
              if (item.type !== 4 && item.status === 1) {
                return true;
              }
            });
            filter(children);
          }
        })(self.menuList);
      }
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    select(index, indexPath) {}
  },
  components: {
    menuTree
  }
};
</script>

<style lang="less">
.sideMenu-container {
  float: left;
  text-align: left;
  height: 100%;
  overflow: hidden;
  background-color: #001d41;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
  .menu-wrapper {
    position: absolute;
    left: 0;
    top: 64px;
    bottom: 0;
    width: 100%;
    overflow: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background-color: rgba(0, 0, 0, 0.6);
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      background-color: transparent;
    }
    .el-menu-item,
    .el-submenu__title {
      background-color: transparent;
      height: 50px;
      line-height: 50px;
    }
    .el-submenu .el-menu-item {
      height: 44px;
      line-height: 44px;
    }
  }
  .el-row,
  .menu-group,
  .el-menu {
    height: 100%;
  }
  .el-menu-item,
  .el-submenu__title {
    color: rgba(255, 255, 255, 0.6);
    &:hover {
      background-color: #1b3054;
    }
  }
  .top-menu-item .iconfont {
    margin-right: 3px;
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
    width: 24px;
    text-align: center;
    display: inline-block;
  }
  .el-menu-item:focus {
    background-color: transparent;
  }
  .el-menu {
    border-right: none;
    width: 260px;
    background-color: transparent;
    .el-menu-item.is-active {
      color: rgba(255, 255, 255, 1);
      background-color: #003474;
      font-size: 15px;
      &:focus {
        background-color: #003474;
      }
    }
    &.el-menu--collapse {
      width: 64px;
      .el-submenu__title {
        .el-submenu__icon-arrow {
          display: none;
        }
      }
      .submenu-title {
        .title {
          display: none;
        }
      }
      .menu-logo {
        .ct {
          width: auto;
        }
        .iconfont {
          font-size: 24px;
        }
        .name {
          display: none;
        }
      }
    }
    .is-opened {
      .el-menu {
        // background-color: #303750;
      }
    }
  }

  .menu-logo {
    color: #ffffff;
    line-height: 64px;
    font-size: 0;
    text-align: center;
    background-color: #002553;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    .ct {
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      word-break: keep-all;
      white-space: nowrap;
      display: inline-block;
      vertical-align: top;
    }
    .name {
      font-size: 18px;
      display: inline-block;
      vertical-align: top;
      word-break: keep-all;
      margin-left: 7px;
    }
    .logo-box {
      background-color: #fff;
      width: 36px;
      height: 36px;
      line-height: 36px;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }
    .iconfont {
      color: #e60012;
      font-size: 28px;
    }
  }

  .el-submenu__title {
    .el-submenu__icon-arrow {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .top-menu-item {
    &.is-opened {
      background-color: #001733;
      > .el-submenu__title {
        position: relative;
        color: rgba(255, 255, 255, 1);
        .iconfont,
        .el-submenu__icon-arrow {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
}
</style>