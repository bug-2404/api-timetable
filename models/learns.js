const mongoose = require('mongoose');

const learnSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    subject_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'subjects'
    },
    room_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'rooms'
    },
    startedDate: Date,
    numberOfLessons: Number,
    startedLesson: Number,
    isPracticed: Boolean
});

module.exports = mongoose.model('learns',learnSchema);