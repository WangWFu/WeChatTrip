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
  const id=event._id
  // console.log(id)
  // try{
  //   return await db.collection('triplist').doc(id).update({
  //     data:{
  //       loveNum:_.inc(1)
  //     }
  //   })
  // }catch(e){
  //   console.log(e)
  // }
  // if(event.addlove){
  //   try {
  //     return await db.collection('triplist').doc(id).update({
  //       data: {
  //           loveNum:_.inc(1)
  //       }
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }else if(event.dellove){
  //   try {
  //     return await db.collection('triplist').doc(id).update({
  //       data: {
  //         loveNum: event.delnum
  //       }
  //     })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }
  switch(event.action){
    case 'addmoney':{
      try{
        return await db.collection('triplist').doc(id).update({
          data: {
            loveNum: _.inc(1)
          }
        })
      }catch(e){
        console.log(e)
      }
    }

    case 'dellove':{
      try{
        return await db.collection('triplist').doc(id).update({
          data: {
            loveNum: event.delnum
          }
        })
      }catch(e){
        console.log(e)
      }  
    }

    case 'addzan':{
      try{
        return await db.collection('triplist').doc(id).update({
          data:{
            zanNum: _.inc(1)
          }
        })
      }catch(e){
        console.log(e)
      }
    }
    case 'delzan':{
      try{
        return await db.collection('triplist').doc(id).update({
          data:{
            zanNum: event.delZanNum
          }
        })
      }catch(e){
        console.log(e)
      }
    }

    case 'addcollection': {
      try {
        return await db.collection('triplist').doc(id).update({
          data: {
            collenNum: _.inc(1)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
    case 'delcollection': {
      try {
        return await db.collection('triplist').doc(id).update({
          data: {
            collenNum: event.delCollectionNum
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
    // case 'search':{
    //   try{
    //     return await db.collection('zanlist').aggregate()
    //      .lookup({
    //     from: 'triplist',
    //     localField: 'Pid',
    //     foreignField: '_id',
    //     as: 'publishedBooks',
    //   })
    //   .end()
    //   .then(res => console.log(res))
    //   .catch(err => console.error(err))
    //   }
    //   catch(e){
    //     console.log(e)
    //   }
    // }
          
  }
    
}