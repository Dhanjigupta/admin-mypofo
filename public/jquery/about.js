$('#fname').keypress(function(e){return inputLimiter(this,e,'Name');});
$('#mobile').keypress(function(e){return inputLimiter(this,e,'Mobile');});
$('#btn-submit').click(function(){
   var params=[
		{id:'fname',message:'Kindly enter full name.',value:'',type:''},
        {id:'email',message:'Kindly enter your email.',value:'',type:'email'},
        {id:'mobile',message:'Kindly enter mobile number.',value:'',type:'mobile'},
    ];
	if(validate(params)){
		Wait("Saving changes, please wait...");
        $.ajax({
            type: "POST", 
            url: "/update-profile",  
            data: new FormData($("#ProfileForm")[0]),
            enctype: 'multipart/form-data',
     		processData: false,
			contentType: false,
            cache: false,
			success: function(res){
                console.log(res);
                box.modal('hide');
                if (res.msg=='success') {
                    alertBox("<b class='text-success'>Profile updated successfully.</b>");
                    alertbox.on('hidden.bs.modal', function(){ 
                        window.location.reload();
                    });
                }
            },
            error: function (error) {
                alertBox("<b class='text-danger'>Some error occurred. Please try again.</b>");
            }
		});
    }
});
function readURL(input, control) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + control)
            .attr('src', e.target.result)
            .width(72)
            .height(72);
        };
        reader.readAsDataURL(input.files[0]);
    }
}






