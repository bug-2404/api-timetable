const router = require('express').Router();
const {getStatus, getUser, getSubject, getLearns, postUser, postTimetable, updateTime} = require('../controllers/timetable.js')


router.get('/', getStatus);
router.get('/user/:id',getUser);
router.get('/subject/:id', getSubject);
router.get('/learn?', getLearns);

router.post('/user',postUser);
router.post('/timetable', postTimetable);
router.post('/updateTime',updateTime);

module.exports = router;