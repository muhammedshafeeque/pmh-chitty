var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/user/user');
});
router.post('/serch',(req,res)=>{
  
})

module.exports = router;
