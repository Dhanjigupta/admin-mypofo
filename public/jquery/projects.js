$(document).ready(function(){
   GridData();
})
//For Loading Grid Data 
function GridData(){
    $.post('/my-project-grid',$('#mainForm').serialize(),function (data) {
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

// Add Project
$('#btnSubmit').click(function(){
    var params=[
         {id:'projectTitle',message:'<b>Project name field is blank. </b> <br>Please enter project name.',value:'',type:''},
         {id:'projectUrl',message:'<b>Project Url field is blank. </b><br>Please enter project url.',value:'',type:''},
         {id:'projectImage',message:'<b>Project Snapshot field is blank. </b><br>Please upload Snapshot image.',value:'',type:'file'}
     ];
     if(validate(params)){
        var ext = $('#projectImage').val().split('.').pop().toLowerCase();
    	if(ext != "" && $.inArray(ext, ['png','jpg','jpeg']) == -1) {
    		alertBox('<b>Image file type is invalid. Please choose a correct image file.<br>Such as JPG, PNG</b>','#projectImage');
    		return false;
    	}

         bootbox.confirm("<p>Are you sure you want to submit these details?", function(result) {
         if(result==true){
                Wait("Submitting details, please wait...");
                
                // Get form
                 var data = new FormData($('#mainForm')[0]);
                 $.ajax({ 
                    url: '/add-projects',
                    type: 'POST',
                    enctype: 'multipart/form-data',
                    data:data,
                    processData: false, //prevent jQuery from automatically transforming the data into a query string
                    contentType: false,
                    cache: false,
                    success: function(res){
                        box.modal('hide');
                        if (res.msg=='success') {
                            alertBox("<b class='text-success'>Project added successfully.</b>");
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


  // Edit Project

  $('#btnEdit').click(function(){
    var params=[
        {id:'projectTitle',message:'<b>Project name field is blank. </b> <br>Please enter project name.',value:'',type:''},
        {id:'projectUrl',message:'<b>Project Url field is blank. </b><br>Please enter project url.',value:'',type:''},
    ];
    if(validate(params)){
        
       var ext = $('#projectImage').val().split('.').pop().toLowerCase();
       if(ext != "" && $.inArray(ext, ['png','jpg','jpeg']) == -1) {
           alertBox('<b>Image file type is invalid. Please choose a correct image file.<br>Such as JPG, PNG</b>','#projectImage');
           return false;
       }

        bootbox.confirm("<p>Are you sure you want to submit these details?", function(result) {
        if(result==true){
               Wait("Submitting details, please wait...");
               var data = new FormData($('#mainForm')[0]);
               data.append('id',$('#editId').val());
               $.ajax({ 
                  url: '/edit-project',
                  type: 'POST',
                  enctype: 'multipart/form-data',
                  data:data,
                  processData: false, 
                  contentType: false,
                  cache: false,
                  success: function(res){
                       box.modal('hide');
                       if (res.msg=='success') {
                           alertBox("<b class='text-success'>Project updated successfully.</b>");
                           alertbox.on('hidden.bs.modal', function(){ 
                             window.location.href="/my-projects" ;                          
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


   // Delete Project

 function deleteProject(id){
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
                url:'/deleteProject',  
                method:'delete',  
                dataType:'json',  
                data:{'id':id},  
                success:function(response){  
                    if(response.msg=='success'){  
                        swal({
                          title: "Delete project file!", 
                          text: "Project deleted successfully.", 
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

  // Enable / Disable Blogs
  
  function EnableProject(id){
	bootbox.confirm("<p>Are you sure you want to enable?", function(result) {
    if(result==true){
    Wait('Enabling. please wait...');
    $.ajax({  
        url:'/enableProject',  
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

function DisableProject(id){
	bootbox.confirm("<p>Are you sure you want to disable?", function(result) {
    if(result==true){
    Wait('Disabling. please wait...');
    $.ajax({  
        url:'/disableProject',  
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