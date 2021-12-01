var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const fs = require('fs');

const User = require('../models/User');

const multer = require('multer');
const uploadProfilePic = multer({dest:'public/images/profile_pics'});


router.get('/login', async function(req, res, next){
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn });
  res.render('login', {userLoggedIn:userLoggedIn});
});

router.post('/processUserLogin', async (req,res)=>{

  const user = await User.findOne({username: req.body.username});
  if(!user) return res.status(400).end(`<h1>Invalid Credentials</h1><br><a href="/users/login">Log In</a> </p>`)

  const validated = await bcrypt.compare(req.body.password, user.password);
  if(!validated) return res.status(400).end(`<h1>Invalid Credentials</h1><br><a href="/users/login">Log In</a> </p>`)

  res.cookie('username', req.body.username);
  
  res.redirect(`/profile/${user._id}`)
})

router.get('/register', async function(req, res, next){
  let userIn = req.cookies.username;
  let userLoggedIn = await User.findOne({username:userIn });

  res.render('register', {userLoggedIn:userLoggedIn});
});

router.post('/processUserRegisteration', uploadProfilePic.single('profile_pic'), async (req,res)=>{

  if (req.body.password1 !== req.body.password2) {
    return res.end(`<h1>Passwords does not match</h1><br><a href="/users/register">Sign Up</a> </p>`)
  }

  console.log(req.file);

  const newPath = `public/images/profile_pics/${req.file.originalname}`

  fs.rename(req.file.path, newPath, ()=>{
    let msg = 'file uploaded.';
  })
  

  const password = req.body.password1;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  let user = new User({
    firstName : req.body.firstName,
    lastName : req.body.lastName,
    username : req.body.username,
    profilePic : req.file.originalname,
    password : hashedPass
  });

  const newUser = await user.save();

  console.log(newUser);

  res.redirect('/users/login');
  
})


router.get('/logout', (req,res)=>{

  res.clearCookie('username');
  res.redirect('/users/login')
})


module.exports = router;
