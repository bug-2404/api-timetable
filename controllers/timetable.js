const Room = require('../models/rooms.js');
const User = require('../models/users.js');
const Subject = require('../models/subjects.js');
const Learn = require('../models/learns.js');

const {STATIC_DATE} = require('../config/keys.js');
const moment = require('moment');

module.exports.getStatus = (req,res) => {
    res.send('It works');
}

module.exports.getUser = async (req,res) => {
    const { id } = req.params;
    
    try {
        const user = await User.findOne({ id });
        
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports.getSubject = async (req,res) => {
    const { id } = req.params;
    
    try {
        const subject = await Subject.findOne({ id });
        
        return res.status(200).json(subject);
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports.getLearns = async (req,res) => {
    const { user_id, date } = req.query;
    let schedules = [];

    if(user_id !== undefined && date !== undefined ) {
        try {
            const user = await User.findOne({id: user_id});
            if(!user) 
                return res.status(400).json({message: "User doesn't exist."});

            const dateToFind = `${date}T00:00:00.000Z`;
            const learns = await Learn.find({
                user_id: user._id, 
                startedDate: dateToFind
            });
            if(!learns) 
                return res.status(400).json({message: "Learn doesn't exist."});
            try {
                await learns.forEach(async (learn) => {
                
                    const sb = await Subject.findById(learn.subject_id);
                    const room = await Room.findById(learn.room_id);

                    await schedules.push({
                        sb_name: sb.name,
                        room_name: room.name,
                        startedLesson: learn.startedLesson,
                        isPracticed: learn.isPracticed
                    });
                });
                console.log(schedules);
                return res.status(200).json(schedules);
            } catch (error) {
                return res.status(500).json(error);
            }
            
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    else{
        return res.status(201).json({message: '/learn?user_id=...&date=...'})
    }
}

module.exports.postUser =  async (req,res) => {
    const { id } = req.body;

    try {
        const user = await User.findOne({id});
        
        if(user) 
            return res.status(400).json({message: "User already existed."});

        const newUser = new User(req.body);

        await newUser.save().then(() => res.status(200).json({message: "Create new user successfully."}));

    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports.postTimetable = async (req,res) => {
    const user_id = req.body.user_id;
    let currentSubject = req.body.subject;
    let currentTimetable = req.body.timetable;
    try {
        const user = await User.findOne({id:user_id});
        if(!user)
            return res.status(400).json({message: "User doesn't exist."});
        
        const subject = await Subject.findOne({id: currentSubject.id});

        if(!subject){
            const newSubject = new Subject(currentSubject);

            await newSubject.save();
            currentSubject = newSubject;
        }

        currentSubject = subject;

        for(let value of currentTimetable) {
            let room = await Room.findOne({name: value.room_name});
            if(!room) {
                room = new Room({name: value.room_name});

                await room.save();
            }

            let weeks = value.weeks.split('');
            const day = value.day;
            let date;
            for(let index in weeks){
                if(weeks[index] !== '-'){
                    date = moment(STATIC_DATE).add(parseInt(index)*7+day,'days').format('YYYY-MM-DD') +'T00:00:00.000Z';
                    const newLearn = new Learn({
                        user_id: user._id,
                        subject_id: currentSubject._id,
                        room_id: room._id,
                        startedDate: date,
                        numberOfLessons:value.numberOfLessons,
                        startedLesson: value.startedLesson,
                        isPracticed: value.isPracticed
                    });

                    await newLearn.save();
                }
            }

        }

        return res.status(200).json({message:"Create timetable successfully."});
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports.updateTime = async (req,res) => {
    try {
        const learns = await Learn.find();
        
        await learns.forEach(async (learn) => {
            const newStartedDate = moment(learn.startedDate).subtract(2,'days').format('YYYY-MM-DD') + 'T00:00:00.000Z';
            await Learn.findByIdAndUpdate(learn._id,{startedDate: newStartedDate}, {new: true});
        });

        return res.status(200).json({message: "Successful."});
    } catch (error) {
        return res.status(500).json(error);
    }
}