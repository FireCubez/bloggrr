$(document).ready(function(){
	$.ajax("/Special:API",{
		data:{
			u:localStorage.getItem("u"),
			p:localStorage.getItem("p"),
			cmd:"pcls",
			ord:$C_ORD$
		},
		method:"POST",
		success:function(r){
			
		}
	});
}