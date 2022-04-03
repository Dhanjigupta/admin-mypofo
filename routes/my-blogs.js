var express = require('express');
var moment = require('moment');
var router = express.Router();
var cloudinary = require("../utils/uploadCloudinary");
var uploadBlog = require("../utils/multer");
var blogCatModel = require('../models/blog_categories')
var blogModel = require('../models/blogs');
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

/*All Blogs Page. */

router.get('/my-blogs',checkLoginUser, function(req, res, next) {
    var perPage, page;
    if(req.body.limit!=="") perPage = req.body.limit;
    else perPage = 5;
    if(req.body.page!==""){page = req.body.page} else{page=1;} 
    var getAllBlog= blogModel.find({});
    getAllBlog.skip((perPage * page) - perPage).sort({ _id : "-1"})
      .limit(perPage).exec(function(err,data){
      if(err){
        res.json({
          error:false,
          msg:'error',
        });
      }else{ 
         blogModel.countDocuments({}).exec((err,count)=>{
         res.render('my-blogs', { title: 'My Blogs',records:data,current:page,perPageLimit:perPage,total:count,pages:Math.ceil(count/perPage),moment:moment});
       }); 
      }
    }); 
  });
  
  router.post('/my-blog-grid',checkLoginUser, function(req, res, next) {
     var flrtSerach = req.body.Search;
     if(flrtSerach!=''){
      var flterParameter= {
        "$or":[
          {"blog_title":{$regex:flrtSerach}},
          {"blog_category":{$regex:flrtSerach}}
        ]
      }
     }else{
       var flterParameter={}
     }
     var perPage= 5;
     var page = req.body.Page || 1;
     var getAllBlog= blogModel.find(flterParameter);
     getAllBlog.skip((perPage * page) - perPage).sort({ _id : "-1"})
     .limit(perPage).exec(function(err,data){
        if(err){
          res.json({
              error:false,
              msg:'error',
          });
         }else{ 
          blogModel.countDocuments({}).exec((err,count)=>{
          res.render('my-blog-grid', {records:data,current:page,perPageLimit:perPage,total:count,pages:Math.ceil(count/perPage),moment:moment});
         }); 
       }
     }); 
  });
  
  router.get('/my-blogs/:page',checkLoginUser, function(req, res, next) {
    var perPage = 5;
    var page = req.params.page || 1;
    var getAllBlog= blogModel.find({});
    getAllBlog.skip((perPage * page) - perPage).sort({ _id : "-1"})
      .limit(perPage).exec(function(err,data){
      if(err){
        res.json({
          error:false,
          msg:'error',
        });
      }else{ 
        blogModel.countDocuments({}).exec((err,count)=>{    
        res.render('my-blogs', { title: 'My Blogs',records:data,current:page,total:count,perPageLimit:perPage,pages:Math.ceil(count/perPage),moment:moment});
        }); 
      }
    }); 
  });

/* GET Add blog Page. */
router.get('/add-blogs',checkLoginUser, function(req, res, next) {
    var getAllBlogCategory= blogCatModel.find({});
    getAllBlogCategory.exec(function(err,data){
      if(err) throw err;
      res.render('add-blog', { title: 'My Blogs',records: data});
    });
});

 /* Post Add Blog  */
  router.post('/add-blogs',uploadBlog.single("BlogImg"), async (req, res) => {
   try{
    const addBlogImg = await cloudinary.uploader.upload(req.file.path);
    const BlogDetails =new blogModel({
    blog_title: req.body.BlogTitle,
    blog_category: req.body.BlogCategory,
    blog_image: addBlogImg.secure_url,
    cloudinary_id: addBlogImg.public_id,
    blog_description: req.body.blogDescription,
    });
    BlogDetails.save(function(err,doc){
      if(err){  
        res.json({msg:'error'});  
      }else{  
        res.json({msg:'success'});  
      }  
    })
  
  }catch (err) {
    console.log(err);
  }

  });
  
  /* Edit Blogs */
  
  router.get('/edit-blog/:id', function(req, res, next) {
    var blog_id=req.params.id;
    var blogDetails=blogModel.findById(blog_id);
    blogDetails.exec(function(err,data){
    var getAllBlogCategory= blogCatModel.find({});
    getAllBlogCategory.exec(function(err,dataCat){
    if(err){
        res.json({
          error:false,
          msg:'error',
        });
      }else{
        res.render('edit-blog', {title: 'My Blogs',records:data,record:dataCat,id:blog_id});
      }
    });
   }); 
  });
  
  router.post('/edit-blog',uploadBlog.single("BlogImg"), async (req, res) => {
    try{
    if(req.file){
        let exBlogImage = await blogModel.findById(req.body.id);
      // Delete image from cloudinary
        await cloudinary.uploader.destroy(exBlogImage.cloudinary_id);
        var editBlogImg = await cloudinary.uploader.upload(req.file.path);
        var UpdateDetails= blogModel.findByIdAndUpdate(req.body.id,{blog_title:req.body.BlogTitle,blog_category:req.body.BlogCategory,blog_image:editBlogImg.secure_url,cloudinary_id: editBlogImg.cloudinary_id, blog_description:req.body.description});
    }else{
      var UpdateDetails= blogModel.findByIdAndUpdate(req.body.id,{blog_title:req.body.BlogTitle,blog_category:req.body.BlogCategory,blog_description:req.body.description});
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
  
  router.delete('/delete', function(req, res, next) {
    var blog_id=req.body.id;
    var BlogDelete=blogModel.findByIdAndDelete(blog_id);
    BlogDelete.exec(function(err){
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
  
  /* Enable Blog */
  
  router.post('/enable', function(req, res, next) {
    var blog_id=req.body.id;
    var BlogEnable=blogModel.findByIdAndUpdate(blog_id,{blog_status:"Enable"});
    BlogEnable.exec(function(err){
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
  
  /* Disable Blog */
  
  router.post('/disable', function(req, res, next) {
    var blog_id=req.body.id;
    var BlogDisable=blogModel.findByIdAndUpdate(blog_id,{blog_status:"Disable"});
    BlogDisable.exec(function(err){
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