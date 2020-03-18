import moment from 'moment';

// 获取表单
function get(data) {
  let form = {}
  data&&data.forEach((item) => {
    form[item.prop] = item.value;
    // 处理时间
    if(item.type=='datepicker') {
      form[item.prop] = item.value&&moment(item.value).format("YYYY-MM-DD")
    }
    if(item.type=='datepicker-range') {
      form[item.options[0]] = item.value&&moment(item.value[0]).format("YYYY-MM-DD")
      form[item.options[1]] = item.value&&moment(item.value[1]).format("YYYY-MM-DD")
      delete form[item.prop]
    }
    if(item.type=='datetime') {
      form[item.prop] = item.value&&moment(item.value).format("YYYY-MM-DD HH:mm:ss")
    }
    if(item.type=='datetime-range') {
      form[item.options[0]] = item.value&&moment(item.value[0]).format("YYYY-MM-DD HH:mm:ss")
      form[item.options[1]] = item.value&&moment(item.value[1]).format("YYYY-MM-DD HH:mm:ss")
      delete form[item.prop]
    }
    // 级联选择器返回最后一个机构id
    if(item.type == 'cascader-multiple') {
      form[item.prop] = []
      for(let i=0;i<item.value.length;i++) {
        form[item.prop][i] = item.value[i][item.value[i].length-1]
      }
    }
    if(item.type == 'cascader') {
      form[item.prop] = item.value[item.value.length-1]
    }
  });
  return form;
}

// 回填表单的值
function set(data, prop, flag, value) {
  data&&data.forEach((item) => {
    if(item.prop==prop) {
      item[flag] = value;
    }
  });
  return data;
}

// 切换表单
function toggle(data, form) {
  let array = []
  data&&data.forEach((item) => {
    if(form[item.prop]!==undefined) {
      array.push(item)
    }
  });
  return array;
}
 
// 返回完整数组
function getInsArray(id, key, data, keyBack) { // id 'id' 传入id和key是对应  keyBack是返回想要的key
  const self = this;
  for (var i in data) {
    if (data[i][key] == id) {
      return [data[i][keyBack]];
    }
    if (data[i].children) {
      let ro = self.getInsArray(id, key, data[i].children, keyBack);
      if (ro !== undefined) {
        return ro.concat(data[i][keyBack]);
      }
    }
  }
}

// 设置options的值
function setOptions(data, form) {
  data&&data.forEach((item)=>{
    item.value = form[item.prop];
  })
  return data;
}
export default {
  get,
  set,
  toggle,
  getInsArray,
  setOptions
}