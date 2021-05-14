var db = require('../config/connection')
var collection = require('../config/collection')
const { ObjectId, ObjectID } = require('bson')
const { response } = require('express')
const { CONSTAND_COLLECTION } = require('../config/collection')
module.exports = {
    getUserHistory: (memberId) => {
        
        console.log(memberId)
        return new Promise(async (resolve, reject) => {
            history = await db.get().collection(collection.PAYEMENT_COLLECTION).find({ member: memberId }).toArray()
            
            resolve(history)
        })
    },
    grupeCount: () => {
        return new Promise(async (resolve, reject) => {
            count = await db.get().collection(collection.GRUPE_COLLECTION).count()
            resolve(count)
        })


    },
    calculateGrupesTotal: (count,data) => {
        total=count*data.maxamount
        let grup={
            name:'grup',
            total:total,
            count:count,
            amount:data.maxamount
        }
        return new Promise(async(resolve,reject)=>{
          grupecash=await   db.get().collection(collection.CONSTAND_COLLECTION).findOne({name:'grup'})
          
          if(grupecash){
             let grupe = await db.get().collection(collection.CONSTAND_COLLECTION)
             .updateOne({name:'grup'},
             {
                 $set:{
                    total:total,
                    count:count
                 }
             })
              resolve(grupe)
              

          }else{
              await db.get().collection(collection.CONSTAND_COLLECTION).insertOne(grup)
              resolve()
              
          }
        })

    },
    calculateGrupesTotalRe:()=>{
        return new Promise(async(resolve,reject)=>{
            grupe=await   db.get().collection(collection.CONSTAND_COLLECTION).findOne({name:'grup'})
            console.log(grupe)
            let count=grupe.count-1
          let   total=count*grupe.amount
          console.log(total)
            await db.get().collection(collection.CONSTAND_COLLECTION)
             .updateOne({name:'grup'},
             {
                 $set:{
                    total:total,
                    count:count
                 }
             })
              resolve()
              
            
        })

    },
    totalpayable:()=>{
        return new Promise(async(resolve,reject)=>{
            let payable= await db.get().collection(collection.CONSTAND_COLLECTION).findOne({name:'grup'})
            console.log(payable)
            if(payable){
                resolve(payable.total)
            }else{
                resolve()
            }
            
        })
    },
    balance:(data)=>{
        
        return new Promise (async(resolve,reject)=>{
            let member= await db.get().collection(collection.MEMBER_COLLECTION).findOne({_id:ObjectId(data.member)})
            let balanc=member.payable-member.paid
            await db.get().collection(collection.MEMBER_COLLECTION).updateOne({_id:ObjectId(data.member)},
            {
                $set:{balance:balanc}
            })
            resolve()
        })

    },
    paymentToGrupe:(data)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection)
            console.log(data)
            resolve()
        })
    },
    giftPayement:(data)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collection.PAYEMENT_COLLECTION).insertOne(data)
            resolve()
        })
    }
   
}