var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var bcrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* Get Login Page. */
router.get('/', function(req, res, next) {
  loginUser =  localStorage.getItem('loginUser');
  if(loginUser){
    res.redirect('./dashboard');
  }else{
   res.render('index', { title: 'Login', msg:'' });
  }
});
/* Post Login Page. */
router.post('/', function(req, res, next) {
  var userName=req.body.UserName;
  var Password=req.body.Password;
  var checkUser=userModel.findOne({user_name:userName});
  checkUser.exec((err, data)=>{
    if(data==null){
     res.render('index', { title: 'Login', msg:"Invalid Username and Password." });
     }else{
      if(err) throw err;
      var getUserID=data._id;
      var getPassword=data.user_password;
      if(bcrypt.compareSync(Password,getPassword)){
        var token = jwt.sign({ userID: getUserID }, 'loginToken');
        localStorage.setItem('userToken', token);
        localStorage.setItem('loginUser', userName);
        //res.session.UserNameSession=userName;
        //console.log(res.session.UserNameSession);
        res.redirect('./dashboard');
      }else{
        res.render('index', { title: 'Login', msg:"Invalid Username and Password." });
      }
    }
   });
});

/* Logout Page. */
router.get('/logout', function(req, res, next) {
  // res.session.destroy(function(err){
  //   if(err){
  //     res.redirect('./'); 
  //   }
  // })

  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('./');
});

module.exports = router;