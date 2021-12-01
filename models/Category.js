const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/PhotoClub')
.then(()=>console.log('Connected to the MongoDB...'))
.catch(err=>console.error('Could not connect to the MongoDB...', err))

const categorySchema = new mongoose.Schema({
    name : {
      type:String,
      trim:true,
      unique: true,
      required: true,
      minlength: 2,
      maxlength:20
    }
});
  
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
