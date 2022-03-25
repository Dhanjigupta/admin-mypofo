$(document).ready(function(){
   GridData();
})
//For Loading Grid Data 
function GridData(){
    //    $.ajax({ 
    //         url: '/my-blog-grid',
    //         type: 'post',
    //         dataType: "json",
    //         data:{
    //             limit: $('#limit').val(),
    //             page: $('#page').val()
    //          },
    //         cache: false,
    //         success: function(res){
    //            alert(res);
    //            $('#grid').html(res)
    //         }
    //     })

    // Grab the data
   
    $.post('/my-blog-grid',$('#mainForm').serialize(),function (data) {
        $('#grid').html(data);
    });
}

function PageJump(page){
    $('#page').val(page);
    $('#mainForm').submit();
}

$('#btn-search').click( function(){
  $('#page').val(1);    
  GridData(); 
})
   
$('#search').keyup( function(){
  $('#page').val(1);  
  GridData(); 
})

// Add Blog
$('#btnSubmit').click(function(){
    var params=[
         {id:'blogTitle',message:'<b>Title field is blank. </b> <br>Please enter blog title.',value:'',type:''},
         {id:'blogCategory',message:'<b>Category field is blank. </b><br>Please choose blog category.',value:'-1',type:'select'},
         {id:'blogImg',message:'<b>Blog image field is blank. </b><br>Please upload blog image.',value:'',type:'file'}
     ];
     if(validate(params)){
         
        var ext = $('#blogImg').val().split('.').pop().toLowerCase();
    	if(ext != "" && $.inArray(ext, ['png','jpg','jpeg']) == -1) {
    		alertBox('<b>Image file type is invalid. Please choose a correct image file.<br>Such as JPG, PNG</b>','#blogImg');
    		return false;
    	}

         bootbox.confirm("<p>Are you sure you want to submit these details?", function(result) {
         if(result==true){
                Wait("Submitting details, please wait...");
                
                // Get form
                 var data = new FormData($('#mainForm')[0]);
                 var description = CKEDITOR.instances.blogDetails.getData();
                 data.append('blogDescription',description);
                 $.ajax({ 
                    url: '/add-blogs',
                    type: 'POST',
                    enctype: 'multipart/form-data',
                    data:data,
                    // data: {
                    //     title: $('#blogTitle').val(),
                    //     category: $('#blogCategory').val(),
                    //     image: $('#blogImg').val(),
                    //     description: CKEDITOR.instances.blogDetails.getData()
                    // },
                    processData: false, //prevent jQuery from automatically transforming the data into a query string
                    contentType: false,
                    cache: false,
                    success: function(res){
                        box.modal('hide');
                        if (res.msg=='success') {
                            alertBox("<b class='text-success'>Blog added successfully.</b>");
                            alertbox.on('hidden.bs.modal', function(){ 
                              window.location.reload();
                            });
                        }
                    },
                    error: function (error) {
                        alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>");
                    }
                })
            }
       });
    }
 });
 

 // Delete Blog

 function deleteBlog(id){
    swal({ 
        title: "Are you sure?", 
        text: "You will not be able to recover !", 
        type: "warning", 
        showCancelButton: true, 
        confirmButtonColor: "#039BE5", 
        confirmButtonText: "Yes, delete it!", 
        cancelButtonText: "No, cancel!", 
        closeOnConfirm: false, 
        closeOnCancel: false 
      }, function (isConfirm) {
        if (isConfirm) { 
            $.ajax({  
                url:'/delete',  
                method:'delete',  
                dataType:'json',  
                data:{'id':id},  
                success:function(response){  
                    if(response.msg=='success'){  
                        swal({
                          title: "Delete blog file!", 
                          text: "Blog deleted successfully.", 
                          type:"success", 
                          confirmButtonColor: "#039BE5"
                        });
                        $('.confirm').click(function() {
                            window.location.reload();
                        }); 

                    }else{  
                        alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>"); 
                    }  
                },  
                error:function(response){  
                    alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>");     
                }  
            });     
        } 
        else {
          swal({ 
            title: "Cancelled", 
            text: "Cancelled Successfully", 
            type: "error", 
            confirmButtonColor: "#039BE5" 
          });
        } 
      });  
  }

  // Edit Blog

  $('#btnEdit').click(function(){
    var params=[
        {id:'blogTitle',message:'<b>Title field is blank. </b> <br>Please enter blog title.',value:'',type:''},
        {id:'blogCategory',message:'<b>Category field is blank. </b><br>Please choose blog category.',value:'-1',type:'select'}
    ];
    if(validate(params)){
        
       var ext = $('#blogImg').val().split('.').pop().toLowerCase();
       if(ext != "" && $.inArray(ext, ['png','jpg','jpeg']) == -1) {
           alertBox('<b>Image file type is invalid. Please choose a correct image file.<br>Such as JPG, PNG</b>','#blogImg');
           return false;
       }

        bootbox.confirm("<p>Are you sure you want to submit these details?", function(result) {
        if(result==true){
               Wait("Submitting details, please wait...");
               var data = new FormData($('#mainForm')[0]);
               var description = CKEDITOR.instances.blogDetails.getData();
               data.append('id',$('#editId').val());
               data.append('description',description);
               $.ajax({ 
                  url: '/edit-blog',
                  type: 'POST',
                  enctype: 'multipart/form-data',
                  data:data,
                  processData: false, 
                  contentType: false,
                  cache: false,
                  success: function(res){
                       box.modal('hide');
                       if (res.msg=='success') {
                           alertBox("<b class='text-success'>Blog updated successfully.</b>");
                           alertbox.on('hidden.bs.modal', function(){ 
                             window.location.href="/my-blogs" ;                          
                           });
                       }
                   },
                   error: function (error) {
                       alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>");
                   }
               })
           }
      });
   }
  });

  // Enable / Disable Blogs
  
  function Enable(id){
	bootbox.confirm("<p>Are you sure you want to enable?", function(result) {
    if(result==true){
    Wait('Enabling. please wait...');
    $.ajax({  
        url:'/enable',  
        method:'post',  
        dataType:'json',  
        data:{'id':id},  
        success:function(response){ 
            box.modal('hide'); 
            if(response.msg=='success'){  
                alertBox("<b class='text-success'>Enabled successfully.</b>");
                alertbox.on('hidden.bs.modal', function(){ 
                  window.location.reload();                          
                });  
            }else{  
                alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>"); 
            }  
        },  
        error:function(response){  
            alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>");     
        }  
    });    
   }
  });
}

function Disable(id){
	bootbox.confirm("<p>Are you sure you want to disable?", function(result) {
    if(result==true){
    Wait('Disabling. please wait...');
    $.ajax({  
        url:'/disable',  
        method:'post',  
        dataType:'json',  
        data:{'id':id},  
        success:function(response){ 
            box.modal('hide'); 
            if(response.msg=='success'){  
                alertBox("<b class='text-success'>Disabled successfully.</b>");
                alertbox.on('hidden.bs.modal', function(){ 
                  window.location.reload();                          
                });  
            }else{  
                alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>"); 
            }  
        },  
        error:function(response){  
            alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>");     
        }  
    });  
   }
  });
}