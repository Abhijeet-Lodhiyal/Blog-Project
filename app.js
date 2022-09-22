require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();
const mongoose = require("mongoose");
const md5 = require("md5");
const keys = require('./config/keys')

mongoose.connect(keys.mongoURI);

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
});
const editorSchema = new mongoose.Schema({
    name: String,
    password: String
});
const Item = mongoose.model("Item", blogSchema);
const Editor = mongoose.model("Editor", editorSchema);


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public/"));


app.get('/blogs', (req, res) => {
    Item.find({}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('blogs', { posts: items });
        }
    });
});

app.get('/',function(req,res) {
    res.render('startingPage');
});
app.get("/contact", function (req, res) {
    res.render("contact");
});
app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    const editorName = req.body.name;
    const editorPassword = md5(req.body.password);
    Editor.findOne({ name: editorName }, function (err, results) {
        if (!err) {
            if (results) {
                
                if (results.password == editorPassword) {
                    res.render("compose");
                }
            }
        }
    });
});
app.post("/", function (req, res) {
    const item = new Item({
        title: req.body.postTitle,
        content: req.body.postContent,
    });
    item.save();
    res.redirect('/');
});


app.get("/posts/:cont", function (req, res) {
    let url = _.lowerCase(req.params.cont);
    Item.find(function (err, element) {
        element.forEach(function (data) {
            let title = _.lowerCase(data.title);
            if (url === title) {
                res.render("post", { pageHeader: data.title, pageContent: data.content });
            }
        });
    });

});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function (res) {
    console.log("Listening");
});