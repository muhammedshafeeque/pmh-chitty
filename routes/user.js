var express = require('express');
const memberHelper = require('../helpers/member-helper');
var router = express.Router();
var meMberHelper = require('../helpers/member-helper');
var paYmentHelper = require('../helpers/payement-helper')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/user/user');
});
router.post('/serch',async(req,res)=>{
  console.log(req.body)
  member=await meMberHelper.memberSerch(req.body)
  data=req.body
  console.log(member._id)
  if(member!==0){
    history = await paYmentHelper.getUserHistory(member._id)
    console.log(history)
    res.render('user/profile',{member,history})

  }else{
    res.render('../views/user/user',{err:true});
  }
  
 

})

module.exports = router;
