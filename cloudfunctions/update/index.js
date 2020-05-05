/**
 * 更新被采纳者的金币数
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database()
const _ = db.command
// 云函数入口函数,悬赏的
exports.main = async (event, context) => {
  var openid=event._openid
  try{
      return await db.collection('money').where({
        _openid:openid
      }).update({
        data:{
          moneyNum:_.inc(event.num)
        }
      })
  }catch(e){
      console.log(e)
  }
  
}