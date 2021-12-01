const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/PhotoClub')
.then(()=>console.log('Connected to the MongoDB...'))
.catch(err=>console.error('Could not connect to the MongoDB...', err))

const userSchema = new mongoose.Schema({
    firstName : {
      type:String,
      trim:true,
      minlength: 2,
      maxlength:20
    },
    lastName : {
      type:String,
      trim:true,
      minlength: 2,
      maxlength:20
    },
    username : {
      type:String,
      trim:true,
      required: true,
      minlength: 2,
      maxlength:20
    },
    profilePic : {
      type:String,
      trim:true
    },
    password : {
      type:String,
      trim:true,
      required: true,
      minlength: 2
    }
  });
  
  const User = mongoose.model('User', userSchema);

  module.exports = User;