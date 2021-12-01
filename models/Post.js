const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/PhotoClub')
.then(()=>console.log('Connected to the MongoDB...'))
.catch(err=>console.error('Could not connect to the MongoDB...', err))

const postSchema = new mongoose.Schema({
    author : {
      type:String,
      trim:true,
      required: true,
    },
    image : {
      type:String,
      trim:true,
    },
    category : {
      type:String,
      trim:true,
      minlength: 2,
      maxlength:20
    },
    description : {
      type:String,
      trim:true,
    },
    comments : {
      type: Array,
      required: false
    }
  }, {timestamps: true});
  
  const Post = mongoose.model('Post', postSchema);

  module.exports = Post;