const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    project_title: {
        type: String,
        maxlength: 300,
        required: [true, 'Project title is required'],
        unique: [true, 'Project title should be unique'],
        trim: true
    },
    project_url:{
        type: String,
        required: [true, 'Project Url is required'],
        maxlength: 200
    },
    porject_image:{
        type: String,
    },
    cloudinary_id:{
        type: String,
    },
    project_status:{
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
module.exports = mongoose.model('projects', projectSchema);