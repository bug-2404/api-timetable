const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const { MONGODB_URL } = require('./config/keys.js');
const router = require('./routers/timetable.js');
const PORT = process.env.PORT||5000;

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.use('/',router)

mongoose.connect(MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => app.listen(PORT,() => console.log(`Server is running on port: ${PORT}`)))
.catch((err) => console.log(err));
mongoose.set('useFindAndModify',false);

