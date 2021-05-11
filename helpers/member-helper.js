var db = require('../config/connection')
var collection = require('../config/collection')
const { ObjectId, ObjectID } = require('bson')
const { response } = require('express')
module.exports = {
  addMember: (details) => {
    details.paid = 0
    details.payment = parseInt(details.payment)
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collection.MEMBER_COLLECTION).insertOne(details)
      resolve()
    })
  },
  checkMemberAvaile: () => {
    return new Promise(async (resolve, reject) => {
      let members = await db.get().collection(collection.MEMBER_COLLECTION).find().toArray()

      resolve(members)
    })

  },
  creaTeGrupe: (grupe) => {

    grupe.maxamount = parseInt(grupe.maxamount)
    grupe.totalamount = parseInt(grupe.totalamount)
    grupe.need = grupe.maxamount
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collection.GRUPE_COLLECTION).insertOne(grupe)
      resolve()
    })
  },
  grUps: () => {
    return new Promise(async (resolve, reject) => {
      let grups = await db.get().collection(collection.GRUPE_COLLECTION).find().toArray()
      resolve(grups)
    })
  },
  remoVeGrupe: (gruprId) => {
    db.get().collection(collection.GRUPE_COLLECTION).removeOne({ _id: ObjectId(gruprId) })

  },
  getGrupeDetails: (grupId) => {
    return new Promise(async (resolve, reject) => {
      let grup = await db.get().collection(collection.GRUPE_COLLECTION).findOne({ _id: ObjectId(grupId) })
      resolve(grup)
    })
  },
  grupToMember: (details) => {
    console.log(details)
    let share = 100 * (details.payment / details.maxamount)
    let payable=details.payable*(share/100)
    console.log(payable)

    return new Promise(async (resolve, reject) => {
      await db.get().collection(collection.MEMBER_COLLECTION)
        .updateOne({ _id: ObjectId(details.memberID) },
          {
            $set: {
              grup: details.grup,
              persent: share,
              payable:payable,
              grupId:details.grupId

            }
          }).then((respons) => {

            resolve(respons)
          })

    })
  },
  getMembers: () => {
    return new Promise(async (resolve, reject) => {
      let members = await db.get().collection(collection.MEMBER_COLLECTION).find({ grup: 'Nill' }).toArray()
      resolve(members)

    })
  },
  memberToGrupe: (data) => {


    return new Promise(async (resolve, reject) => {

      await db.get().collection(collection.GRUPE_COLLECTION)
        .updateOne({ _id: ObjectId(data.grupId) },
          {

            $push: { member: ObjectId(data.memberID) }
          }
        )

      resolve(response)
    })

  },
  gruPeMemBers: (grupId) => {
    return new Promise(async (resolve, reject) => {
      let grupemembers = await db.get().collection(collection.GRUPE_COLLECTION).aggregate([
        {
          $match: { _id: ObjectId(grupId) }
        },
        {
          $unwind: '$member'
        },
        {
          $lookup: {
            from: collection.MEMBER_COLLECTION,
            localField: 'member',
            foreignField: '_id',
            as: 'members'
          }

        },
        {
          $project: {
            fname: 1, maxamount: 1, totalamount: 1, members: { $arrayElemAt: ['$members', 0] }
          }
        }
      ]).toArray()
      resolve(grupemembers)
    })
  },
  grupTotal: (data) => {
    data.payment = parseInt(data.payment)
    return new Promise(async (resolve, reject) => {
      let grup = await db.get().collection(collection.GRUPE_COLLECTION).findOne({ _id: ObjectId(data.grupId) })

      let need = await grup.need - data.payment
      let payment = await grup.totalamount + data.payment





      await db.get().collection(collection.GRUPE_COLLECTION)
        .updateOne({ _id: ObjectId(data.grupId) },
          {
            $set: {
              totalamount: payment,
              need: need
            }
          })
      resolve(response)
    })
  },
  removeFromGrupe: (data) => {
    return new Promise(async (resolve, reject) => {
      data.payment = parseInt(data.payment)
      let grup = await db.get().collection(collection.GRUPE_COLLECTION).findOne({ _id: ObjectId(data.grup) })
      let need = await grup.need + data.payment
      let payment = await grup.totalamount - data.payment

      await db.get().collection(collection.GRUPE_COLLECTION)
        .update({ _id: ObjectId(data.grup) },
          {
            $pull: { member: ObjectId(data.memberID) },
            $set: {
              totalamount: payment,
              need: need
            }
          })



      resolve()

    })
  },
  changeToNill: (data) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collection.MEMBER_COLLECTION)
        .updateOne({ _id: ObjectId(data.memberID) },
          {
            $set: { 
              grup: 'Nill',
              grupId:'nill' 
          }
          })

      resolve()
    })

  },
  checkMemberCanPay: () => {
    return new Promise(async (resolve, reject) => {
      members = await db.get().collection(collection.MEMBER_COLLECTION).find({ grup: { $nin: ['Nill'] } }).toArray()
      resolve(members)
    })

  },
  getMember: (memberID) => {
    return new Promise(async (resolve, reject) => {
      member = await db.get().collection(collection.MEMBER_COLLECTION).findOne({ _id: ObjectID(memberID) })
      resolve(member)
    })
  },
  addPayment: (data) => {
    data.amount = parseInt(data.amount)
    data.methord = 'CASH'
    data.date = new Date()
    return new Promise(async (resolve, reject) => {
      await db.get().collection(collection.PAYEMENT_COLLECTION).insertOne(data)
      member = await db.get().collection(collection.MEMBER_COLLECTION).findOne({ _id: ObjectID(data.member) })
      paidamount = member.paid + data.amount

      await db.get().collection(collection.MEMBER_COLLECTION)
        .updateOne({ _id: ObjectID(data.member) },
          {
            $set: { paid: paidamount }
          })
      resolve()
    })

  },
  allPayements: () => {
    return new Promise(async (resolve, reject) => {
      payements = await db.get().collection(collection.PAYEMENT_COLLECTION).find().toArray()
      resolve(payements)
    })
  },
  getUnGifted:()=>{
    return new Promise(async(resolve,reject)=>{
      grups= await db.get().collection(collection.GRUPE_COLLECTION).find({ status: { $nin: ['gifted'] } }).toArray()
      resolve(grups)
    })
  },
  gift:(data)=>{
    return new Promise(async(resolve,reject)=>{
      await db.get().collection(collection.GRUPE_COLLECTION).updateOne({_id:ObjectId(data.grupId)},
      {
        $set:{status:'gifted',
              date: new Date()
        }
      })
      resolve()
    })
  },
  membersGifted:(data)=>{
    return new Promise(async(resolve,reject)=>{
    
     await db.get().collection(collection.MEMBER_COLLECTION).updateMany({grupId:data.grupId},
      {
        $set:{
        status:'gifted',
         date:new Date(),
         payementstatus:'pending'
        }
      })
     
     
     resolve()
    })
  },
  giftPendingPayemnt:()=>{
    return new Promise(async(resolve,reject)=>{
      members= await  db.get().collection(collection.MEMBER_COLLECTION).find({payementstatus:'pending'}).toArray()
      resolve(members)
    })
  }
}