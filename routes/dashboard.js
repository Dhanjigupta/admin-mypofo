var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* Check Logined User */
function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

/* GET Dashboard Page. */
router.get('/dashboard',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    res.render('dashboard', { title:'Dashboard', msg:'', loginUser:loginUser});
});

module.exports = router;