const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    user_name: {
        type: String,
        maxlength:100,
        required: [true, 'User name is required'],
        unique: [true, 'User name should be unique'],
        trim: true
    },
    user_fullname: {
        type: String,
        maxlength:100,
        trim: true
    },
    user_email: {
        type: String,
        maxlength: 300,
        required: [true, 'User email is required'],
        unique: [true, 'User email should be unique'],
        trim: true
    },
    user_mobile: {
        type: Number,
        maxlength:12,
        trim: true
    },
    user_password: {
        type: String,
        required: [true, 'User password is required'],
        trim: true
    },
    user_image:{
        type: String,
        default: 'user.png'
    },
    user_status:{
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
module.exports = mongoose.model('users', usersSchema);