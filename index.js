const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
var app = express();
var str = fs.readFileSync("./web/index.html").toString();
var txt = {}; var cweb = {};
var cadmin = str.replace(/<x-content>/g, fs.readFileSync("./special/admin.html").toString()).replace(/(.*)(<script>.*?<\/script>)<\/body>/, '$1<script src="/Special:Web?f=admin.js"></script>$2</body>');
var csignup = str.replace(/<x-content>/g, fs.readFileSync("./special/signup.html").toString());
var cdel = str.replace(/<x-content>/g, fs.readFileSync("./special/del.html").toString());
var ccomm = fs.readFileSync("./special/comm.html").toString();
var posts = []; var postindex = {};
fs.readdirSync("./posts").forEach(function(post) {
	var m = fs.readFileSync("./posts/"+post).toString().match(/(.+)\n(.+)\n(.+)\n([^<]+)(?:<([^]+))?/);
	var c = {};
	var regex = /<(.*?)>([^<]+)>/g;
	var match;
	while(match = regex.exec(m[5])) {
		c[m[1]] = m[2];
	}
	postindex[post] = m[1];
	posts[m[1]] = {
		ord: m[1],
		date: m[2],
		title: m[3],
		url: post,
		txt: m[4],
		comm: c
	};
});
fs.readdirSync("./web").forEach(function(file) {
	cweb[file] = fs.readFileSync("./web/"+file).toString();
});
var accs = JSON.parse(fs.readFileSync("./accs.json"));
app.use(express.json());
app.use(express.urlencoded());
app.post("/Special([\\:])Login", function(req,res) {
	if(!req.body) {
		res.sendStatus(400);
	}
	else if(!accs[req.body.usr]) {
		res.contentType("text/plain");
		res.send("b")
	} else {
		res.contentType("text/plain");
		res.send((accs[req.body.usr].pass === hash(req.body.pass))?
			accs[req.body.usr].perm?"a+":"a":"c")
	}
});
app.get("/Special([\\:])Web", function(req,res){
	if(!req.query.f) {
		res.sendStatus(400);
	} else {
		res.contentType(req.query.f);
		res.send(cweb[req.query.f]).replace(/\$C_ORD\$/g, req.query.c);
	}
});
app.post("/Special([\\:])Admin", function(req,res){
	if(!valpass(req,res,true)) return;
	if(accs[req.body.u].perm) {
		res.send(cadmin);
	} else {
		res.sendStatus(403);
	}
});
app.get("/Special([\\:])Admin", function(req,res){
	res.send(`<html><head><title>Redirecting</title></head><body onload="document.getElementById('u').value=localStorage.getItem('u');document.getElementById('p').value=localStorage.getItem('p');document.getElementById('f').submit()">Redirecting...<form id="f" action="/Special:Admin" method="post"><input type="hidden" name="u" id="u"><input type="hidden" name="p" id="p"></form></body></html>`);
});
app.get("/Special([\\:])SignUp", function(req,res){
	res.send(csignup);
});
app.post("/Special([\\:])API", function(req,res){
	if(!valpass(req,res,false)) return;
	switch(req.body.cmd) {
		case "ls":
			let sort = req.body.sort;
			let amt = req.body.amt;
			let arr = [];
			let k = 0;
			for(let i = posts.length-1; i >= 0; i--) {
				if(k >= amt) break;
				k++;
				arr.push(posts[i]);
			}
			res.send(arr);
			break;
		case "pdel":
			let ord = req.body.ord;
			fs.unlinkSync("./posts/"+posts[ord].url);
			posts.splice(ord,1);
			res.sendStatus(200);
			break;
		case "pcls":
			res.send(posts[req.body.ord].comm);
			break;
		default:
			res.sendStatus(400);
			break;
	}
});
app.get("/Special([\\:])*", function(req,res){
	res.sendStatus(404);
});
app.get("/favicon.ico", function(req,res){
	res.sendStatus(404);
})
app.get("*", function(req,res) {
	if(valpass(req,res,false)) res.send(str.replace(/<x-content>/g, posts[postindex[req.path.slice(1)]].txt + ccomm)).replace(/(.*)(<script>.*?<\/script>)<\/body>/, '$1<script src="/Special:Web?f=comm.js&c='+postindex[req.path.slice(1)]+'"></script>$2</body>');
});

app.listen(80, _ => console.log("started"));

function hash(str) {
	return crypto.createHash("sha256").update(str).digest("hex");
}

function valpass(req,res,must) {
	var usr = req.body.u;
	var pass = req.body.p;
	if(usr&&pass) {
		if(!accs[usr]) {
			res.send(403, cdel);
			return false;
		}
		if(hash(pass) === accs[usr].pass) return true;
		else {
			res.sendStatus(403);
			return false;
		}
	} else {
		if(must) {
			res.sendStatus(403);
			return false;
		} else return true;
	}
}