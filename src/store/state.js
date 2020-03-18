import storage from '@/utils/storage'

const state = {
  loginInfo: storage.get('userInfo') || null, // 用户已登录数据
  entry: storage.session.get('entry') || storage.get('entry') || null, // 模块入口数据
  routerTags: storage.session.get('routerTags') || [], // 路由标签列表
  fsMode: {index: 1, className: 'fs-b'}, // storage.get('fsMode') || {index: 1, className: 'fs-m'}, // 网页字体大小 0=>小 1=>中 2=>大
  isFull: false, // 是否全屏
  HSP_SocketUrl: 'ws://127.0.0.1:12345',// 高拍仪socket url
  IDC_SocketUrl: 'ws://127.0.0.1:8080',// 投注卡读取器socket url
  NKB_SocketUrl: 'ws://127.0.0.1:8080',// 数字键盘socket url
  SCAN_SocketUrl: 'ws://127.0.0.1:8080',// 兑奖码扫描socket url
  data: [{
    icon: "el-icon-info",
    info: "渠道名称",
    name: "中心管理部门",
    num: "85"
  }],
  insData: null, // 机构数据
  gameTypeData: null, // 游戏类型数据 下拉框
  gameTypeOptions: null, // 游戏类型数据匹配
  //会员权益数据

  rechargeList:[],
  menuData: null, // 菜单数据
}
export default state;