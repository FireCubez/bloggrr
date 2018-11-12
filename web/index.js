$(document).ready(function(){
	var u=localStorage.getItem("u"),p=localStorage.getItem("p");
	if(u&&p)l(u,p);
});
function k(){l($("#logUsr")[0].value,$("#logPas")[0].value)}
function l(u,p){
	$.ajax("/Special:Login",{
	method:"POST",
	data:{usr:u,pass:p},
	success:function(r){
		$("#logSt").html(
			r.startsWith('a')?'<b style="color:green;">Login Successful</b>':
			r=='b'?'<b style="color:red;">Unknown username</b>':
			r=='c'?'<b style="color:red;">Incorrect password</b>':"");
		if(r.startsWith('a')){
			var a=r=='a+';
			localStorage.setItem("u",u);
			localStorage.setItem("p",p);
			$("#navSt").html("Logged in as "+u);
			var q = $("#nPop");
			var e = q[0];
			q.popover("hide");
			e["data-toggle"]="";
			e.onclick=function(){
				$("#navLog").html(" Login");
				$("#navSt").html("");
				$("#navAdm").html("");
				localStorage.removeItem("u");
				localStorage.removeItem("p");
				e["data-toggle"]="popover";
			}
			$("#navLog").html(" Logout");
			if(a) $("#navAdm").html('<form id="admFrm" action="/Special:Admin" method="post"><input type="hidden" name="u" id="frmUsr"><input type="hidden" name="p" id="frmPass"></form><a href="#" onclick="$(\'#frmUsr\')[0].value=localStorage.getItem(\'u\');$(\'#frmPass\')[0].value=localStorage.getItem(\'p\');$(\'#admFrm\')[0].submit()"><span class="glyphicon glyphicon-cog"></span> Admin</a>');
		}}})
}