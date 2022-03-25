var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var bcrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

/* Get SignUp Page. */
router.get('/signup', function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    if(loginUser){
      res.redirect('./dashboard');
    }else{
      res.render('signup', { title: 'Sign Up',errors:'', msg:''});
    }
  });
  
  /* Check User Exists */
  function checkUsername(req,res,next){
   var uname=req.body.UserName;
   var checkexitemail=userModel.findOne({user_name:uname});
   checkexitemail.exec((err,data)=>{
   if(err) throw err;
   if(data){
    return res.render('signup', { title: 'Sign Up', msg:'Username Already Exist' });
   }
    next();
    });
  }
  
  /* Check Email Exists */
  function checkEmail(req,res,next){
   var email=req.body.Email;
   var checkexitemail=userModel.findOne({user_email:email});
   checkexitemail.exec((err,data)=>{
   if(err) throw err;
   if(data){
     return res.render('signup', { title: 'Sign Up', msg:'Email Already Exist' });
   }
   next();
   });
  }
  
  /* Post Sign Up Page */
  router.post('/signup',[ check('UserName','User name length should be minimum 4').isLength({ min: 4 })], checkUsername, checkEmail,function(req, res, next) {
    var password=req.body.Password;
    var confpassword=req.body.ConfirmPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('signup', { title: 'Sign Up',errors:errors.mapped(),msg:'' });
    }else{
        if(password !=confpassword){
          res.render('signup', { title: 'Sign Up',errors:'',msg:'Password not matched!' });
        }else{
          const userDetails =new userModel({
          user_name: req.body.UserName,
          user_email: req.body.Email,
          user_password: bcrypt.hashSync(req.body.Password,10),
          });
          userDetails.save(function(err,doc){
            if(err) throw err;
              res.render('signup', { title: 'Sign Up', errors:'', msg:'User Registerd Successfully.' });
          })
        }
      }
  });
  

module.exports = router;