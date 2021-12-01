var express = require('express');
var router = express.Router();
const fs = require('fs');

const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

const multer = require('multer');
const uploadPostPic = multer({dest:'public/images/post_pics'});

/* GET home page. */
router.get('/base', async (req,res)=>{
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn })
  
  console.log(userIn)
  console.log(userLoggedIn)


  res.render('base', {userLoggedIn: userLoggedIn})
})

router.get('/', async function(req, res, next) {
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn })

  const posts = await Post.find().sort('-createdAt');
  const categories = await Category.find();
  
  const postAuthors = [];

  for(var i =0; i<posts.length; i++){
    postAuthors.push(await User.findById(posts[i].author))
  }

  // console.log(posts)
  // console.log("====================================")
  // console.log(postAuthors)

  res.render('main', { posts: posts, postAuthors:postAuthors, categories:categories, userLoggedIn:userLoggedIn });
  
});

router.get('/add-photo', async function(req, res, next){
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn })

  if (userLoggedIn  === null){
    return res.end(`<h3>Login to Post.</h3><br><a href="/register">Login</a>`)
  }

  res.render('add-photo', {userLoggedIn:userLoggedIn});
});

router.post('/processPostUpload', uploadPostPic.single('postImg'), async (req,res)=>{

  const newPath = `public/images/post_pics/${req.file.originalname}`

  fs.rename(req.file.path, newPath, ()=>{
    let msg = 'file uploaded.';
  })

  let userIn = req.cookies.username;

  let userLoggedIn = await User.findOne({username:userIn })

  const post = new Post({
    author: userLoggedIn._id,
    image : req.file.originalname,
    category : req.body.postCat,
    description : req.body.postDesc,
  });

  let category = await Category.findOne({name: req.body.postCat });

  if (!category){
    category = new Category({
      name: req.body.postCat,
    });
  
    await post.save();
    await category.save();
  }
  

  console.log(await post.save())
  console.log(await category.save())

  res.redirect('/');
  
});


router.get('/profile/:id', async (req,res)=>{
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn });

  const user = await User.findById(req.params.id);
  
  res.render('profile', {
    user: user,
    username: req.cookies.username,
    userLoggedIn:userLoggedIn
  });
})

router.get('/view-pic/:id', async (req,res)=>{
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn });

  const post = await Post.findById(req.params.id);
  let findUserID = String(post.author);
  const postAuthor = await User.findById(findUserID);
  const comments = await Comment.find({postID: req.params.id})

  console.log(postAuthor)
  console.log("******************")
  console.log(userLoggedIn)

  res.render('view-pic', { post:post, postAuthor:postAuthor, comments:comments, userLoggedIn: userLoggedIn});
})

router.get('/update-pic/:id', async (req,res)=>{
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn });

  const post = await Post.findById(req.params.id);
  
  res.render('update-pic', {post:post, userLoggedIn:userLoggedIn});
})

router.post('/processPostUpdate', uploadPostPic.single('postImg'), async (req,res)=>{

  const newPath = `public/images/post_pics/${req.file.originalname}`

  fs.rename(req.file.path, newPath, ()=>{
    let msg = 'file uploaded.';
  })


  const updatedPost = await Post.findByIdAndUpdate(req.body.postToUpdateID, {
    image: req.file.originalname,
    category: req.body.postCat,
    description: req.body.postDesc
  }, { new:true })

  // console.log(req.body.postToUpdateID)
  
  // console.log(req.body.postCat)
  // console.log(req.body.postDesc)

  res.redirect(`/view-pic/${req.body.postToUpdateID}`)
})

router.get('/view-pic/:id/comment', async function(req, res, next) {

  let postID = req.params.id;

  console.log(postID)

  let userIn = req.cookies.username;

  let userLoggedIn = await User.findOne({username:userIn })

  if (userLoggedIn  === null){
    return res.end('<h3>Login to write a comment.</h3><br><a href="/login">Login</a>')
  }

  res.render('add_comment', { userLoggedIn: userLoggedIn, postID:postID });
});


router.post('/processCommentUpload', async (req,res)=>{

  console.log(req.body.postID);

  const comment = new Comment({
    postID: req.body.postID,
    commenter: req.body.user,
    comment_body : req.body.commentBody,
  });
  
  await comment.save();

  console.log(await comment.save())

  res.redirect(`/view-pic/${req.body.postID}`);
  
});




module.exports = router;
