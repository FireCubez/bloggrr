$(document).ready(y);
function y() {
	$.ajax("/Special:API",{
		data:{
			u:localStorage.getItem("u"),
			p:localStorage.getItem("p"),
			cmd:"ls",
			sort:"new",
			amt:10
		},
		method:"POST",
		success:function(r){
			var t="";
			$(r).each(function(i,p){
				t+='<li><a href="/'+p.url+'">'+p.title+'</a> ('+p.date+')&nbsp;<a href="#" data-toggle="popover" title="Configure" data-content=\'<a href="#" onclick="$.ajax(&amp;quot;/Special:API&amp;quot;,{method:&amp;quot;POST&amp;quot;,data:{u:localStorage.getItem(&amp;quot;u&amp;quot;),p:localStorage.getItem(&amp;quot;p&amp;quot;),cmd:&amp;quot;pdel&amp;quot;,ord:'+p.ord+'},success:y,error:function(r){$(&amp;quot;admSt&amp;quot;).html(&amp;quot;<b style=\\&amp;quot;color:red;\\&amp;quot;>&amp;quot;+r.statusText+&amp;quot;</b>&amp;quot;)}})"><i class="glyphicon glyphicon-trash"></i>Delete</a><br><span id="admSt"></span>\' data-placement="bottom" data-html="true">Configure</a></li>';
			});
			$('#postLi').html(t);
			$("#postLi>li>a").popover();
		}
	});
}
function qt() {
	$.ajax("/Special:API",{
		data:{
			u:localStorage.getItem("u"),
			p:localStorage.getItem("p"),
			cmd:"exm"
		},
		method:"POST",
		success:function(r){
			alert("Added");
		}
	});
}