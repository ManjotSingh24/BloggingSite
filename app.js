//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express(); //creates app using express

let posts = []; //let is safer version of var

mongoose.connect("mongodb://localhost:27017/BlogDB", { useNewUrlParser: true });

//schema
const postSchema = {
  postTitle: String,
  postBody: String
}

//mongoose module
const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');//set the view engine using ejs

app.use(bodyParser.urlencoded({ extended: true })); //uses body parser
app.use(express.static("public")); //tells express that our static files our in a public folder


app.get("/", function (req, res) {


  Post.find().then(function (posts, error) {

    res.render("home", { homeStartContent: homeStartingContent, postsHome: posts });

  }).catch(function (error) {
    console.log(error)      // Failure
  });

  //res.render(__dirname + "/views/home.ejs", { homeStartContent: homeStartingContent, postsHome: posts });// when i render the home route i get access to posts array //to render the home file to the server to access -> res.render("home")
  // after comma , we passed a dynamic variable homeStartingContent from app.js to using java scrpt object { key : value}
  //key is the name we use in home/target  file and value is that name of variable from this app.js dile

  // console.log(posts);

})


app.get("/about", function (req, res) {
  res.render(__dirname + "/views/about.ejs", { About_Content: aboutContent });
})

app.get("/contact", function (req, res) {
  res.render(__dirname + "/views/contact.ejs", { Contact_Content: contactContent });
})

app.get("/compose", function (req, res) {
  res.render(__dirname + "/views/compose.ejs");

})




app.post("/compose", function (req, res) //all the data sent from compose file / post's from compose file are handled here
{
  const post = new Post({

    postTitle: req.body.postTitle,
    postBody: req.body.postBody

  });

  posts.push(post);
  post.save();
  res.redirect("/");

})





app.get("/posts/:postId", function (req, res) //Dyanmic URL using express
{
  //console.log(req.params.postName);
  //const requestedPostName = _.lowerCase(req.params.postName);
   const requestedPostId = req.params.postId;
  // console.log(requestedPostId);
  // posts.forEach(function (i) {
  //   var storedTitle = _.lowerCase(i.postTitle); //auto matcalii removes cabat case to means day-1 = day 1
  //   if (storedTitle === requestedPostName) {
  //     res.render("post", {
  //       titleOfPost: i.postTitle,
  //       contentOfPost: i.postBody
  //     })
  //   }
  // })
  console.log(requestedPostId);
  Post.find({ _id:requestedPostId }).then(function (docs,err) {
    console.log(docs);
    //res.send(err);
      res.render("post", {
        
        titleOfPost: docs[0].postTitle,
        contentOfPost: docs[0].postBody
      });
  }).catch(function (err) {
    console.log(err);    // Failure
  });

});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
