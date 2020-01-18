var bodyparser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

process.env.PORT = 3001;
process.env.IP   = "127.0.0.1";
//-------APP CONFIG----------------------------
// mongoose.connect("mongoose://localhost/restful_blog_app");
mongoose.connect("mongodb://localhost:27017/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//--------MONGOOSE/MODEL CONFIG------------------
var blogSchema = new mongoose.Schema({
    title   : String,
    image   : String,
    body    : String,
    created : {type: Date, default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
//     body : "HELLO THIS IS BLOG POST!"
// });

//---------RESTFUL ROUTES-------------------------
app.get("/", function(req, res){
    res.redirect("/blogs");
});
// INDEX ROUTE-------------
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else{
            res.render("index", {blogs:blogs});
        }
    });
});

//-------NEW ROUTE----------
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//-------Create Route--------
app.post("/blogs", function(req, res){
//-------create blog-----------
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("==================");
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else{
        //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});
//-----------Show route---------
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", { blog: foundBlog } );
        }
    });
});
//-----------Edit route------------------
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", { blog: foundBlog });
        }
    });
});
//------------Update route-----------------
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//-------------Delete route-----------------
app.delete("/blogs/:id", function(req, res){
//-------------Destroy blog-----------------
Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
        res.redirect("/blogs");
    } else{
        res.redirect("/blogs");
    }
});
//-------------redirect blog----------------

});


app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("SERVER IS RUNNING !");
});