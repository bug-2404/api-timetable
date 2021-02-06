const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
        required: true
    },
    name: String,
    numberOfCredits: Number,
    teacher: String
});

module.exports = mongoose.model('subjects',subjectSchema);