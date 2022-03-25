const mongoose = require('mongoose');
const blogCategoriesSchema = new mongoose.Schema({
    category: {
        type: String,
        maxlength: 300,
        required: [true, 'Blog category is required'],
        unique: [true, 'Blog category should be unique'],
        trim: true
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
module.exports = mongoose.model('blog_categories', blogCategoriesSchema);