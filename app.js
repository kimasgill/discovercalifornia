var bodyParser 	= require("body-parser"),
		mongoose 		= require("mongoose"),
		express 		= require("express"),
		app 				= express();

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



// START THE SERVER
app.listen(process.env.PORT ||8080);
console.log("Your server is running!");