const { response } = require('express');
var express = require('express');
const { Db, ReplSet } = require('mongodb');
const { PAYEMENT_COLLECTION } = require('../config/collection');
const memberHelper = require('../helpers/member-helper');
var router = express.Router();
var meMberHelper = require('../helpers/member-helper');
const payementHelper = require('../helpers/payement-helper');
var paYmentHelper = require('../helpers/payement-helper')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let grups = await memberHelper.grUps()
  let totalpayable = await payementHelper.totalpayable()
  res.render('../views/admin/admin-home', { admin: true, grups, totalpayable });
});
router.get('/add-member', (req, res) => {
  res.render('admin/add-member', { admin: true })
})
router.post('/add-member', (req, res) => {
  meMberHelper.addMember(req.body).then(() => {
    res.render('admin/add-member', { admin: true })
  })

})
router.get('/add-grup', async (req, res) => {
  let grups = await meMberHelper.grUps()



  let count = await payementHelper.grupeCount()

  if (count > 0) {

    let max = grups[0].maxamount
    res.render('admin/add-grups', { admin: true, grups, maxamount: true, max })
  } else {
    res.render('admin/add-grups', { admin: true, grups })
  }

})
router.post('/create-grupe', async (req, res) => {

  await meMberHelper.creaTeGrupe(req.body)

  let count = await payementHelper.grupeCount()
  await payementHelper.calculateGrupesTotal(count, req.body)
  res.redirect('/admin/add-grup')

})
router.get('/remove-gupe/:id', async (req, res) => {
  await meMberHelper.remoVeGrupe(req.params.id)
  await payementHelper.calculateGrupesTotalRe()
  res.redirect('/admin/add-grup')

})
router.get('/members', async (req, res) => {
  let members = await memberHelper.checkMemberAvaile()

  res.render('admin/members', { admin: true, members })
})
router.get('/add-to-grup', async (req, res) => {
  let grups = await meMberHelper.grUps()


  res.render('admin/add-to-grup', { admin: true, grups })
})
router.get('/add-memberto-grup/:id', async (req, res) => {
  let grupmembers = await memberHelper.gruPeMemBers(req.params.id)
  await meMberHelper.getGrupeDetails(req.params.id).then(async (grup) => {
    let members = await memberHelper.getMembers()
    let payable= await payementHelper.totalpayable()
    if (grup.need != 0) {
      res.render('admin/grup', { grup, members, grupmembers, admin: true, need: true,payable })
    } else {
      res.render('admin/grup', { grup, members, grupmembers, admin: true,payable })
    }


  })

})
router.post('/add-this', async (req, res) => {

  await memberHelper.grupToMember(req.body)
  await meMberHelper.grupTotal(req.body)
  await memberHelper.memberToGrupe(req.body).then((response) => {
    res.json(response)
  })



})
router.post('/remove-from-grupe', async (req, res) => {
  await memberHelper.removeFromGrupe(req.body)
  await memberHelper.changeToNill(req.body)
  res.json(response)
})
router.get('/grups/:id', async (req, res) => {
  let grup = await meMberHelper.getGrupeDetails(req.params.id)
  let grupmembers = await memberHelper.gruPeMemBers(req.params.id)
  res.render('admin/grupe-profile', { grupmembers, admin: true, grup })

})
router.get('/cashpayment', async (req, res) => {
  let members = await memberHelper.checkMemberCanPay()

  res.render('admin/cashpayement', { admin: true, members })

})
router.get('/payement', async (req, res) => {
  payements = await memberHelper.allPayements()

  res.render('admin/payement', { admin: true, payements })

})
router.get('/makepayment/:id', async (req, res) => {
  member = await memberHelper.getMember(req.params.id)
  
  history = await paYmentHelper.getUserHistory(req.params.id)
  res.render('admin/member-payement', { admin: true, member, history })
})
router.post('/member-pay', async (req, res) => {
  data=req.body
  data.methord = 'CASH'
  data.type='payement'
  await memberHelper.addPayment(data)
  await paYmentHelper.balance(data)
  //await payementHelper.paymentToGrupe(req.body)

  res.redirect('/admin/payement')

})
router.get('/gift',async(req,res)=>{
  grups=await memberHelper.getUnGifted()
  res.render('admin/gift',{admin: true,grups})
})
router.post('/giv-gift',async(req,res)=>{
  await meMberHelper.gift(req.body)
  grupId=req.body.grupId
  await meMberHelper.membersGifted(req.body)
  res.json(response)
  
})
router.get('/pay-gift-amount',async(req,res)=>{
  members= await memberHelper.giftPendingPayemnt()
  res.render('admin/gift-payment',{admin:true,members})
})
router.get('/give-gift-payement/:id',async(req,res)=>{
  
 member= await meMberHelper.memeberCAnGift(req.params.id)
 history = await paYmentHelper.getUserHistory(req.params.id)
 res.render('admin/member-payement', { admin: true, member, history,gift:true })
 
})
router.post('/member-pay-gift',async(req,res)=>{
  data=req.body
  data.methord='CASH'
  data.type='gift'
  data.date=new Date()

  await memberHelper.changeGiftStatus(data)
  await paYmentHelper.giftPayement(data)
  res.redirect('/admin')
})
module.exports = router;
