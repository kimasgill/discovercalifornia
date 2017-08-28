var bodyParser 		 = require("body-parser"),
	methodOverride 	 = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose 		 = require("mongoose"),
	express 		 = require("express"),
	app 			 = express(),
	uri				 = "mongodb://heroku_lgp3w647:37j1kqilvgthpm564oev40hab1@ds161493.mlab.com:61493/heroku_lgp3w647";

// APP CONFIG
mongoose.connect(uri);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

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
	// create gallery
	req.body.gallery.body = req.sanitize(req.body.gallery.body);
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
	Gallery.findById(req.params.id, function(err, foundGallery){
		if(err){
			res.redirect("/galleries");
		} else {
			res.render("edit", {gallery: foundGallery});
		}
	});
});

// UPDATE ROUTE
app.put("/galleries/:id", function(req, res){
	req.body.gallery.body = req.sanitize(req.body.gallery.body);
	Gallery.findByIdAndUpdate(req.params.id, req.body.gallery, function(err, updatedGallery){
		if(err){
			res.redirect("/galleries");
		} else {
			res.redirect("/galleries/" + req.params.id);
		}
	})
});

// DELETE ROUTE
app.delete("/galleries/:id", function(req, res){
	Gallery.findByIdAndRemove(req.params.id, function(err, deleteGallery){
		if(err){
			res.redirect("/galleries");
		} else {
			res.redirect("/galleries");
		}
	});
});

// START THE SERVER
app.listen(process.env.PORT ||8080);
console.log("Your server is running!");