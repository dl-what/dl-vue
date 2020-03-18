/**
 * 验证器
*/
import regularList from './regularList'
let regular = {};
regularList.forEach(item => {
  regular[Object.keys(item)[0]] = Object.values(item)[0]
})

export default {
  // 为空
  empty(rule, value, callback) {
    if (value === '') {
      callback(new Error(rule.message));
      return;
    }
    callback();
  },
  // 正则匹配
  match(rule, value, callback) {
    if (!regular[rule.regType].test(value)) {
      callback(new Error(rule.message));
      return;
    }
    callback();
  }
}