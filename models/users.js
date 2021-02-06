const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true
    },
    name: String,
    dateOfBirth: Date,
    role: String
});

module.exports = mongoose.model('users',userSchema);