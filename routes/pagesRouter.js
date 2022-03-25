var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var UsersModel = require('../models/users');
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

/* GET About Page. */
router.get('/about-me',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser'); 
  var getLoggedinUser= UsersModel.findOne({user_name:loginUser});
  getLoggedinUser.exec(function(err,data){
    if(err){
      res.json({
        error:false,
        msg:'error',
      });
    }else{ 
      res.render('about-me', { title: 'About Me',records:data});
    }
  }); 
});

/* Profile image upload */
router.use(express.static(__dirname+"./public/"));
const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: "./public/profiles/",
  filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() 
           + path.extname(file.originalname))
          // file.fieldname is name of the field (image)
          // path.extname get the uploaded file extension
  }
});

var upload = multer({
  storage:imageStorage
}).single("ProfileImg");

/* Post About Page  */
router.post('/update-profile',upload,function(req, res, next) {
  if(req.file){
    var UpdateDetails= UsersModel.findByIdAndUpdate(req.body.Id,{user_email:req.body.Email,user_fullname:req.body.Fname,user_image:req.file.filename,user_mobile:req.body.Mobile});
  }else{
    var UpdateDetails= UsersModel.findByIdAndUpdate(req.body.Id,{user_email:req.body.Email,user_fullname:req.body.Fname,user_mobile:req.body.Mobile});
  }
  UpdateDetails.exec(function(err,doc){
    if(err){  
      res.json({msg:'error'});  
    }else{  
      res.json({msg:'success'});  
    }  
  })
});


/* GET Change Password Page. */
router.get('/change-password', checkLoginUser, function(req, res, next) {
  res.render('change-password', { title: 'Change Password' });
});

module.exports = router;
