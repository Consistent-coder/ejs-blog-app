const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");

const homeStartingContent = "At our community, we value mutual respect and positivity. We encourage all members to engage in discussions and contribute content that adds value to the community. When posting, please remember to communicate respectfully, keeping in mind the diverse perspectives and experiences of others. Let's strive to create an inclusive and supportive environment where everyone feels heard and valued. Together, we can foster meaningful conversations and build a community that uplifts and inspires.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


function fetchAllPosts(req,res,next){
  req.postArr=[];
  req.filteredPosts=[];

  fs.readFile("./allPosts.json","utf-8",(err,data)=>{
      if(err){
        return res.render("<h1>Error Occured</h1>");
      }

      req.postArr=JSON.parse(data);
      next();
  })
}

app.use(fetchAllPosts);

app.get("/",(req,res)=>{
  res.render("home",{homeStartingContent:homeStartingContent, postArr:req.postArr,filteredPosts:req.filteredPosts});
})


app.get("/about",(req,res)=>{
  res.render("about",{aboutContent:aboutContent});
})


app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent:contactContent});
})


app.get("/compose",(req,res)=>{ 
  res.render("compose");
})


app.post("/compose",(req,res)=>{ 
  const userInpTitle=req.body.userInpTitle;
  const userInpDesc=req.body.userInpDescription;
  // console.log(userInpTitle,userInpDesc);
  req.post={
    id:Date.now(),
    title:userInpTitle,
    description:userInpDesc
  }

  req.postArr.push(req.post);

  fs.writeFile("./allPosts.json",JSON.stringify(req.postArr),(err)=>{
    if(err){
      return res.render("<h1>Error Occured</h1>");
    }
    res.redirect("/");
  })
})



app.get("/posts/:postId",(req,res)=>{
  // console.log("Inside");
  
  const postId=req.params.postId;

  if(!postId){
    return res.render("<h1>Post not Found</h1>")
  }

   req.filteredPosts=req.postArr.filter((p)=>parseInt(p.id)===parseInt(postId));

  res.render("post",{filteredPosts:req.filteredPosts});
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
