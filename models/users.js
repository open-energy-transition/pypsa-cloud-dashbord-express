const mongoose = require('mongoose');

const  userSchema = new mongoose.Schema({
    name: {
    type: String, trim: true 
    },
    email:{
        type: String, trim: true, required: true, unique: 'Email already used!'
    },
    password:{
        type: String
    }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;