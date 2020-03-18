export default {
  //通知方式改变
  getInformIdByCheckValue(arrList) {
    let informType;
    if (arrList) {
      if (arrList.length == 1) {
        if (arrList.includes("工作流")) {
          informType = 1;
        } else if (arrList.includes("邮件")) {
          informType = 2;
        } else {
          informType = 3;
        }
      } else if (arrList.length == 2) {
        if (arrList.includes("工作流") && arrList.includes("邮件")) {
          informType = 4;
        } else if (arrList.includes("短信") && arrList.includes("邮件")) {
          informType = 6;
        } else {
          informType = 5;
        }
      } else if (arrList.length == 3) {
        informType = 7;
      } else {
        informType = "";
      }
    }
    return informType
  },
  //数字转换成小数
  conventToPoint(percent) {
    // console.log(typeof percent)
    if (percent) {
      if (typeof percent === 'string') {
        percent = Number(percent.split('%')[0]) / 100
      } else {
        percent = Number(percent / 100)
      }
      // console.log(percent)

    }
    return percent;
  },
  //根据数值选中对应通知方式
  showInformType(type) {
    var list = [];
    switch (type) {
      case 1:
        list = ["工作流"];
        break;
      case 2:
        list = ["邮件"];
        break;
      case 3:
        list = ["短信"];
        break;
      case 4:
        list = ["工作流", "邮件"];
        break;
      case 5:
        list = ["工作流", "短信"];
        break;
      case 6:
        list = ["邮件", "短信"];
        break;
      case 7:
        list = ["工作流", "邮件", "短信"];
        break;
    }
    return list;
  },

  showTextByType(item, type) {
    var InformType;
     if(item=="collectStatus"){
      switch (type) {
        case 0:
          InformType = "生效";
          break;
        case 1:
          InformType = "停止";
          break;
      }
    }else if(item=="type"){
      switch (type) {
        case 1:
          InformType = "投注卡";
          break;
        case 2:
          InformType = "会员";
          break;
      }
    }else {
      switch (type) {
        case 1:
          InformType = "工作流";
          break;
        case 2:
          InformType = "邮件";
          break;
        case 3:
          InformType = "短信";
          break;
        case 4:
          InformType = "工作流+邮件";
          break;
        case 5:
          InformType = "工作流+短信";
          break;
        case 6:
          InformType = "邮件+短信";
          break;
        case 7:
          InformType = "工作流+邮件+短信";
          break;
      }
    } 

    return InformType;
  },


  //小数转换成百分比数字
  conventToPercent(point) {  
    var percent=''
    if (point) {
       percent = Number(point) * 100 + '%'      
    }
    return percent;
  },
  checkInformPeople(propsData){
    if (propsData.checkListOrdinary.length > 0) {
      if (
        propsData.checkListOrdinary.length === 1 &&
        propsData.checkListOrdinary[0] === "工作流"
      ) {
      } else {
        if (
          propsData.people1.length == 0 &&
          propsData.people4.length == 0 &&
          propsData.people7.length == 0
        ) {
          
          return `请选择Ⅲ级通知对象`;
        }
      }
    }
    if (propsData.checkListSeriours.length > 0) {
      if (
        propsData.checkListSeriours.length === 1 &&
        propsData.checkListSeriours[0] === "工作流"
      ) {
      } else {
        if (
          propsData.people2.length == 0 &&
          propsData.people5.length == 0 &&
          propsData.people8.length == 0
        ) {
          return `请选择Ⅱ级通知对象`;
        }
      }
    }
    if (propsData.checkListMajor.length > 0) {
      if (
        propsData.checkListMajor.length === 1 &&
        propsData.checkListMajor[0] === "工作流"
      ) {
      } else {
        if (
          propsData.people3.length == 0 &&
          propsData.people6.length == 0 &&
          propsData.people9.length == 0
        ) {
          ;
          return `请选择Ⅰ级通知对象`;
        }
      }
    }
    return true
  }
}