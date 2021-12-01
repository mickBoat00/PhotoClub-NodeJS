const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/PhotoClub')
.then(()=>console.log('Connected to the MongoDB...'))
.catch(err=>console.error('Could not connect to the MongoDB...', err))

const commentSchema = new mongoose.Schema({
    postID : {
      type:String,
      trim:true,
      required: true,
    },
    commenter : {
      type:String,
      trim:true,
      required: true,
    },
    comment_body: {
      type:String,
      trim:true,
      required: true,
    }
  }, {timestamps: true});
  
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;