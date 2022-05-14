require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const _=require("lodash");
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
const md5=require("md5");

mongoose.connect("mongodb+srv://abhijeetlodhiyalALO:komedymatKRO5@cluster0.35oj1.mongodb.net/MyBlog");

const blogSchema=new mongoose.Schema({
    title:String,
    content:String
});
const editorSchema=new mongoose.Schema({
    name:String,
    password:String
});
const Item=mongoose.model("Item",blogSchema);
const Editor=mongoose.model("Editor",editorSchema);


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function (req,res) {
    Item.find(function(err,results){
        res.render("home",{posts:results});
    });

});
app.get("/contact",function (req,res) {
    res.render("contact");
});
app.get("/about",function (req,res) {
    res.render("about");
});

app.get("/login",function(req,res)
{
    res.render("login");
});

app.post("/login",function(req,res){
const editorName=req.body.name;
const editorPassword=md5(req.body.password);
console.log(editorPassword);
Editor.findOne({name:editorName},function(err,results){
 if(!err)
 {
   
    if(results)
    {
        console.log(results.password);
        if(results.password == editorPassword)
        {
            res.render("compose");
        }
    }

 }
});
});
app.post("/",function(req,res){

const item=new Item({
    title:req.body.postTitle,
    content:req.body.postContent
});
item.save();
res.redirect("/");
});


app.get("/posts/:cont",function(req,res){
    let url=_.lowerCase(req.params.cont);
    Item.find(function(err,element){
        element.forEach(function(data){
        let title=_.lowerCase(data.title);
        if(url === title)
        {
            res.render("post",{pageHeader:data.title,pageContent:data.content});
        }
    });
    });

});
let port=process.env.PORT;
if(port == null || port=="")
{
    port =3000;
}
app.listen(port,function(res){
    console.log("Listening on port 3000");
});