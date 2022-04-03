const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    blog_title: {
        type: String,
        maxlength: 300,
        required: [true, 'Blog title is required'],
        unique: [true, 'Blog title should be unique'],
        trim: true
    },
    blog_category:{
        type: String,
        required: [true, 'Blog description is required'],
        maxlength: 200
    },
    blog_image:{
        type: String,
        required: true
        //default: 'no-photo.jpg'
    },
    cloudinary_id:{
        type: String,
    },
    blog_description:{
        type: String
    },
    blog_status:{
        type:String,
        enum:[
            'Enable',
            'Disable',
        ],
        default:'Enable'
    },
    createdOn:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('blogs', blogSchema);