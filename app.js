var bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	express 	= require("express"),
	app 		= express();

// APP CONFIG
mongoose.connect("mongodb://127.0.0.1/discovercali");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

// MONGOOSE/MODEL CONFIG
var gallerySchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Gallery = mongoose.model("Gallery", gallerySchema);

// RESTFUL ROUTES
app.get("/", function(req, res){
	res.redirect("/galleries");
});

// INDEX ROUTE
app.get("/galleries", function(req, res){
	Gallery.find({}, function(err, galleries){
		if(err){
			console.log("ERROR!");
		} else {
			res.render("index", {galleries: galleries});
		}
	});
});

// NEW ROUTE
app.get("/galleries/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/galleries", function(req, res){
	// create blog
	Gallery.create(req.body.gallery, function(err, newGallery){
		if(err){
			res.render("new");
		} else {
			// then, redirect to the index
			res.redirect("/galleries");
		}
	});
});

// SHOW ROUTE
app.get("/galleries/:id", function(req, res){
	Gallery.findById(req.params.id, function(err, foundGallery){
		if(err){
			res.redirect("/galleries");
		} else {
			res.render("show", {gallery: foundGallery});
		}
	});
});

// EDIT ROUTE
app.get("/galleries/:id/edit", function(req, res){
	res.render("edit");
});

// START THE SERVER
app.listen(process.env.PORT ||8080);
console.log("Your server is running!");