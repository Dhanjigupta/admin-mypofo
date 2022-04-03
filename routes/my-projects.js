var express = require('express');
var moment = require('moment');
var router = express.Router();
var cloudinary = require("../utils/uploadCloudinary");
var uploadProject = require("../utils/multer");
var projectModel = require('../models/projects');
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

/* APIs Get All Projects */
router.get('/my-all-projects',function(req, res, next){
    var getAllProject= projectModel.find({
      "$and":[
        {"project_status":"Enable"},
      ]
    });
    getAllProject.sort({ _id : "-1"})
    .exec(function(err,docs){
    if (err) {
      return res.json({
        error: true,
        message: err.message,
      });
    }
    res.json({
      error: false,
      message:"Got all projects.",
      data: docs,
    });
  });
});

/*All Blogs Page. */

router.get('/my-projects',checkLoginUser, function(req, res, next) {
    var perPage, page;
    if(req.body.limit!=="") perPage = req.body.limit;
    else perPage = 5;
    if(req.body.page!==""){page = req.body.page} else{page=1;} 
    var getAllProject= projectModel.find({});
    getAllProject.skip((perPage * page) - perPage).sort({ _id : "-1"})
      .limit(perPage).exec(function(err,data){
      if(err){
        res.json({
          error:false,
          msg:'error',
        });
      }else{ 
        projectModel.countDocuments({}).exec((err,count)=>{
         res.render('my-projects', { title: 'My Projects',records:data,current:page,perPageLimit:perPage,total:count,pages:Math.ceil(count/perPage),moment:moment});
       }); 
      }
    }); 
  });
  
  router.post('/my-project-grid',checkLoginUser, function(req, res, next) {
     var flrtSerach = req.body.Search;
     if(flrtSerach!=''){
      var flterParameter= {
        "$or":[
          {"project_title":{$regex:flrtSerach}},
       ]
      }
     }else{
       var flterParameter={}
     }
     var perPage= 5;
     var page = req.body.Page || 1;
     var getAllProject= projectModel.find(flterParameter);
     getAllProject.skip((perPage * page) - perPage).sort({ _id : "-1"})
     .limit(perPage).exec(function(err,data){
        if(err){
          res.json({
              error:false,
              msg:'error',
          });
         }else{ 
            projectModel.countDocuments({}).exec((err,count)=>{
          res.render('my-project-grid', {records:data,current:page,perPageLimit:perPage,total:count,pages:Math.ceil(count/perPage),moment:moment});
         }); 
       }
     }); 
  });
  
  router.get('/my-projects/:page',checkLoginUser, function(req, res, next) {
    var perPage = 5;
    var page = req.params.page || 1;
    var getAllProject= projectModel.find({});
    getAllProject.skip((perPage * page) - perPage).sort({ _id : "-1"})
      .limit(perPage).exec(function(err,data){
      if(err){
        res.json({
          error:false,
          msg:'error',
        });
      }else{ 
        projectModel.countDocuments({}).exec((err,count)=>{    
        res.render('my-projects', { title: 'My Blogs',records:data,current:page,total:count,perPageLimit:perPage,pages:Math.ceil(count/perPage),moment:moment});
        }); 
      }
    }); 
  });

/* GET Add Project Page. */
router.get('/add-project',checkLoginUser, function(req, res, next) {
    res.render('add-project', { title: 'My Projects'});
});
  
/* Project image upload in Folder */
// router.use(express.static(__dirname+"./public/"));
// const imageStorage = multer.diskStorage({
//   // Destination to store image     
//   destination: "./public/uploads/",
//   filename: (req, file, cb) => {
//         cb(null, file.fieldname + '_' + Date.now() 
//            + path.extname(file.originalname))
//           // file.fieldname is name of the field (image)
//           // path.extname get the uploaded file extension
//   }
// });
// var upload = multer({
//   storage:imageStorage
// }).single("ProjectImage");


  /* Post Add Blog  */
   router.post('/add-projects',uploadProject.single("ProjectImage"), async (req, res) => {
    try {
    // Upload image to cloudinary
    const addProjImg = await cloudinary.uploader.upload(req.file.path);
    const ProjectDetails =new projectModel({
    project_title: req.body.ProjectTitle,
    project_url: req.body.ProjectUrl,
    // porject_image: req.file.filename,
    porject_image: addProjImg.secure_url,
    cloudinary_id: addProjImg.public_id,
    });
    ProjectDetails.save(function(err,doc){
      if(err){  
        res.json({msg:'error'});  
      }else{  
        res.json({msg:'success'});  
      }  
    })
   } catch (err) {
    console.log(err);
  }
     
  });
  
  /* Edit Project */
  
  router.get('/edit-project/:id', function(req, res, next) {
    var project_id=req.params.id;
    var projectDetails=projectModel.findById(project_id);
    projectDetails.exec(function(err,data){
    if(err){
        res.json({
          error:false,
          msg:'error',
        });
      }else{
        res.render('edit-project', {title: 'My Project',records:data,id:project_id});
      }
    });
  });
  
  router.post('/edit-project',uploadProject.single("ProjectImage"),async (req, res) => {
    try{
    if(req.file){
      let exImage = await projectModel.findById(req.body.id);
    // Delete image from cloudinary
      await cloudinary.uploader.destroy(exImage.cloudinary_id);
      var editProjImg = await cloudinary.uploader.upload(req.file.path);
      var UpdateDetails= projectModel.findByIdAndUpdate(req.body.id,{project_title:req.body.ProjectTitle,project_url:req.body.ProjectUrl,porject_image:editProjImg.secure_url,cloudinary_id: editProjImg.cloudinary_id});
    }else{
      var UpdateDetails= projectModel.findByIdAndUpdate(req.body.id,{project_title:req.body.ProjectTitle,project_url:req.body.ProjectUrl});
    }
    UpdateDetails.exec(function(err,doc){
      if(err){  
        res.json({msg:'error'});  
      }else{  
        res.json({msg:'success'});  
      }  
    })
  } catch (err) {
    console.log(err);
  }
     
  });
  
  /* Delete Blogs */
  
  router.delete('/deleteProject', function(req, res, next) {
    var project_id=req.body.id;
    var ProjectDelete = projectModel.findByIdAndDelete(project_id);
      ProjectDelete.exec(function(err){
      if(err) {
        res.json({
          error:false,
          msg:'error',
        });
      }else{  
        res.json({
        error:false,
        msg:'success',
        }) 
     }
    });
  });
  
  /* Enable Project */
  
  router.post('/enableProject', function(req, res, next) {
    var project_id=req.body.id;
    var ProjectEnable=projectModel.findByIdAndUpdate(project_id,{project_status:"Enable"});
      ProjectEnable.exec(function(err){
      if(err) {
        res.json({
          error:false,
          msg:'error',
        });
      }else{  
        res.json({
        error:false,
        msg:'success',
        }) 
     }
    });
  });
  
  /* Disable Project */
  
  router.post('/disableProject', function(req, res, next) {
    var project_id=req.body.id;
    var ProjectDisable=projectModel.findByIdAndUpdate(project_id,{project_status:"Disable"});
      ProjectDisable.exec(function(err){
      if(err) {
        res.json({
          error:false,
          msg:'error',
        });
      }else{  
        res.json({
        error:false,
        msg:'success',
        }) 
     }
    });
  });

module.exports = router;