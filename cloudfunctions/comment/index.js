// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
  // env: 'mysql-eoa9v',
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  if(event.type===1){
    try {
      return await db.collection('tripcomment').doc(event.id).update({
        data: {
          replaylist: _.push(event.replaydata)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }else if(event.type===2){
    try {
      return await db.collection('tripcomment').doc(event.id).update({
        data: {
          replaylist: _.push(event.Rerplydata)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

}