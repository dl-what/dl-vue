import Mock from 'mockjs'
import menuData from '@/libs/menu/'

Mock.mock('/api/menu', 'post', menuData);



//系统管理模拟数据

//系统管理模拟数据 
// const data = Mock.mock({
//   "code": 1,
//   "mssage": "成功",
//   "data|100": [{
//     "id|+1": 1,
//     "account": "@ctitle(3,5)",
//     "phoneNumber": /^1(5|3|7|8)[0-9]{9}$/,
//     "subsidiaryOrgan": "@ctitle(8,12)",
//     "department": "@ctitle(3,6)",
//     "userRole": "@ctitle(3,4)",
//     "name": "@cname(3,4)",
//     "latelyFrequency": /^[1-9]$/,
//     "latelyTime": "@date('yyyy-MM-dd HH:mm:ss')",
//     "latelyIP": /^[1-9]$/,
//     "createTime": "@date('yyyy-MM-dd HH:mm:ss')"

//   }]
// })

// const data2 = Mock.mock({
//   "code": 1,
//   "mssage": "成功",
//   "data|2": [{
//     "id|+1": 1,
//     "label": "@province",
//     "obj": {
//       "type": "@ctitle(3,5)",
//       "name": "@ctitle(3,5)",
//       "path": '@province' + '@city' + '@county',
//       "english": "@title",
//       "icon": "el-icon-right",

//       "sort": /^[1-9]$/,
//       "date2|1": true,
//       "date3|1-3": true
//     },
//     "children|10": [
//       {
//         "id|+1": 222,
//         "label": "@city",
//         "obj": {
//           "type": "@ctitle(3,5)",
//           "name": "@ctitle(3,5)",
//           "path": '@province' + '@city' + '@county',
//           "english": "@title",
//           "icon": "el-icon-right",

//           "sort": /^[1-9]$/,
//           "date2|1": true,
//           "date3|1-3": true
//         },
//         "children|15": [{
//           "id|+1": 1111,
//           "label": "@county",
//           "obj": {
//             "type": "@ctitle(3,5)",
//             "name": "@ctitle(3,5)",
//             "path": '@province' + '@city' + '@county',
//             "english": "@title",
//             "icon": "el-icon-right",



//   }]
// })
// const data3 = Mock.mock({
//   "code": 1,
//   "mssage": "成功",
//   "data|2": [{
//     "id|+1": 1,
//     "label": "@province",
//     "obj": {
//       "parentOrganization": "@ctitle(3,5)",
//       "area": "@province",
//       "parentEncoding": /^4[385][1-9]\d{8}/,
//       "regionalCode": /^1[385][1-9]\d{3}/,
//       "organizationName": "@ctitle(3,5)",
//       "organizationStatus|1": true,
//       "organizationCode": /^3[385][1-9]\d{4}/,
//       "remark": "@ctitle(3,8)",
//       "create": "@name(2,4)",
//       "createNameOne": '@date("yyyy-MM-dd HH:mm:ss")',
//       "modifine": "@name(2,4)",
//       "createTimeTwo": '@date("yyyy-MM-dd HH:mm:ss")',
//       "department|40":[
//         { 
//           "prevSection":"@ctitle(3,5)",
//           "section":"@ctitle(2,6)",
//           "departmentPrincipal":"@name(2,4)",
//           "principalPhone":/^1[385][1-9]\d{9}/,
//           "status|1":true,
//           "remark":"@ctitle(3,15)"
//          }
//        ],
//     },
//     "children|10": [
//       {
//         "id|+1": 222,
//         "label": "@city",
//         "obj": {
//           "parentOrganization": "@ctitle(3,5)",
//           "area": "@province",
//           "parentEncoding": /^4[385][1-9]\d{8}/,
//           "regionalCode": /^1[385][1-9]\d{3}/,
//           "organizationName": "@ctitle(3,5)",
//           "organizationStatus|1": true,
//           "organizationCode": /^3[385][1-9]\d{4}/,
//           "remark": "@ctitle(3,8)",
//           "create": "@name(2,4)",
//           "createNameOne": '@date("yyyy-MM-dd HH:mm:ss")',
//           "modifine": "@name(2,4)",
//           "createTimeTwo": '@date("yyyy-MM-dd HH:mm:ss")',
//           "department|40":[
//             { 
//               "prevSection":"@ctitle(3,5)",
//              "section":"@ctitle(2,6)",
//              "departmentPrincipal":"@name(2,4)",
//              "principalPhone":/^1[385][1-9]\d{9}/,
//              "status|1":true,
//              "remark":"@ctitle(3,15)"
//              }
//            ],
//         },
//         "children|15": [{
//           "id|+1": 1111,
//           "label": "@county",
//           "obj": {
//             "parentOrganization": "@ctitle(3,5)",
//             "area": "@province",
//             "parentEncoding": /^4[385][1-9]\d{8}/,
//             "regionalCode": /^1[385][1-9]\d{3}/,
//             "organizationName": "@ctitle(3,5)",
//             "organizationStatus|1": true,
//             "organizationCode": /^3[385][1-9]\d{4}/,
//             "remark": "@ctitle(3,8)",
//             "create": "@name(2,4)",
//             "createNameOne": '@date("yyyy-MM-dd HH:mm:ss")',
//             "modifine": "@name(2,4)",
//             "createTimeTwo": '@date("yyyy-MM-dd HH:mm:ss")',
//             "department|40":[
//              { 
//               "prevSection":"@ctitle(3,5)",
//              "section":"@ctitle(2,6)",
//              "departmentPrincipal":"@name(2,4)",
//              "principalPhone":/^1[385][1-9]\d{9}/,
//              "status|1":true,
//              "remark":"@ctitle(3,15)"
//               }
//             ],
//           }
//         }]
//       }]




//   }]
// })

// <<<<<<< HEAD
// Mock.mock(/\/shoopList/, "get", function (options) {
//   console.log(options);
//   // console.log(Json)
//   return data

// })

// Mock.mock(/\/menulist/, "get", function (options) {


//   // console.log(Json)
//   return data2

// })

// Mock.mock(/\/organilist/, "get", function (options) {


//   // console.log(Json)
//   return data3

// })

// =======
// Mock.mock(/\/shoopList/, "get", function (options) {
//   console.log(options);
//   // console.log(Json)
//   return data

// })

//Mock.mock(/\/menulist/, "get", function (options) {


//   // console.log(Json)
//   return data2

//})

// Mock.mock(/\/organilist/, "get", function (options) {


//   // console.log(Json)
//   return data3